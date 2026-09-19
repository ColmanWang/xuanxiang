import type { ChatRequest, ChatResponse, EmbeddingOptions } from "./types";

export interface ChatProvider {
  readonly id: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream?(request: ChatRequest): AsyncIterable<string>;
}

export interface EmbeddingProvider {
  readonly id: string;
  readonly dimensions: number;
  embed(text: string, options: EmbeddingOptions): Promise<readonly number[]>;
  embedBatch(texts: readonly string[], options: EmbeddingOptions): Promise<readonly (readonly number[])[]>;
}
