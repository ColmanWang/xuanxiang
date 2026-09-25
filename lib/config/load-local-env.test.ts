import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

describe("Vitest environment loading", () => {
  it("loads the config when a CI checkout has no .env file", () => {
    const root = fileURLToPath(new URL("../..", import.meta.url));
    const workingDirectory = mkdtempSync(resolve(tmpdir(), "xuanxiang-ci-"));

    try {
      expect(() => execFileSync(process.execPath, [
        "--import",
        resolve(root, "node_modules/tsx/dist/loader.mjs"),
        "-e",
        `import(${JSON.stringify(pathToFileURL(resolve(root, "vitest.config.mts")).href)})`,
      ], { cwd: workingDirectory, stdio: "pipe" })).not.toThrow();
    } finally {
      rmSync(workingDirectory, { recursive: true, force: true });
    }
  });
});
