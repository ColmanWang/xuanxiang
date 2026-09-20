import { getDefaultAiAnswerService, getDefaultAiReadiness } from "@/lib/ai/runtime";
import { sanitizeCalculationContext } from "@/lib/ai/calculation/sanitize";
import { AiError } from "@/lib/ai/types";
import { DeterministicBaziEngine } from "@/lib/bazi/engine";
import { DeterministicLiuyaoEngine } from "@/lib/liuyao/engine";
import { createAiChatHandler, type AiRateLimiter } from "./handler";
import { publicAiEnabled } from "@/lib/config/features";
import { createUpstashRateLimiter } from "@/lib/security/rate-limit";
import { clientIdentity } from "@/lib/security/request";

const coreService = getDefaultAiAnswerService();
const answerService = {
  async answer(request: Parameters<typeof coreService.answer>[0]) {
    let trustedRequest = request;
    if (request.mode === "BAZI_EXPLANATION" || request.mode === "LIUYAO_EXPLANATION") {
      const calculation = (request.context as { calculation: { fingerprint: string; input: never } }).calculation;
      const chart = request.mode === "BAZI_EXPLANATION"
        ? new DeterministicBaziEngine().calculate(calculation.input)
        : new DeterministicLiuyaoEngine().calculate(calculation.input);
      const fingerprint = "calculationFingerprint" in chart ? chart.calculationFingerprint : chart.fingerprint;
      if (fingerprint !== calculation.fingerprint) throw new AiError("INVALID_CONTEXT", "Calculation fingerprint does not match a server recomputation.");
      trustedRequest = { ...request, context: sanitizeCalculationContext(request.mode === "BAZI_EXPLANATION" ? "BAZI" : "LIUYAO", chart) };
    }
    const result = await coreService.answer(trustedRequest);
    const level = result.citations.length
      ? request.mode === "BAZI_EXPLANATION" || request.mode === "LIUYAO_EXPLANATION" ? "FULL_READY" : "RAG_READY"
      : getDefaultAiReadiness().level;
    return { ...result, readiness: level };
  },
};

const distributedLimiter = createUpstashRateLimiter("ai");
const rateLimiter: AiRateLimiter = { consume: async ({ key }) => distributedLimiter.consume({ identity: key, route: "ai" }) };
const handler = createAiChatHandler({
  answerService,
  rateLimiter,
  resolveRateLimitKey: (request) => clientIdentity(request),
  timeoutMs: Number(process.env.AI_CHAT_TIMEOUT_MS || 30_000),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !publicAiEnabled()) return Response.json({ error: { code: "AI_DISABLED", message: "AI 功能暂未开放。" } }, { status: 503 });
  return handler(request);
}
