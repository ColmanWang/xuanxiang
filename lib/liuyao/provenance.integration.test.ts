import { describe, expect, it } from "vitest";
import { LIUYAO_KNOWN_DIFFERENCES } from "./known-differences";
import { getLiuyaoRuleProvenance, getLiuyaoRulesForPassage, validateLiuyaoRuleProvenanceIntegrity } from "./provenance";

describe("Liuyao rule provenance integration", () => {
  it("maps stable calculation policies through citations to passages", async () => {
    const entries = await getLiuyaoRuleProvenance();
    const najia = entries.find((entry) => entry.policyId === "NAJIA_JINGFANG_COMMON_V1");
    const palace = entries.find((entry) => entry.policyId === "EIGHT_PALACES_V1");
    const shiYing = entries.find((entry) => entry.policyId === "SHI_YING_EIGHT_PALACES_V1");
    expect(najia?.citations[0]).toEqual(expect.objectContaining({ passageId: "passage-xiangshi-najia", classicSlug: "xiangshi-jiashuo" }));
    expect(palace?.citations[0]).toEqual(expect.objectContaining({ passageId: "passage-shilin-eight-palaces", classicSlug: "shilin-guangji" }));
    expect(shiYing?.citations[0]?.readerHref).toContain("view=research");
  });

  it("keeps the six-spirit policy citation aligned with the adopted 戊/己起例", async () => {
    const entries = await getLiuyaoRuleProvenance();
    const sixSpirits = entries.find((entry) => entry.policyId === "SIX_SPIRITS_DAY_STEM_V1");

    expect(sixSpirits?.citations[0]).toEqual(expect.objectContaining({
      passageId: "passage-zengshan-six-spirits-table",
      classicSlug: "zengshan-buyi",
    }));
    expect(LIUYAO_KNOWN_DIFFERENCES.some((item) => item.id === "six-spirit-wu-ji-start-variant")).toBe(true);
  });

  it("resolves a passage back to its calculation policy", async () => {
    expect(await getLiuyaoRulesForPassage("passage-xiangshi-najia")).toEqual([
      expect.objectContaining({ policyId: "NAJIA_JINGFANG_COMMON_V1", href: "/tools/liuyao/rules#NAJIA_JINGFANG_COMMON_V1" }),
    ]);
  });

  it("rejects dangling production citation ids", async () => {
    const validation = await validateLiuyaoRuleProvenanceIntegrity();
    expect(validation.valid).toBe(true);
    expect(validation.missingPolicyIds).toEqual([]);
  });
});
