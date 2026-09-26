import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const studioRoot = join(process.cwd(), "app/studio");

function collectProtectedPages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectProtectedPages(path);
    if (entry.name !== "page.tsx") return [];
    if (relative(studioRoot, path) === "login/page.tsx") return [];
    return [path];
  });
}

describe("Studio route access boundary", () => {
  it("authorizes every protected page before rendering it", () => {
    const unguardedPages = collectProtectedPages(studioRoot)
      .filter((path) => !readFileSync(path, "utf8").includes("requireStudioPageAccess()"))
      .map((path) => relative(process.cwd(), path));

    expect(unguardedPages).toEqual([]);
  });
});
