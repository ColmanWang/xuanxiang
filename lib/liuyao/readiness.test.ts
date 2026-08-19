import { describe, expect, it } from "vitest";
import { getLiuyaoFoundationReadiness, validateLiuyaoRuleProvenance } from "./readiness";
import { LIUYAO_RULE_REFERENCES } from "./rule-references";

describe("Liuyao readiness and rule provenance", () => {
  it("keeps rule provenance separate from engine calculation", () => {
    const provenance = validateLiuyaoRuleProvenance();

    expect(provenance.policyCount).toBeGreaterThanOrEqual(7);
    expect(provenance.unsourcedPolicyIds).toContain("HIDDEN_SPIRITS_NOT_IMPLEMENTED_V1");
    expect(LIUYAO_RULE_REFERENCES.some((item) => item.policyId === "NAJIA_JINGFANG_COMMON_V1")).toBe(true);
  });

  it("reports READY_WITH_LIMITATIONS until Passage-level Liuyao citations are completed", () => {
    const readiness = getLiuyaoFoundationReadiness();

    expect(readiness.status).toBe("READY_WITH_LIMITATIONS");
    expect(readiness.checks.some((check) => check.id === "hidden-spirits" && check.status === "LIMITED")).toBe(true);
    expect(readiness.checks.some((check) => check.id === "rule-citations" && check.status === "LIMITED")).toBe(true);
  });
});
