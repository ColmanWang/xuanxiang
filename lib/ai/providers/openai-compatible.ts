import type { ChatProvider, EmbeddingProvider } from "../provider";
import { AiError, type ChatRequest, type ChatResponse, type EmbeddingOptions } from "../types";

type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
interface CommonOptions { id: string; baseUrl: string; apiKey: string; timeoutMs?: number; maxRetries?: number; retryDelayMs?: number; fetcher?: Fetcher }
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

abstract class OpenAiCompatibleBase {
  readonly id: string;
  protected readonly endpoint: string;
  #apiKey: string;
  #timeoutMs: number; #maxRetries: number; #retryDelayMs: number; #fetcher: Fetcher;
  protected constructor(options: CommonOptions) {
    if (typeof window !== "undefined") throw new AiError("AI_NOT_CONFIGURED", "AI providers are server-only.");
    this.id = options.id; this.endpoint = options.baseUrl.replace(/\/+$/, ""); this.#apiKey = options.apiKey;
    this.#timeoutMs = options.timeoutMs ?? 15_000; this.#maxRetries = Math.min(2, Math.max(0, options.maxRetries ?? 1)); this.#retryDelayMs = options.retryDelayMs ?? 100; this.#fetcher = options.fetcher ?? fetch;
  }
  protected async post(path: string, body: unknown): Promise<unknown> {
    for (let attempt = 0; attempt <= this.#maxRetries; attempt += 1) {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), this.#timeoutMs);
      try {
        const response = await this.#fetcher(`${this.endpoint}${path}`, { method: "POST", headers: { authorization: `Bearer ${this.#apiKey}`, "content-type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
        if (!response.ok) {
          if (RETRYABLE.has(response.status) && attempt < this.#maxRetries) { await this.delay(); continue; }
          throw new AiError(response.status === 429 ? "RATE_LIMITED" : "CHAT_PROVIDER_UNAVAILABLE", `AI provider request failed (${response.status}).`);
        }
        return await response.json();
      } catch (error) {
        if (error instanceof AiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new AiError("PROVIDER_TIMEOUT", "AI provider request timed out.", error);
        if (attempt < this.#maxRetries) { await this.delay(); continue; }
        throw new AiError("CHAT_PROVIDER_UNAVAILABLE", "AI provider is unavailable.", error);
      } finally { clearTimeout(timer); }
    }
    throw new AiError("CHAT_PROVIDER_UNAVAILABLE", "AI provider is unavailable.");
  }
  private delay() { return this.#retryDelayMs > 0 ? new Promise<void>((resolve) => setTimeout(resolve, this.#retryDelayMs)) : Promise.resolve(); }
  toJSON() { return { id: this.id, configured: Boolean(this.#apiKey) }; }
}

export class OpenAiCompatibleChatProvider extends OpenAiCompatibleBase implements ChatProvider {
  constructor(options: CommonOptions) { super(options); }
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const data = await this.post("/chat/completions", { model: request.model, messages: request.messages, temperature: request.temperature ?? 0, max_tokens: request.maxTokens, response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined, tools: undefined }) as { choices?: Array<{ message?: { content?: string }; finish_reason?: string }> };
    const choice = data.choices?.[0]; if (!choice?.message?.content) throw new AiError("MODEL_OUTPUT_INVALID", "Provider returned no chat content.");
    return { content: choice.message.content, finishReason: choice.finish_reason };
  }
}

export class OpenAiCompatibleEmbeddingProvider extends OpenAiCompatibleBase implements EmbeddingProvider {
  readonly dimensions: number;
  constructor(options: CommonOptions & { dimensions: number }) { super(options); this.dimensions = options.dimensions; }
  async embed(text: string, options: EmbeddingOptions) { return (await this.embedBatch([text], options))[0]; }
  async embedBatch(texts: readonly string[], options: EmbeddingOptions) {
    const data = await this.post("/embeddings", { model: options.model, input: texts, dimensions: this.dimensions }) as { data?: Array<{ index: number; embedding: number[] }> };
    const sorted = [...(data.data ?? [])].sort((a, b) => a.index - b.index).map((item) => item.embedding);
    if (sorted.length !== texts.length || sorted.some((item) => item.length !== this.dimensions)) throw new AiError("MODEL_OUTPUT_INVALID", "Provider returned invalid embeddings.");
    return sorted;
  }
}
