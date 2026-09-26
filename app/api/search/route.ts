import { NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/services/search-service";
import { createUpstashRateLimiter, rateLimitResponse } from "@/lib/security/rate-limit";
import { clientIdentity, requestId, withTimeout } from "@/lib/security/request";

const limiter = createUpstashRateLimiter("search");

export async function GET(request: Request) {
  const id = requestId(request);
  const limit = await limiter.consume({ identity: clientIdentity(request), route: "search" });
  if (!limit.allowed) return rateLimitResponse(limit, id, "search");
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 200) ?? "";
  try {
    return NextResponse.json(query ? await withTimeout(searchKnowledge(query), Number(process.env.DB_REQUEST_TIMEOUT_MS || 5_000)) : []);
  } catch {
    return NextResponse.json({ error: { code: "SEARCH_UNAVAILABLE", message: "搜索暂不可用，请稍后重试。", requestId: id } }, { status: 503 });
  }
}
