import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("deployment build configuration", () => {
  it("generates Prisma Client before the Next.js production build", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.build).toMatch(
      /^prisma generate && next build --webpack$/,
    );
  });
});
