import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";

const originalMaintenance = process.env.MAINTENANCE_MODE;
const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
afterEach(() => {
  process.env.MAINTENANCE_MODE = originalMaintenance;
  if (originalDsn === undefined) delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  else process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn;
});

describe("production request proxy", () => {
  it.each(["o123.ingest.us.sentry.io", "o123.ingest.de.sentry.io", "o123.ingest.sentry.io"])("allows only configured ingest origin %s without exposing the DSN", (host) => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = `https://publickey@${host}/456`;
    const policy = proxy(new NextRequest("https://xuanxiang.example/tools/bazi")).headers.get("content-security-policy")!;
    expect(policy).toContain(`connect-src 'self' https://${host};`);
    expect(policy).not.toContain("publickey");
    expect(policy).not.toContain("*.sentry.io");
    expect(policy).not.toContain("unsafe-inline");
  });

  it.each(["", "garbage", "http://key@o123.ingest.sentry.io/456", "https://key@evil.example/456", "https://key@o123.ingest.sentry.io.evil.example/456", "https://key:secret@o123.ingest.sentry.io/456", "https://key@o123.ingest.sentry.io:444/456", "https://key@o123.ingest.sentry.io/not-a-project", "https://o123.ingest.sentry.io/456", "https://key@o123.ingest.sentry.io/456?extra=1", "https://key@o123.ingest.sentry.io/456#extra"]) (
    "keeps connections restricted for invalid or unsupported DSN %s", (dsn) => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = dsn;
      const policy = proxy(new NextRequest("https://xuanxiang.example/tools/bazi")).headers.get("content-security-policy")!;
      expect(policy.split("; ").find((part) => part.startsWith("connect-src"))).toBe("connect-src 'self'");
    },
  );
  it("adds a request ID and a nonce-based CSP without unsafe-inline", () => {
    process.env.MAINTENANCE_MODE = "false";
    const response = proxy(new NextRequest("https://xuanxiang.example/knowledge"));
    expect(response.headers.get("x-request-id")).toBeTruthy();
    expect(response.headers.get("content-security-policy")).toContain("'nonce-");
    expect(response.headers.get("content-security-policy")).not.toContain("'unsafe-inline'");
    expect(response.headers.get("content-security-policy")).toContain("connect-src 'self'");
  });

  it("keeps health available during maintenance", async () => {
    process.env.MAINTENANCE_MODE = "true";
    expect(proxy(new NextRequest("https://xuanxiang.example/api/health")).status).toBe(200);
    const blocked = proxy(new NextRequest("https://xuanxiang.example/api/search?q=x"));
    expect(blocked.status).toBe(503);
    await expect(blocked.json()).resolves.toMatchObject({ error: { code: "MAINTENANCE" } });
  });
});
