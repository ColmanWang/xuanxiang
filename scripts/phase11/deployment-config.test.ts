import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolvePrismaCliDatabaseUrl } from "../../prisma.config";

describe("deployment build configuration", () => {
  it("generates Prisma Client before the Next.js production build", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.build).toMatch(
      /^prisma generate && next build --webpack$/,
    );
  });

  it("uses the direct URL for Prisma CLI and removes Neon's incompatible channel binding option", () => {
    const url = resolvePrismaCliDatabaseUrl({
      NODE_ENV: "production",
      DATABASE_URL:
        "postgresql://runtime:runtime@runtime-pooler.example.test/app?sslmode=require&channel_binding=require",
      DIRECT_DATABASE_URL:
        "postgresql://migration:migration@direct.example.test/app?sslmode=require&channel_binding=require&schema=public",
    }, ["migrate", "deploy"]);

    expect(url).toBe(
      "postgresql://migration:migration@direct.example.test/app?sslmode=require&schema=public",
    );
  });

  it("falls back to DATABASE_URL for local development without a direct URL", () => {
    expect(
      resolvePrismaCliDatabaseUrl({
        NODE_ENV: "development",
        DATABASE_URL:
          "postgresql://local:local@localhost:5432/xuanxiang?schema=public",
      }, ["generate"]),
    ).toBe("postgresql://local:local@localhost:5432/xuanxiang?schema=public");
  });

  it("rejects production migrations without a direct URL", () => {
    expect(() =>
      resolvePrismaCliDatabaseUrl({
        NODE_ENV: "production",
        DATABASE_URL:
          "postgresql://runtime:do-not-expose@runtime-pooler.example.test/app",
      }, ["migrate", "deploy"]),
    ).toThrowError(
      "DIRECT_DATABASE_URL is required for production database operations.",
    );
  });

  it("generates production clients using only runtime credentials", () => {
    expect(resolvePrismaCliDatabaseUrl({ NODE_ENV: "production", DATABASE_URL: "postgresql://runtime:fake@runtime-pooler.example.test/app", DIRECT_DATABASE_URL: "postgresql://migration:fake@direct.example.test/app" }, ["generate"])).toBe("postgresql://runtime:fake@runtime-pooler.example.test/app");
    expect(resolvePrismaCliDatabaseUrl({ NODE_ENV: "production", DATABASE_URL: "postgresql://runtime:fake@runtime-pooler.example.test/app" }, ["generate"])).toContain("runtime-pooler");
  });

  it("requires direct credentials for production db push", () => {
    expect(() => resolvePrismaCliDatabaseUrl({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://runtime:fake@runtime-pooler.example.test/app",
    }, ["db", "push"])).toThrow("DIRECT_DATABASE_URL is required for production database operations.");
  });

  it("fails safely for malformed or pooled migration targets", () => {
    for (const url of ["not-a-url-secret", "postgresql://fake:fake@ep-test-pooler.neon.tech/app", "https://secret.example.test"]) {
      expect(() => resolvePrismaCliDatabaseUrl({ NODE_ENV: "production", DIRECT_DATABASE_URL: url }, ["migrate", "status"])).toThrow("Invalid Prisma database configuration.");
    }
  });

  it("keeps the application runtime on the pooled DATABASE_URL", () => {
    const prismaRuntime = readFileSync("lib/prisma.ts", "utf8");

    expect(prismaRuntime).toContain("process.env.DATABASE_URL");
    expect(prismaRuntime).not.toContain("DIRECT_DATABASE_URL");
  });
});
