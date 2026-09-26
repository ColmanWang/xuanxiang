import { z, ZodError } from "zod";
import { birthInputSchema } from "@/lib/bazi/schema";
import { liuyaoInputSchema } from "@/lib/liuyao/schema";
import { logRequest } from "@/lib/observability/logger";
import { reportOperationalSignal } from "@/lib/observability/signals";
import { readJsonWithLimit, requestId, RequestTooLargeError, TimeoutError, withTimeout } from "@/lib/security/request";

const MAX_REQUEST_BYTES = 32 * 1024;

const classicContextSchema = z.object({
  classicSlug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  passageId: z.string().trim().min(1).max(160),
}).strict();

const calculationContextSchema = (identity: { engineVersion: string; ruleSetId: string; ruleSetVersion: string; fingerprint: RegExp }, input: z.ZodType) => z.object({
  calculation: z.object({
    engineVersion: z.literal(identity.engineVersion),
    ruleSetId: z.literal(identity.ruleSetId),
    ruleSetVersion: z.literal(identity.ruleSetVersion),
    fingerprint: z.string().min(1).max(200).regex(identity.fingerprint),
    input,
  }).strict(),
}).strict();

const base = { message: z.string().trim().min(1).max(2_000) };
export const aiChatRequestSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("KNOWLEDGE"), ...base, context: z.object({ entitySlug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/) }).strict().optional() }).strict(),
  z.object({ mode: z.literal("CLASSIC"), ...base, context: classicContextSchema.optional() }).strict(),
  z.object({ mode: z.literal("BAZI_EXPLANATION"), ...base, context: calculationContextSchema({ engineVersion: "1.2.0", ruleSetId: "STANDARD_ZIPING", ruleSetVersion: "1.1.0", fingerprint: /^xx-bazi-/ }, birthInputSchema) }).strict(),
  z.object({ mode: z.literal("LIUYAO_EXPLANATION"), ...base, context: calculationContextSchema({ engineVersion: "1.0.0", ruleSetId: "STANDARD_WENWANG_GUA", ruleSetVersion: "1.0.0", fingerprint: /^xx-liuyao-/ }, liuyaoInputSchema) }).strict(),
]);

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type AiReadiness = "UNAVAILABLE" | "CHAT_ONLY" | "SEARCH_ONLY" | "RAG_READY" | "FULL_READY";
export type AiCitation = { id: string; title: string; kind: "PASSAGE" | "KNOWLEDGE" | "PERSON" | "RULE"; href: string; locator?: string };
export type AiAnswerResult = {
  answer: string;
  claims: readonly { id?: string; text: string; citationIds?: readonly string[]; citationKeys?: readonly string[] }[];
  citations: readonly AiCitation[];
  limitations: readonly string[];
  readiness?: AiReadiness;
};

export interface AiAnswerService {
  answer(request: AiChatRequest): Promise<AiAnswerResult>;
}

export interface AiRateLimiter {
  consume(input: { key: string; route: "/api/ai/chat" }): Promise<{ allowed: boolean; retryAfterSeconds?: number }>;
}

function errorResponse(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return Response.json({ error: { code, message, ...extra } }, { status });
}

export function createAiChatHandler(dependencies: { answerService: AiAnswerService; rateLimiter: AiRateLimiter; resolveRateLimitKey?: (request: Request) => string; timeoutMs?: number }) {
  return async function POST(request: Request): Promise<Response> {
    const id = requestId(request);
    const startedAt = performance.now();
    let status = 500;
    let errorCode: string | undefined;
    try {
      if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) { status = 415; errorCode = "UNSUPPORTED_MEDIA_TYPE"; return errorResponse(status, errorCode, "请使用 JSON 提交请求。"); }
      const declaredLength = Number(request.headers.get("content-length"));
      if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) throw new RequestTooLargeError();
      const key = dependencies.resolveRateLimitKey?.(request) || "anonymous";
      const limit = await dependencies.rateLimiter.consume({ key, route: "/api/ai/chat" });
      if (!limit.allowed) {
        status = 429; errorCode = "RATE_LIMITED";
        reportOperationalSignal("rate_limit", { route: "/api/ai/chat", requestId: id, errorCode, status });
        return Response.json(
          { error: { code: "RATE_LIMITED", message: "请求过于频繁，请稍后再试。", requestId: id } },
          { status, headers: { ...(limit.retryAfterSeconds ? { "retry-after": String(limit.retryAfterSeconds) } : {}), "x-request-id": id } },
        );
      }
      const input = aiChatRequestSchema.parse(await readJsonWithLimit(request, MAX_REQUEST_BYTES));
      const result = await withTimeout(dependencies.answerService.answer(input), dependencies.timeoutMs ?? 30_000);
      status = 200;
      return Response.json({ ...result, readiness: result.readiness ?? "CHAT_ONLY" }, { headers: { "x-request-id": id } });
    } catch (error) {
      if (error instanceof RequestTooLargeError) { status = 413; errorCode = "REQUEST_TOO_LARGE"; return errorResponse(status, errorCode, "请求内容过长。"); }
      if (error instanceof ZodError || error instanceof SyntaxError) {
        status = 400; errorCode = "INVALID_REQUEST";
        return errorResponse(status, errorCode, "请求格式不正确。", error instanceof ZodError ? { issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })) } : undefined);
      }
      status = 503; errorCode = error instanceof TimeoutError ? "AI_TIMEOUT" : "AI_UNAVAILABLE";
      reportOperationalSignal("ai_provider_failure", { route: "/api/ai/chat", requestId: id, errorCode, status });
      return errorResponse(status, errorCode, "AI 暂不可用，知识库与推演功能不受影响。");
    } finally {
      logRequest({ requestId: id, route: "/api/ai/chat", status, duration: Math.round(performance.now() - startedAt), errorCode });
    }
  };
}
