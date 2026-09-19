import { getDefaultAiAnswerService, getDefaultAiReadiness } from "@/lib/ai/runtime";
import { sanitizeCalculationContext } from "@/lib/ai/calculation/sanitize";
import { AiError } from "@/lib/ai/types";
import { DeterministicBaziEngine } from "@/lib/bazi/engine";
import { DeterministicLiuyaoEngine } from "@/lib/liuyao/engine";
import { createAiChatHandler, type AiRateLimiter } from "./handler";

class LocalFixedWindowRateLimiter implements AiRateLimiter {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();
  async consume({ key }: { key: string; route: "/api/ai/chat" }) {
    const now = Date.now();
    const current = this.windows.get(key);
    const window = !current || current.resetAt <= now ? { count: 0, resetAt: now + 60_000 } : current;
    const next = { ...window, count: window.count + 1 };
    this.windows.set(key, next);
    return next.count <= 10 ? { allowed: true } : { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((next.resetAt - now) / 1_000)) };
  }
}

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

const handler = createAiChatHandler({
  answerService,
  rateLimiter: new LocalFixedWindowRateLimiter(),
  // Forwarded addresses are trusted only when deployment explicitly enables its proxy boundary.
  resolveRateLimitKey: (request) => process.env.AI_TRUST_PROXY === "true" ? request.headers.get("x-real-ip") || "anonymous" : "anonymous",
});

export const POST = handler;
