export const AI_ERROR_CODES = [
  "AI_NOT_CONFIGURED", "CHAT_PROVIDER_UNAVAILABLE", "EMBEDDING_PROVIDER_UNAVAILABLE", "RAG_NOT_READY",
  "INVALID_CONTEXT", "CONTEXT_NOT_FOUND", "UNSUPPORTED_AI_MODE", "GROUNDING_FAILED", "INVALID_CITATION",
  "MODEL_OUTPUT_INVALID", "RATE_LIMITED", "PROVIDER_TIMEOUT",
] as const;

export type AiErrorCode = (typeof AI_ERROR_CODES)[number];
export class AiError extends Error {
  constructor(public readonly code: AiErrorCode, message: string, public readonly cause?: unknown) {
    super(message); this.name = "AiError";
  }
}

export type AiMode = "KNOWLEDGE" | "CLASSIC" | "BAZI_EXPLANATION" | "LIUYAO_EXPLANATION";
export type ChatRole = "system" | "user" | "assistant";
export interface ChatMessage { role: ChatRole; content: string }
export interface ChatRequest { model: string; messages: readonly ChatMessage[]; temperature?: number; maxTokens?: number; responseFormat?: "json" | "text" }
export interface AiUsageMetadata { provider: string; model: string; requestType: AiMode | "EMBEDDING"; inputTokens?: number; outputTokens?: number; latencyMs: number }
export interface ChatResponse { content: string; finishReason?: string; usage?: Omit<AiUsageMetadata, "provider" | "model" | "requestType" | "latencyMs"> }
export interface EmbeddingOptions { model: string }

export type RagEntityType = "KNOWLEDGE_ENTRY" | "PASSAGE" | "INTERPRETATION" | "CLASSIC_SUMMARY" | "PERSON_SUMMARY" | "SCHOOL_SUMMARY" | "TECHNIQUE_SUMMARY";
export type RagSourceType = "PRODUCTION_CONTENT" | "DEVELOPMENT_FIXTURE" | "REGRESSION_FIXTURE" | "SAMPLE_CONTENT";
export type RagEditorialStatus = "BASIC" | "REVIEWED" | "CONTESTED" | "DRAFT" | "ARCHIVED";
export type RagPublicationStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export interface RagDocument {
  documentId: string; entityType: RagEntityType; entityId: string; section: string; text: string;
  sourceType: RagSourceType; citationIds: readonly string[]; passageId?: string; classicId?: string;
  editorialStatus: RagEditorialStatus; publicationStatus: RagPublicationStatus; evidenceStatus?: string; updatedAt: string;
}
export type RetrievalMethod = "EXACT" | "LEXICAL" | "VECTOR" | "GRAPH";
export interface RetrievalSignals { exactMatch?: number; lexicalScore?: number; vectorSimilarity?: number; entityImportance?: number; graphDistance?: number }
export interface RetrievalResult { document: RagDocument; score: number; retrievalMethods: readonly RetrievalMethod[]; matchedTerms: readonly string[]; graphDistance?: number; citationCoverage: number; editorialStatus: RagEditorialStatus; signals: RetrievalSignals }
export interface CitationContext { key: string; document: RagDocument; citationId?: string; passageId?: string; sourceId?: string }
export interface AiClaim { text: string; citationKeys: readonly string[] }
export interface AiAnswer { answer: string; claims: readonly AiClaim[]; citationKeys: readonly string[]; limitations: readonly string[] }
export type CitationKind = "PASSAGE" | "KNOWLEDGE" | "PERSON" | "RULE";
export interface ValidatedCitation { id: string; key: string; title: string; kind: CitationKind; href: string; locator?: string; documentId: string; citationId?: string; passageId?: string; sourceId?: string }
export interface AiAnswerResult extends AiAnswer { citations: readonly ValidatedCitation[]; usage?: AiUsageMetadata; refusal?: "INSUFFICIENT_CONTEXT" }
export interface AiAnswerRequest { mode: AiMode; message: string; context?: unknown }
