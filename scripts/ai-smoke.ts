import { OpenAiCompatibleChatProvider, OpenAiCompatibleEmbeddingProvider } from "@/lib/ai/providers/openai-compatible";

async function main() {
  const chatKey = process.env.AI_CHAT_API_KEY;
  const embeddingKey = process.env.AI_EMBEDDING_API_KEY;
  if (!chatKey && !embeddingKey) {
    console.log("AI smoke: SKIP (AI_CHAT_API_KEY and AI_EMBEDDING_API_KEY are not configured)");
    return;
  }

  let failed = false;
  if (chatKey) {
    const baseUrl = process.env.AI_CHAT_BASE_URL;
    const model = process.env.AI_CHAT_MODEL;
    if (!baseUrl || !model) {
      console.log("Chat provider: SKIP (AI_CHAT_BASE_URL or AI_CHAT_MODEL is missing)");
    } else {
      try {
        const provider = new OpenAiCompatibleChatProvider({ id: process.env.AI_CHAT_PROVIDER ?? "openai-compatible", baseUrl, apiKey: chatKey, timeoutMs: 15_000, maxRetries: 0 });
        const response = await provider.chat({ model, messages: [{ role: "user", content: "Reply with exactly: XUANXIANG_SMOKE_OK" }], temperature: 0, maxTokens: 16 });
        const ok = response.content.includes("XUANXIANG_SMOKE_OK");
        console.log(`Chat provider: ${ok ? "PASS" : "FAIL"}`);
        failed ||= !ok;
      } catch (error) {
        console.error(`Chat provider: FAIL (${error instanceof Error ? error.message : "unknown error"})`);
        failed = true;
      }
    }
  } else console.log("Chat provider: SKIP (AI_CHAT_API_KEY is not configured)");

  if (embeddingKey) {
    const baseUrl = process.env.AI_EMBEDDING_BASE_URL;
    const model = process.env.AI_EMBEDDING_MODEL;
    const dimensions = Number(process.env.AI_EMBEDDING_DIMENSIONS);
    if (!baseUrl || !model || !Number.isInteger(dimensions) || dimensions <= 0) {
      console.log("Embedding provider: SKIP (base URL, model, or positive dimensions are missing)");
    } else {
      try {
        const provider = new OpenAiCompatibleEmbeddingProvider({ id: process.env.AI_EMBEDDING_PROVIDER ?? "openai-compatible", baseUrl, apiKey: embeddingKey, dimensions, timeoutMs: 15_000, maxRetries: 0 });
        const vector = await provider.embed("玄象 smoke", { model });
        const ok = vector.length === dimensions && vector.every(Number.isFinite);
        console.log(`Embedding provider: ${ok ? "PASS" : "FAIL"} (${vector.length} dimensions)`);
        failed ||= !ok;
      } catch (error) {
        console.error(`Embedding provider: FAIL (${error instanceof Error ? error.message : "unknown error"})`);
        failed = true;
      }
    }
  } else console.log("Embedding provider: SKIP (AI_EMBEDDING_API_KEY is not configured)");
  if (failed) process.exitCode = 1;
}

void main();
