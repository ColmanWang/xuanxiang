export type StudioOAuthProvider = "github" | "google";

export interface StudioOAuthConfig {
  provider: StudioOAuthProvider;
  clientId: string;
  clientSecret: string;
}

type AuthEnvironment = Readonly<Record<string, string | undefined>>;

export function readStudioOAuthConfig(environment: AuthEnvironment = process.env): StudioOAuthConfig {
  const provider = environment.STUDIO_OAUTH_PROVIDER?.trim().toLowerCase();
  if (!provider) throw new Error("STUDIO_OAUTH_PROVIDER is required for Studio authentication.");
  if (provider !== "github" && provider !== "google") throw new Error("STUDIO_OAUTH_PROVIDER must be github or google.");

  const prefix = provider === "github" ? "GITHUB" : "GOOGLE";
  const clientId = environment[`${prefix}_CLIENT_ID`]?.trim();
  const clientSecret = environment[`${prefix}_CLIENT_SECRET`]?.trim();
  if (!clientId || !clientSecret) throw new Error(`${provider === "github" ? "GitHub" : "Google"} OAuth client credentials are required.`);
  return { provider, clientId, clientSecret };
}

export function getStudioOAuthConfig(environment: AuthEnvironment = process.env): StudioOAuthConfig | null {
  try {
    return readStudioOAuthConfig(environment);
  } catch {
    return null;
  }
}
