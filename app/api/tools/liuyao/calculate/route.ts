import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DeterministicLiuyaoEngine } from "@/lib/liuyao/engine";
import { normalizeLiuyaoError, LiuyaoCalculationError } from "@/lib/liuyao/errors";
import { liuyaoInputSchema } from "@/lib/liuyao/schema";
import { createUpstashRateLimiter, rateLimitResponse } from "@/lib/security/rate-limit";
import { clientIdentity, readJsonWithLimit, requestId, RequestTooLargeError } from "@/lib/security/request";

const limiter = createUpstashRateLimiter("liuyao");

function classifyZodError(error: ZodError, raw: unknown): LiuyaoCalculationError {
  if (typeof raw === "object" && raw !== null && "lineOrder" in raw && raw.lineOrder !== "BOTTOM_TO_TOP") {
    return new LiuyaoCalculationError("INVALID_LINE_ORDER", "六爻输入必须按初爻到上爻提交。", "lineOrder");
  }
  if (typeof raw === "object" && raw !== null && "ruleSetId" in raw) {
    return new LiuyaoCalculationError("UNSUPPORTED_RULESET", "暂不支持所选六爻规则。", "ruleSetId");
  }
  if (typeof raw === "object" && raw !== null && "lines" in raw && Array.isArray(raw.lines)) {
    if (raw.lines.length !== 6) return new LiuyaoCalculationError("INVALID_LINE_COUNT", "需要正好六个爻值。", "lines");
    if (raw.lines.some((value) => value !== 6 && value !== 7 && value !== 8 && value !== 9)) {
      return new LiuyaoCalculationError("INVALID_LINE_VALUE", "爻值只能是 6、7、8、9。", "lines");
    }
  }
  const dateIssue = error.issues.find((issue) => issue.path.join(".").startsWith("divinationTime.localDateTime"));
  if (dateIssue) return new LiuyaoCalculationError("INVALID_DATE", "起卦时间格式不正确。", "divinationTime.localDateTime");
  return new LiuyaoCalculationError("INVALID_INPUT", "输入信息不完整或格式不正确。");
}

export async function POST(request: Request) {
  const id = requestId(request);
  let raw: unknown;
  try {
    const limit = await limiter.consume({ identity: clientIdentity(request), route: "liuyao" });
    if (!limit.allowed) return rateLimitResponse(limit, id);
    raw = await readJsonWithLimit(request, 64 * 1024);
  } catch (error) {
    if (error instanceof RequestTooLargeError) return NextResponse.json({ error: { code: "REQUEST_TOO_LARGE", message: "请求内容过长。" } }, { status: 413 });
    return NextResponse.json({ error: { code: "INVALID_INPUT", message: "请求体必须是 JSON。" } }, { status: 400 });
  }

  try {
    const input = liuyaoInputSchema.parse(raw);
    return NextResponse.json({ chart: new DeterministicLiuyaoEngine().calculate(input) });
  } catch (error) {
    const normalized = error instanceof ZodError ? classifyZodError(error, raw) : normalizeLiuyaoError(error);
    return NextResponse.json(
      { error: { code: normalized.code, message: normalized.message, field: normalized.field, details: normalized.details } },
      { status: normalized.code === "INVALID_LINE_COUNT" || normalized.code === "INVALID_LINE_VALUE" ? 400 : 422 },
    );
  }
}
