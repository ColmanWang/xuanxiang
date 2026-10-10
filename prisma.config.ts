import "dotenv/config";
import { defineConfig } from "prisma/config";

type PrismaCliEnvironment = Record<string, string | undefined>;

export function resolvePrismaCliDatabaseUrl(
  environment: PrismaCliEnvironment,
  args: readonly string[] = process.argv.slice(2),
): string {
  const databaseOperation = args.includes("migrate") || args.includes("db");
  const directDatabaseUrl = environment.DIRECT_DATABASE_URL?.trim();
  if (environment.NODE_ENV === "production" && databaseOperation && !directDatabaseUrl) {
    throw new Error(
      "DIRECT_DATABASE_URL is required for production database operations.",
    );
  }

  const configuredUrl = databaseOperation
    ? directDatabaseUrl || environment.DATABASE_URL?.trim()
    : environment.DATABASE_URL?.trim();

  if (!configuredUrl) {
    throw new Error(
      "DIRECT_DATABASE_URL or DATABASE_URL is required for Prisma CLI.",
    );
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
    if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      (environment.NODE_ENV === "production" && databaseOperation && url.hostname.includes("-pooler"))) {
      throw new Error();
    }
  } catch {
    throw new Error("Invalid Prisma database configuration.");
  }
  if (url.searchParams.get("channel_binding") === "require") {
    url.searchParams.delete("channel_binding");
  }

  return url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: resolvePrismaCliDatabaseUrl(process.env),
  },
  migrations: {
    seed: "./node_modules/.bin/tsx prisma/seed.ts",
  },
});
