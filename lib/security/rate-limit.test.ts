import { describe, expect, it, vi } from "vitest";
import { createDistributedRateLimiter } from "./rate-limit";

describe("distributed rate limiter", () => {
  it("uses only the caller identity and route namespace as the key", async () => {
    const limit = vi.fn(async () => ({ success: true, reset: Date.now() + 1_000 }));
    const limiter = createDistributedRateLimiter({ client: { limit }, prefix: "xx" });
    await limiter.consume({ identity: "198.51.100.5", route: "ai" });
    expect(limit).toHaveBeenCalledWith("xx:ai:198.51.100.5");
  });

  it("fails closed in production when Redis is unavailable", async () => {
    const limiter = createDistributedRateLimiter({ production: true });
    await expect(limiter.consume({ identity: "anonymous", route: "search" })).resolves.toMatchObject({ allowed: false, errorCode: "RATE_LIMIT_UNAVAILABLE" });
  });

  it("returns a Retry-After duration from the backend reset", async () => {
    const now = 1_000;
    const limiter = createDistributedRateLimiter({ now: () => now, client: { limit: async () => ({ success: false, reset: 4_100 }) } });
    await expect(limiter.consume({ identity: "a", route: "ai" })).resolves.toEqual({ allowed: false, retryAfterSeconds: 4, errorCode: "RATE_LIMITED" });
  });
});
