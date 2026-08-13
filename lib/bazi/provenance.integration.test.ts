import { describe, expect, it } from "vitest";
import { getRuleProvenance, getRulesForPassage, validateRuleProvenance } from "./provenance";

describe("Rule provenance integration", () => {
  it("maps both production luck policies through Citation to Passage and Classic", async () => {
    const entries = await getRuleProvenance();
    expect(entries).toHaveLength(2);
    expect(entries.every((entry) => entry.citations.length === 1)).toBe(true);
    expect(entries.every((entry) => entry.citations[0].classicSlug === "sanming-tonghui")).toBe(true);
    expect(entries.every((entry) => entry.citations[0].readerHref?.includes("?passage="))).toBe(true);
  });
  it("reverse maps Passage to policy", async () => {
    expect(await getRulesForPassage("passage-sanming-direction-2")).toEqual([expect.objectContaining({ policyId: "LUCK_DIRECTION_YEAR_STEM_SEX_V1" })]);
  });
  it("validates stable provenance without dangling citations", async () => {
    expect(await validateRuleProvenance()).toMatchObject({ valid: true, missingPolicyIds: [] });
  });
});
