import { LIUYAO_FULL_CHART_FIXTURES } from "@/fixtures/liuyao/full-charts";
import { STANDARD_WENWANG_GUA } from "./rules";
import { LIUYAO_RULE_REFERENCES } from "./rule-references";

export type LiuyaoFoundationReadinessStatus = "READY" | "READY_WITH_LIMITATIONS" | "BLOCKED";
export type LiuyaoReadinessCheckStatus = "PASS" | "LIMITED" | "FAIL";

export interface LiuyaoReadinessCheck {
  id: string;
  label: string;
  status: LiuyaoReadinessCheckStatus;
  note: string;
}

export interface LiuyaoFoundationReadiness {
  status: LiuyaoFoundationReadinessStatus;
  engineVersion: string;
  ruleSetId: string;
  ruleSetVersion: string;
  checks: LiuyaoReadinessCheck[];
}

export function validateLiuyaoRuleProvenance() {
  const policies = Object.values(STANDARD_WENWANG_GUA.policies);
  const sourcedPolicyIds = new Set(LIUYAO_RULE_REFERENCES.filter((item) => item.citationIds.length > 0).map((item) => item.policyId));
  const referencedPolicyIds = new Set(LIUYAO_RULE_REFERENCES.map((item) => item.policyId));
  const missingReferencePolicyIds = policies.map((item) => item.id).filter((id) => !referencedPolicyIds.has(id));
  const unsourcedPolicyIds = policies.map((item) => item.id).filter((id) => !sourcedPolicyIds.has(id));

  return {
    policyCount: policies.length,
    referenceCount: LIUYAO_RULE_REFERENCES.length,
    sourcedPolicyIds: [...sourcedPolicyIds],
    unsourcedPolicyIds,
    missingReferencePolicyIds,
  };
}

export function getLiuyaoFoundationReadiness(): LiuyaoFoundationReadiness {
  const provenance = validateLiuyaoRuleProvenance();
  const fixtureCounts = LIUYAO_FULL_CHART_FIXTURES.reduce(
    (acc, fixture) => ({ ...acc, [fixture.tier]: acc[fixture.tier] + 1 }),
    { A: 0, B: 0, C: 0 },
  );
  const checks: LiuyaoReadinessCheck[] = [
    { id: "hexagrams", label: "64 卦结构", status: "PASS", note: "六十四卦、八卦组合、4096 动变不变量已由单元测试覆盖。" },
    { id: "palace-shi-ying", label: "八宫与世应", status: "PASS", note: "生产算法与独立 golden table 交叉验证。" },
    { id: "najia", label: "纳甲", status: "PASS", note: "纳甲表与独立 pure-trigram golden table 交叉验证；Passage 典据仍待整理。" },
    { id: "calendar", label: "日辰与月建", status: "PASS", note: "复用 Calendar Core、IANA 时区与节气基础设施，不依赖 Bazi Engine。" },
    { id: "rule-citations", label: "规则典据", status: provenance.sourcedPolicyIds.length > 0 ? "PASS" : "LIMITED", note: "Phase 8 先提供 RuleReference 表现层；六爻规则 Passage 级 Citation 待 Phase 8.5。" },
    { id: "fixtures", label: "完整盘 fixtures", status: LIUYAO_FULL_CHART_FIXTURES.length >= 5 ? "PASS" : "LIMITED", note: `当前完整盘 fixture：Tier A ${fixtureCounts.A}，Tier B ${fixtureCounts.B}，Tier C ${fixtureCounts.C}。` },
    { id: "hidden-spirits", label: "伏神", status: "LIMITED", note: "伏神/飞神未实现，避免在资料不足时给出不稳定结果。" },
  ];

  return {
    status: checks.some((check) => check.status === "FAIL")
      ? "BLOCKED"
      : checks.some((check) => check.status === "LIMITED")
        ? "READY_WITH_LIMITATIONS"
        : "READY",
    engineVersion: "1.0.0",
    ruleSetId: STANDARD_WENWANG_GUA.id,
    ruleSetVersion: STANDARD_WENWANG_GUA.version,
    checks,
  };
}
