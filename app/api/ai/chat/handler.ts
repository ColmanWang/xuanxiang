import { z, ZodError } from "zod";
import { birthInputSchema } from "@/lib/bazi/schema";
import { liuyaoInputSchema } from "@/lib/liuyao/schema";

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

async function readJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) throw new RequestTooLargeError();
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) throw new RequestTooLargeError();
  return JSON.parse(text);
}

class RequestTooLargeError extends Error {}

export function createAiChatHandler(dependencies: { answerService: AiAnswerService; rateLimiter: AiRateLimiter; resolveRateLimitKey?: (request: Request) => string }) {
  return async function POST(request: Request): Promise<Response> {
    try {
      if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return errorResponse(415, "UNSUPPORTED_MEDIA_TYPE", "请使用 JSON 提交请求。");
      const declaredLength = Number(request.headers.get("content-length"));
      if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) throw new RequestTooLargeError();
      const key = dependencies.resolveRateLimitKey?.(request) || "anonymous";
      const limit = await dependencies.rateLimiter.consume({ key, route: "/api/ai/chat" });
      if (!limit.allowed) {
        return Response.json(
          { error: { code: "RATE_LIMITED", message: "请求过于频繁，请稍后再试。" } },
          { status: 429, headers: limit.retryAfterSeconds ? { "retry-after": String(limit.retryAfterSeconds) } : undefined },
        );
      }
      const input = aiChatRequestSchema.parse(await readJson(request));
      const result = await dependencies.answerService.answer(input);
      return Response.json({ ...result, readiness: result.readiness ?? "CHAT_ONLY" });
    } catch (error) {
      if (error instanceof RequestTooLargeError) return errorResponse(413, "REQUEST_TOO_LARGE", "请求内容过长。");
      if (error instanceof ZodError || error instanceof SyntaxError) {
        return errorResponse(400, "INVALID_REQUEST", "请求格式不正确。", error instanceof ZodError ? { issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })) } : undefined);
      }
      return errorResponse(503, "AI_UNAVAILABLE", "AI 暂不可用，知识库与推演功能不受影响。");
    }
  };
}
