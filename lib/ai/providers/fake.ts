import type { ChatProvider, EmbeddingProvider } from "../provider";
import type { ChatRequest, ChatResponse, EmbeddingOptions } from "../types";

export class DeterministicFakeChatProvider implements ChatProvider {
  readonly id = "fake-chat";
  constructor(private readonly options: { answer?: string } = {}) {}
  async chat(request: ChatRequest): Promise<ChatResponse> { return { content: this.options.answer ?? JSON.stringify({ answer: request.messages.at(-1)?.content ?? "", claims: [], citationKeys: [], limitations: [] }), finishReason: "stop" }; }
  async *stream(request: ChatRequest) { yield (await this.chat(request)).content; }
}

export class DeterministicFakeEmbeddingProvider implements EmbeddingProvider {
  readonly id = "fake-embedding";
  readonly dimensions: number;
  constructor(options: { dimensions?: number } = {}) { this.dimensions = options.dimensions ?? 8; }
  async embed(text: string, options: EmbeddingOptions): Promise<readonly number[]> {
    void options;
    const vector = Array.from({ length: this.dimensions }, () => 0);
    for (let index = 0; index < text.length; index += 1) vector[index % this.dimensions] += text.charCodeAt(index) / 65535;
    return vector;
  }
  async embedBatch(texts: readonly string[], options: EmbeddingOptions) { return Promise.all(texts.map((text) => this.embed(text, options))); }
}
