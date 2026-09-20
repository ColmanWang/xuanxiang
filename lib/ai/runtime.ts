import { createAiAnswerService, type AiAnswerService } from "./answer-service";
import type { ChatProvider } from "./provider";
import { ProviderRegistry, deriveAiReadiness, type AIReadiness } from "./provider-registry";
import { OpenAiCompatibleChatProvider } from "./providers/openai-compatible";
import { OpenAiCompatibleEmbeddingProvider } from "./providers/openai-compatible";
import { prisma } from "@/lib/prisma";
import { exportKnowledgeBase } from "@/lib/content/database";
import { createContentSnapshotManifest } from "@/lib/content/export";
import { buildIndexableDocuments } from "./indexing/source-documents";
import { RagIndexRepository } from "@/lib/repositories/rag-index-repository";
import { VectorRepository } from "@/lib/repositories/vector-repository";
import type { EmbeddingProvider } from "./provider";
import { AiError, type AiAnswerRequest, type RetrievalResult } from "./types";

class UnavailableChatProvider implements ChatProvider {
  readonly id = "unconfigured";
  async chat(): Promise<never> { throw new AiError("AI_NOT_CONFIGURED", "Chat provider is not configured."); }
}
export interface DefaultAiRuntimeOptions { retrieve?: (request: AiAnswerRequest) => Promise<readonly RetrievalResult[]>; indexReady?: boolean }

function configuredChat(): { provider: ChatProvider; model: string; configured: boolean } {
  const baseUrl = process.env.AI_CHAT_BASE_URL?.trim(); const apiKey = process.env.AI_CHAT_API_KEY?.trim(); const model = process.env.AI_CHAT_MODEL?.trim();
  if (!baseUrl || !apiKey || !model) return { provider: new UnavailableChatProvider(), model: model || "unconfigured", configured: false };
  return { provider: new OpenAiCompatibleChatProvider({ id: "openai-compatible-chat", baseUrl, apiKey, timeoutMs: Number(process.env.AI_CHAT_TIMEOUT_MS || 15_000) }), model, configured: true };
}

function configuredEmbedding(): { provider?: EmbeddingProvider; model: string } {
  const baseUrl = process.env.AI_EMBEDDING_BASE_URL?.trim(); const apiKey = process.env.AI_EMBEDDING_API_KEY?.trim(); const model = process.env.AI_EMBEDDING_MODEL?.trim() || "unconfigured";
  const dimensions = Number(process.env.AI_EMBEDDING_DIMENSIONS || "1536");
  if (!baseUrl || !apiKey || model === "unconfigured" || !Number.isInteger(dimensions) || dimensions < 1) return { model };
  return { provider: new OpenAiCompatibleEmbeddingProvider({ id: process.env.AI_EMBEDDING_PROVIDER?.trim() || "openai-compatible", baseUrl, apiKey, dimensions, timeoutMs: Number(process.env.AI_EMBEDDING_TIMEOUT_MS || 15_000) }), model };
}

function searchTerms(value: string): string[] {
  const normalized = value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  return [...new Set([normalized, ...Array.from({ length: Math.max(0, normalized.length - 1) }, (_, index) => normalized.slice(index, index + 2))].filter((term) => term.length > 1))];
}

