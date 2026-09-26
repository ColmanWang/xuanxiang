import { beforeEach, describe, expect, it, vi } from "vitest";

const { count, captureMessage, flush, warn, error } = vi.hoisted(() => ({
  count: vi.fn(),
  captureMessage: vi.fn(),
  flush: vi.fn().mockResolvedValue(true),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  metrics: { count },
  captureMessage,
  flush,
}));

vi.mock("./logger", () => ({
  logger: { warn, error },
}));

import { reportOperationalSignal } from "./signals";

describe("operational signals", () => {
  beforeEach(() => vi.clearAllMocks());

  it("counts expected rate-limit denials without creating or flushing an error issue", async () => {
    await reportOperationalSignal("rate_limit", {
      route: "/api/search",
      requestId: "request-1",
      errorCode: "RATE_LIMITED",
      status: 429,
    });

    expect(count).toHaveBeenCalledWith("xuanxiang.operational.signal", 1, {
      attributes: { signal: "rate_limit", route: "/api/search", error_code: "RATE_LIMITED", status: "429" },
    });
    expect(warn).toHaveBeenCalledWith(expect.objectContaining({ signal: "rate_limit", requestId: "request-1" }), "operational.signal");
    expect(captureMessage).not.toHaveBeenCalled();
    expect(flush).not.toHaveBeenCalled();
  });

  it("reports database failures as sanitized error events and flushes them before the response ends", async () => {
    await reportOperationalSignal("database_failure", {
      route: "/api/health",
      requestId: "health-check",
      errorCode: "DATABASE_UNAVAILABLE",
      status: 503,
    });

    expect(count).toHaveBeenCalledWith("xuanxiang.http.5xx", 1, {
      attributes: { route: "/api/health", status: "503" },
    });
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ signal: "database_failure" }), "operational.signal");
    expect(captureMessage).toHaveBeenCalledWith("Operational signal: database_failure", {
      level: "error",
      tags: { signal: "database_failure", route: "/api/health", error_code: "DATABASE_UNAVAILABLE", status: "503" },
      extra: { requestId: "health-check" },
    });
    expect(flush).toHaveBeenCalledWith(2_000);
  });
});
