import { afterEach, describe, expect, it, vi } from "vitest";
import { productionSmoke } from "../production-smoke";

afterEach(() => vi.unstubAllGlobals());

describe("production smoke helper", () => {
  it("uses only GET and deterministic calculation POST requests", async () => {
    const requests: Array<{ path: string; method: string; body?: string }> = [];
    vi.stubGlobal("fetch", vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      const url = new URL(String(input));
      requests.push({ path: url.pathname, method: init?.method ?? "GET", body: init?.body ? String(init.body) : undefined });
      if (url.pathname === "/api/search") return Response.json([]);
      if (url.pathname === "/api/tools/bazi/calculate") return Response.json({ chart: { calculationFingerprint: "xx-bazi-fixed" } });
      if (url.pathname === "/api/tools/liuyao/calculate") return Response.json({ chart: { fingerprint: "xx-liuyao-fixed", primaryHexagram: { name: "丰" }, changedHexagram: { name: "随" } } });
      return new Response("ok");
    }));

    const results = await productionSmoke(new URL("https://staging.example.test"));
    expect(results.every((result) => result.ok)).toBe(true);
    expect(requests.filter((request) => request.method === "POST").map((request) => request.path).sort()).toEqual([
      "/api/tools/bazi/calculate", "/api/tools/liuyao/calculate",
    ]);
    expect(requests.find((request) => request.path === "/api/tools/bazi/calculate")?.body).toContain('"year":2024');
    expect(requests.find((request) => request.path === "/api/tools/liuyao/calculate")?.body).toContain('"lines":[7,8,9,7,6,8]');
  });

  it("requires grounded citations when AI smoke is explicitly enabled", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: URL | RequestInfo) => {
      const url = new URL(String(input));
      if (url.pathname === "/api/search") return Response.json([]);
      if (url.pathname === "/api/tools/bazi/calculate") return Response.json({ chart: { calculationFingerprint: "xx-bazi-fixed" } });
      if (url.pathname === "/api/tools/liuyao/calculate") return Response.json({ chart: { fingerprint: "xx-liuyao-fixed", primaryHexagram: { name: "丰" }, changedHexagram: { name: "随" } } });
      if (url.pathname === "/api/ai/chat") return Response.json({ answer: "ungrounded", citations: [] });
      return new Response("ok");
    }));
    const results = await productionSmoke(new URL("https://staging.example.test"), true);
    expect(results.find((result) => result.name.includes("Ask"))).toMatchObject({ ok: false });
  });
});
