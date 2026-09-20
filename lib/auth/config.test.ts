import { describe, expect, it } from "vitest";
import { readStudioOAuthConfig } from "./config";

describe("Studio OAuth configuration", () => {
  it("configures exactly one selected provider", () => {
    expect(readStudioOAuthConfig({ STUDIO_OAUTH_PROVIDER: "github", GITHUB_CLIENT_ID: "id", GITHUB_CLIENT_SECRET: "secret" })).toEqual({
      provider: "github", clientId: "id", clientSecret: "secret",
    });
    expect(readStudioOAuthConfig({ STUDIO_OAUTH_PROVIDER: "google", GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "secret" })).toEqual({
      provider: "google", clientId: "id", clientSecret: "secret",
    });
  });

  it("fails closed for missing or mixed configuration", () => {
    expect(() => readStudioOAuthConfig({})).toThrow("STUDIO_OAUTH_PROVIDER");
    expect(() => readStudioOAuthConfig({ STUDIO_OAUTH_PROVIDER: "github", GITHUB_CLIENT_ID: "id" })).toThrow("GitHub");
    expect(() => readStudioOAuthConfig({ STUDIO_OAUTH_PROVIDER: "other" })).toThrow("github or google");
  });
});
