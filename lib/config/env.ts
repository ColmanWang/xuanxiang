import { z } from "zod";

const booleanString = z.enum(["true", "false"]).default("false").transform((value) => value === "true");
const publicSentryDsn = z.url().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.username && !url.password && !url.port
      && /^o\d+\.ingest(?:\.us|\.de)?\.sentry\.io$/.test(url.hostname)
      && /^\/\d+$/.test(url.pathname) && !url.search && !url.hash;
  } catch { return false; }
}, "Public Sentry DSN must be a hosted HTTPS ingestion URL without private credentials");
const productionSchema = z.object({
  NODE_ENV: z.literal("production"),
  DATABASE_URL: z.url(),
  DIRECT_DATABASE_URL: z.url().optional(),
  APP_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  ENABLE_EDITORIAL_STUDIO: booleanString,
  STUDIO_OAUTH_PROVIDER: z.enum(["github", "google"]).optional(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  PUBLIC_AI_ENABLED: booleanString,
  MAINTENANCE_MODE: booleanString,
  // Production rate limiting requires a real per-client identity. Add another
  // literal only after its platform-specific header is verified and tested.
  TRUSTED_PROXY_HEADERS: z.literal("vercel"),
  AI_CHAT_BASE_URL: z.url().optional(),
  AI_CHAT_API_KEY: z.string().min(1).optional(),
  AI_CHAT_MODEL: z.string().min(1).optional(),
  AI_EMBEDDING_BASE_URL: z.url().optional(),
  AI_EMBEDDING_API_KEY: z.string().min(1).optional(),
  AI_EMBEDDING_MODEL: z.string().min(1).optional(),
  SENTRY_DSN: z.url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: publicSentryDsn.optional(),
  APP_VERSION: z.string().min(1).default("unknown"),
  COMMIT_SHA: z.string().min(1).optional(),
}).passthrough().superRefine((env, context) => {
  for (const key of Object.keys(env)) {
    // Sentry's browser ingestion DSN is public by design, not an auth token.
    if (key === "NEXT_PUBLIC_SENTRY_DSN") continue;
    if (/^NEXT_PUBLIC_.*(?:KEY|SECRET|TOKEN|PASSWORD|DATABASE|DSN)/i.test(key)) context.addIssue({ code: "custom", path: [key], message: `${key} must remain server-only` });
  }
  for (const key of ["APP_URL", "BETTER_AUTH_URL", "UPSTASH_REDIS_REST_URL"] as const) {
    if (new URL(env[key]).protocol !== "https:") context.addIssue({ code: "custom", path: [key], message: `${key} must use HTTPS in production` });
  }
  for (const key of ["DATABASE_URL", "DIRECT_DATABASE_URL"] as const) {
    if (!env[key]) continue;
    try {
      if (!["postgres:", "postgresql:"].includes(new URL(env[key]).protocol)) context.addIssue({ code: "custom", path: [key], message: `${key} must be PostgreSQL` });
    } catch { /* the base URL validator reports this without echoing the value */ }
  }
  if (env.ENABLE_EDITORIAL_STUDIO) {
    if (!env.STUDIO_OAUTH_PROVIDER) {
      context.addIssue({ code: "custom", path: ["STUDIO_OAUTH_PROVIDER"], message: "STUDIO_OAUTH_PROVIDER is required when Studio is enabled" });
    } else {
      const required = env.STUDIO_OAUTH_PROVIDER === "github"
        ? (["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"] as const)
        : (["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] as const);
      for (const key of required) {
        if (!env[key]) context.addIssue({ code: "custom", path: [key], message: `${key} is required when Studio is enabled` });
      }
    }
  }
  if (!env.PUBLIC_AI_ENABLED) return;
  for (const key of ["AI_CHAT_BASE_URL", "AI_CHAT_API_KEY", "AI_CHAT_MODEL", "AI_EMBEDDING_BASE_URL", "AI_EMBEDDING_API_KEY", "AI_EMBEDDING_MODEL"] as const) {
    if (!env[key]) context.addIssue({ code: "custom", path: [key], message: `${key} is required when PUBLIC_AI_ENABLED=true` });
  }
});

type ProductionEnv = z.infer<typeof productionSchema>;
type ValidationFailure = { success: false; missing: string[]; message: string };

export class ProductionEnvError extends Error {
  constructor(readonly fields: readonly string[]) {
    super(`Production environment validation failed: ${fields.join(", ")}`);
    this.name = "ProductionEnvError";
  }
}

export function validateProductionEnv(env: Record<string, string | undefined>, options?: { throwOnError?: true }): ProductionEnv;
export function validateProductionEnv(env: Record<string, string | undefined>, options: { throwOnError: false }): ProductionEnv | ValidationFailure;
export function validateProductionEnv(env: Record<string, string | undefined>, options: { throwOnError?: boolean } = {}): ProductionEnv | ValidationFailure {
  const result = productionSchema.safeParse(env);
  if (result.success) return result.data;
  const fields = [...new Set(result.error.issues.map((issue) => String(issue.path[0] ?? "environment")))].sort();
  if (options.throwOnError === false) return { success: false, missing: fields, message: `Invalid production configuration: ${fields.join(", ")}` };
  throw new ProductionEnvError(fields);
}

export function assertProductionEnv(env: Record<string, string | undefined> = process.env): void {
  if (env.NODE_ENV === "production") validateProductionEnv(env);
}
