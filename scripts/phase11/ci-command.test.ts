import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("CI package commands", () => {
  it("allows AI eval to run when the local .env file is absent", () => {
    const packagePath = fileURLToPath(new URL("../../package.json", import.meta.url));
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["ai:eval"]).toContain("--env-file-if-exists=.env");
  });
});
