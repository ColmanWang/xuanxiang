import { describe, expect, it } from "vitest";
import { sanitizeEvent, sanitizeLogData } from "./redaction";

describe("observability redaction", () => {
  it("redacts prompts, calculation input, credentials and cookies recursively", () => {
    const safe = sanitizeLogData({ prompt: "private", input: { date: "1990-01-01" }, headers: { authorization: "Bearer secret", cookie: "session=x" }, ok: 1 });
    expect(safe).toEqual({ prompt: "[REDACTED]", input: "[REDACTED]", headers: { authorization: "[REDACTED]", cookie: "[REDACTED]" }, ok: 1 });
  });

  it("removes request data and sensitive headers before error reporting", () => {
    const event = sanitizeEvent({ request: { data: "prompt", cookies: { x: "y" }, headers: { authorization: "secret", accept: "json" } } });
    expect(event.request).toEqual({ headers: { authorization: "[REDACTED]", accept: "json" } });
  });
});
