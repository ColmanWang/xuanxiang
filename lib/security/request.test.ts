import { describe, expect, it, vi } from "vitest";
import { RequestTooLargeError, TimeoutError, clientIdentity, readJsonWithLimit, withTimeout } from "./request";

describe("request boundaries", () => {
  it("rejects a declared oversized body without reading it", async () => {
    const request = new Request("http://local", { method: "POST", headers: { "content-length": "100" }, body: "{}" });
    await expect(readJsonWithLimit(request, 10)).rejects.toBeInstanceOf(RequestTooLargeError);
  });

  it("rejects an actual oversized body", async () => {
    const request = new Request("http://local", { method: "POST", body: JSON.stringify({ x: "长".repeat(10) }) });
    await expect(readJsonWithLimit(request, 10)).rejects.toBeInstanceOf(RequestTooLargeError);
  });

  it("cancels a chunked body as soon as it crosses the byte limit", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"x":"1234'));
        controller.enqueue(new TextEncoder().encode('567890"}'));
      },
      cancel,
    });
    const request = new Request("http://local", { method: "POST", body: stream, duplex: "half" } as RequestInit & { duplex: "half" });
    await expect(readJsonWithLimit(request, 10)).rejects.toBeInstanceOf(RequestTooLargeError);
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("uses only the explicitly selected platform header", () => {
    const request = new Request("http://local", { headers: {
      "x-real-ip": "198.51.100.10",
      "x-forwarded-for": "198.51.100.11",
      "x-vercel-forwarded-for": "203.0.113.7, 10.0.0.1",
    } });
    expect(clientIdentity(request, "vercel")).toBe("203.0.113.7");
    expect(clientIdentity(request, "none")).toBe("anonymous");
  });

  it("does not treat the legacy boolean switch or malformed platform values as trusted", () => {
    const request = new Request("http://local", { headers: {
      "x-real-ip": "attacker-controlled",
      "x-forwarded-for": "198.51.100.11",
      "x-vercel-forwarded-for": "not-an-ip",
    } });
    expect(clientIdentity(request, "vercel")).toBe("anonymous");
    expect(clientIdentity(request, "true" as never)).toBe("anonymous");
  });

  it("aborts work and returns a stable timeout error", async () => {
    await expect(withTimeout(new Promise(() => undefined), 1)).rejects.toBeInstanceOf(TimeoutError);
  });
});
