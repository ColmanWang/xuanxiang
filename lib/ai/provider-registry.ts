import { AiError } from "./types";
import type { ChatProvider, EmbeddingProvider } from "./provider";

export type AiReadinessLevel = "UNAVAILABLE" | "CHAT_ONLY" | "SEARCH_ONLY" | "RAG_READY" | "FULL_READY";
export interface AIReadiness { chatConfigured: boolean; chatReady: boolean; embeddingConfigured: boolean; embeddingReady: boolean; indexReady: boolean; ragReady: boolean; level: AiReadinessLevel }

export class ProviderRegistry {
  private readonly chats = new Map<string, ChatProvider>();
  private readonly embeddings = new Map<string, EmbeddingProvider>();
  registerChat(provider: ChatProvider) { this.chats.set(provider.id, provider); return this; }
  registerEmbedding(provider: EmbeddingProvider) { this.embeddings.set(provider.id, provider); return this; }
  getChat(id: string) { const value = this.chats.get(id); if (!value) throw new AiError("CHAT_PROVIDER_UNAVAILABLE", `Chat provider '${id}' is unavailable.`); return value; }
  getEmbedding(id: string) { const value = this.embeddings.get(id); if (!value) throw new AiError("EMBEDDING_PROVIDER_UNAVAILABLE", `Embedding provider '${id}' is unavailable.`); return value; }
}

export function deriveAiReadiness(input: Omit<AIReadiness, "ragReady" | "level">): AIReadiness {
  const ragReady = input.chatReady && input.indexReady;
  const level: AiReadinessLevel = ragReady && input.embeddingReady ? "FULL_READY" : ragReady ? "RAG_READY" : input.chatReady ? "CHAT_ONLY" : input.indexReady ? "SEARCH_ONLY" : "UNAVAILABLE";
  return { ...input, ragReady, level };
}
