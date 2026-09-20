import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitRoute = "ai" | "bazi" | "liuyao" | "search";
export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds?: number; errorCode: "RATE_LIMITED" | "RATE_LIMIT_UNAVAILABLE" };
export interface RateLimitClient { limit(key: string): Promise<{ success: boolean; reset: number }> }

const policies: Record<RateLimitRoute, { requests: number; window: `${number} ${"s" | "m" | "h"}` }> = {
  ai: { requests: 10, window: "1 m" },
  bazi: { requests: 60, window: "1 m" },
  liuyao: { requests: 60, window: "1 m" },
  search: { requests: 120, window: "1 m" },
};

export function createDistributedRateLimiter(options: { client?: RateLimitClient; production?: boolean; prefix?: string; now?: () => number } = {}) {
  const production = options.production ?? process.env.NODE_ENV === "production";
  return {
    async consume(input: { identity: string; route: RateLimitRoute }): Promise<RateLimitResult> {
      if (!options.client) return production ? { allowed: false, errorCode: "RATE_LIMIT_UNAVAILABLE", retryAfterSeconds: 60 } : { allowed: true };
      try {
        const result = await options.client.limit(`${options.prefix ?? "xuanxiang"}:${input.route}:${input.identity}`);
        if (result.success) return { allowed: true };
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - (options.now?.() ?? Date.now())) / 1_000)), errorCode: "RATE_LIMITED" };
      } catch {
        return production ? { allowed: false, retryAfterSeconds: 60, errorCode: "RATE_LIMIT_UNAVAILABLE" } : { allowed: true };
      }
    },
  };
}

export function createUpstashRateLimiter(route: RateLimitRoute) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return createDistributedRateLimiter();
  const policy = policies[route];
  const ratelimit = new Ratelimit({ redis: new Redis({ url, token }), limiter: Ratelimit.slidingWindow(policy.requests, policy.window), prefix: "xuanxiang:ratelimit", analytics: true });
  return createDistributedRateLimiter({ client: ratelimit, prefix: "v1" });
}

export function rateLimitResponse(result: Exclude<RateLimitResult, { allowed: true }>, id: string): Response {
  return Response.json({ error: { code: result.errorCode, message: "请求过于频繁，请稍后重试。", requestId: id } }, { status: 429, headers: { "retry-after": String(result.retryAfterSeconds ?? 60), "x-request-id": id } });
}