function defaultRetriever() {
  const embedding = configuredEmbedding();
  const retrieve = async (request: AiAnswerRequest): Promise<readonly RetrievalResult[]> => {
    const content = await exportKnowledgeBase(prisma);
    const manifests = new RagIndexRepository(prisma);
    const manifest = embedding.provider
      ? await manifests.manifestFor(embedding.provider.id, embedding.model)
      : await manifests.latestManifest();
    const checksum = createContentSnapshotManifest(content).checksum;
    if (!manifest || manifest.state !== "CURRENT" || manifest.contentSnapshotChecksum !== checksum) return [];
    const current = buildIndexableDocuments(content);
    const allowed = new Map(current.map((document) => [document.documentId, document]));
    let vectorMatches: Awaited<ReturnType<VectorRepository["search"]>> = [];
    if (embedding.provider && manifest.provider === embedding.provider.id && manifest.model === embedding.model) {
      try {
        const queryVector = await embedding.provider.embed(request.message, { model: embedding.model });
        vectorMatches = await new VectorRepository(prisma).search({ vector: queryVector, provider: embedding.provider.id, model: embedding.model, dimensions: embedding.provider.dimensions, limit: 20 });
      } catch {
        vectorMatches = [];
      }
    }
    const vectorScores = new Map(vectorMatches.map((match) => [match.documentId, match.score]));
    const terms = searchTerms(request.message);
    const contextualId = request.context && typeof request.context === "object" ? String((request.context as { entitySlug?: string; classicSlug?: string }).entitySlug ?? (request.context as { classicSlug?: string }).classicSlug ?? "") : "";
    const directEntityIds = new Set(current.filter((document) => {
      const text = `${document.entityId} ${document.section} ${document.text}`.toLowerCase();
      return Boolean(contextualId && (document.entityId.includes(contextualId) || document.classicId === contextualId)) || terms.some((term) => text.includes(term));
    }).map((document) => document.entityId));
    const graphEntityIds = new Set(content.relations.flatMap((relation) => {
      if (directEntityIds.has(relation.sourceId)) return [relation.targetId];
      if (directEntityIds.has(relation.targetId)) return [relation.sourceId];
      return [];
    }));
    return current.map((document): RetrievalResult => {
      const text = `${document.entityId} ${document.section} ${document.text}`.toLowerCase();
      const matches = terms.filter((term) => text.includes(term));
      const exact = contextualId && (document.entityId.includes(contextualId) || document.classicId === contextualId) ? 1 : 0;
      const vectorSimilarity = vectorScores.get(document.documentId) ?? 0;
      const graphDistance = graphEntityIds.has(document.entityId) ? 1 : undefined;
      return { document: { ...document, updatedAt: manifest.lastIndexedAt.toISOString() } as RetrievalResult["document"], score: exact * 4 + matches.length * 0.15 + vectorSimilarity + (graphDistance ? 0.5 : 0), retrievalMethods: [...(exact ? ["EXACT" as const] : []), ...(matches.length ? ["LEXICAL" as const] : []), ...(vectorScores.has(document.documentId) ? ["VECTOR" as const] : []), ...(graphDistance ? ["GRAPH" as const] : [])], matchedTerms: matches, graphDistance, citationCoverage: document.citationIds.length ? 1 : 0, editorialStatus: document.editorialStatus as RetrievalResult["editorialStatus"], signals: { exactMatch: exact, lexicalScore: matches.length, vectorSimilarity, graphDistance } };
    }).filter((result) => allowed.has(result.document.documentId) && result.score > 0).sort((a, b) => b.score - a.score).slice(0, 20);
  };
  return async (request: AiAnswerRequest): Promise<readonly RetrievalResult[]> => {
    try { return await retrieve(request); }
    catch { return []; }
  };
}

export function getDefaultAiReadiness(options: DefaultAiRuntimeOptions = {}): AIReadiness {
  const chat = configuredChat(); const embeddingConfigured = Boolean(process.env.AI_EMBEDDING_BASE_URL && process.env.AI_EMBEDDING_API_KEY && process.env.AI_EMBEDDING_MODEL);
  return deriveAiReadiness({ chatConfigured: chat.configured, chatReady: chat.configured, embeddingConfigured, embeddingReady: embeddingConfigured, indexReady: options.indexReady ?? false });
}

export function getDefaultAiAnswerService(options: DefaultAiRuntimeOptions = {}): AiAnswerService {
  const chat = configuredChat(); const registry = new ProviderRegistry().registerChat(chat.provider);
  return createAiAnswerService({ chatProvider: registry.getChat(chat.provider.id), chatModel: chat.model, retrieve: options.retrieve ?? defaultRetriever() });
}
