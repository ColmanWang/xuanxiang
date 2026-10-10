import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("content import CLI", () => {
  it("keeps production snapshot imports atomic with an explicit timeout", () => {
    const source = readFileSync("scripts/content-import.ts", "utf8");
    const transactionCalls = source.match(/prisma\.\$transaction\(/g) ?? [];

    expect(transactionCalls).toHaveLength(1);
    expect(source).toContain(
      "prisma.$transaction(async (tx) => applyKnowledgeBase(tx, input), { timeout: 120_000 })",
    );
  });
});
