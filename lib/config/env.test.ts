import { describe, expect, it } from "vitest";
import { validateProductionEnv } from "./env";

const base = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://app:secret@db.example/xuanxiang",
  DIRECT_DATABASE_URL: "postgresql://migration:secret@db.example/xuanxiang",
  APP_URL: "https://xuanxiang.example",
  BETTER_AUTH_SECRET: "a".repeat(32),
  BETTER_AUTH_URL: "https://xuanxiang.example",
  UPSTASH_REDIS_REST_URL: "https://redis.example",
  UPSTASH_REDIS_REST_TOKEN: "token",
  TRUSTED_PROXY_HEADERS: "vercel",
};

describe("validateProductionEnv", () => {
  it("accepts a hosted public Sentry DSN", () => {
    expect(validateProductionEnv({ ...base, NEXT_PUBLIC_SENTRY_DSN: "https://publickey@o123.ingest.us.sentry.io/456" })).toMatchObject({ NODE_ENV: "production" });
  });

  it.each([
    "http://publickey@o123.ingest.us.sentry.io/456",
    "https://publickey:password@o123.ingest.us.sentry.io/456",
    "https://publickey@evil.example/456",
    "not-a-url",
    "https://publickey@o123.ingest.us.sentry.io/456?token=secret",
  ])("rejects unsafe public Sentry DSN without echoing it", (dsn) => {
    const result = validateProductionEnv({ ...base, NEXT_PUBLIC_SENTRY_DSN: dsn }, { throwOnError: false });
    expect(result).toMatchObject({ success: false, missing: ["NEXT_PUBLIC_SENTRY_DSN"] });
    expect(JSON.stringify(result)).not.toContain(dsn);
  });

  it.each(["NEXT_PUBLIC_AUTH_TOKEN", "NEXT_PUBLIC_DATABASE_URL", "NEXT_PUBLIC_OTHER_DSN", "NEXT_PUBLIC_SENTRY_AUTH_TOKEN"])("still rejects %s", (key) => {
    expect(validateProductionEnv({ ...base, [key]: "private" }, { throwOnError: false })).toMatchObject({ success: false, missing: [key] });
  });
  it("accepts a production deployment with public AI disabled", () => {
    expect(validateProductionEnv({ ...base, PUBLIC_AI_ENABLED: "false" }).PUBLIC_AI_ENABLED).toBe(false);
  });

  it("accepts production runtime without migration credentials", () => {
    const withoutDirectUrl: Record<string, string> = { ...base };
    delete withoutDirectUrl.DIRECT_DATABASE_URL;
    const result = validateProductionEnv(
      { ...withoutDirectUrl, PUBLIC_AI_ENABLED: "false" },
      { throwOnError: false },
    );

    expect(result).toMatchObject({ PUBLIC_AI_ENABLED: false });
  });

  it("does not expose secret values when validation fails", () => {
    const result = validateProductionEnv({ ...base, DATABASE_URL: "not-a-url" }, { throwOnError: false });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result)).not.toContain("app:secret");
  });

  it("requires both AI providers when public AI is enabled", () => {
    const result = validateProductionEnv({ ...base, PUBLIC_AI_ENABLED: "true" }, { throwOnError: false });
    expect(result).toMatchObject({ success: false });
    if (!result.success) expect(result.missing).toContain("AI_CHAT_API_KEY");
  });

  it("rejects production URLs that are not HTTPS", () => {
    expect(validateProductionEnv({ ...base, APP_URL: "http://xuanxiang.example" }, { throwOnError: false })).toMatchObject({ success: false });
  });

  it("rejects secret-shaped values in the public namespace", () => {
    const result = validateProductionEnv({ ...base, NEXT_PUBLIC_AI_API_KEY: "leak" }, { throwOnError: false });
    expect(result).toMatchObject({ success: false });
    if (!result.success) expect(result.missing).toContain("NEXT_PUBLIC_AI_API_KEY");
  });

  it("requires an explicitly supported trusted proxy platform", () => {
    expect(validateProductionEnv({ ...base, TRUSTED_PROXY_HEADERS: "true" }, { throwOnError: false })).toMatchObject({ success: false });
    expect(validateProductionEnv({ ...base, TRUSTED_PROXY_HEADERS: "none" }, { throwOnError: false })).toMatchObject({ success: false });
    const withoutProxyIdentity: Record<string, string> = { ...base };
    delete withoutProxyIdentity.TRUSTED_PROXY_HEADERS;
    expect(validateProductionEnv(withoutProxyIdentity, { throwOnError: false })).toMatchObject({ success: false });
    expect(validateProductionEnv({ ...base, TRUSTED_PROXY_HEADERS: "vercel" }, { throwOnError: false })).toMatchObject({ TRUSTED_PROXY_HEADERS: "vercel" });
  });

  it("requires the selected OAuth credentials when Studio is enabled", () => {
    const missing = validateProductionEnv({ ...base, ENABLE_EDITORIAL_STUDIO: "true" }, { throwOnError: false });
    expect(missing).toMatchObject({ success: false });
    if (!missing.success) expect(missing.missing).toContain("STUDIO_OAUTH_PROVIDER");

    expect(validateProductionEnv({
      ...base,
      ENABLE_EDITORIAL_STUDIO: "true",
      STUDIO_OAUTH_PROVIDER: "github",
      GITHUB_CLIENT_ID: "client-id",
      GITHUB_CLIENT_SECRET: "client-secret",
    })).toMatchObject({ ENABLE_EDITORIAL_STUDIO: true, STUDIO_OAUTH_PROVIDER: "github" });
  });
});
