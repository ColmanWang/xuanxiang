import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";

const originalMaintenance = process.env.MAINTENANCE_MODE;
afterEach(() => { process.env.MAINTENANCE_MODE = originalMaintenance; });

describe("production request proxy", () => {
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
