import { describe, expect, it } from "vitest";
import { evaluateLiuyaoRuleSetStatus, getLiuyaoFoundationReadiness, validateLiuyaoRuleProvenance } from "./readiness";
import { LIUYAO_RULE_REFERENCES } from "./rule-references";

describe("Liuyao readiness and rule provenance", () => {
  it("keeps rule provenance separate from engine calculation", () => {
    const provenance = validateLiuyaoRuleProvenance();

    expect(provenance.policyCount).toBeGreaterThanOrEqual(7);
    expect(provenance.sourcedPolicyIds).toContain("HIDDEN_SPIRITS_NOT_IMPLEMENTED_V1");
    expect(provenance.sourcedPolicyIds).toContain("LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1");
    expect(provenance.unsourcedPolicyIds).not.toContain("LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1");
    expect(LIUYAO_RULE_REFERENCES.some((item) => item.policyId === "NAJIA_JINGFANG_COMMON_V1")).toBe(true);
  });

  it("reports READY_WITH_LIMITATIONS until Passage-level Liuyao citations are completed", () => {
    const readiness = getLiuyaoFoundationReadiness();

    expect(readiness.status).toBe("READY_WITH_LIMITATIONS");
    expect(readiness.checks.some((check) => check.id === "hidden-spirits" && check.status === "LIMITED")).toBe(true);
    expect(readiness.checks.some((check) => check.id === "month-jian" && check.status === "LIMITED")).toBe(true);
  });

  it("keeps the RuleSet experimental while month-jian provenance remains limited", () => {
    expect(evaluateLiuyaoRuleSetStatus()).toEqual(expect.objectContaining({ recommendedStatus: "EXPERIMENTAL", blockers: expect.arrayContaining(["month-jian"]) }));
  });
});
