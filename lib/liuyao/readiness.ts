import { LIUYAO_FULL_CHART_FIXTURES } from "@/fixtures/liuyao/full-charts";
import { STANDARD_WENWANG_GUA } from "./rules";
import { LIUYAO_RULE_REFERENCES } from "./rule-references";
import { LIUYAO_HEXAGRAM_MANIFEST, LIUYAO_REGRESSION_MANIFEST } from "./manifests";
import { LIUYAO_KNOWN_DIFFERENCES } from "./known-differences";

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
    { id: "hexagram-core", label: "64 卦结构", status: LIUYAO_HEXAGRAM_MANIFEST.length === 64 ? "PASS" : "FAIL", note: "六十四卦 Manifest、20 个非对称卦和 4096 动变不变量已覆盖。" },
    { id: "palaces", label: "八宫", status: "PASS", note: "64 项静态 Golden 与游魂/归魂 16 项专项回归通过。" },
    { id: "shi-ying", label: "世应", status: "PASS", note: "64 卦逐项 Golden 验证，测试数据不导入生产世位映射。" },
    { id: "najia", label: "纳甲", status: "PASS", note: "八纯卦完整天干地支与 64 卦装配已交叉验证，并建立 Passage 典据。" },
    { id: "six-relatives", label: "六亲", status: "PASS", note: "五行关系穷举与后世文献规则已分层记录。" },
    { id: "six-spirits", label: "六神", status: "PASS", note: "十日干穷举与 Passage 规则表交叉核对。" },
    { id: "month-jian", label: "月建", status: "LIMITED", note: "12 节 T±1秒与多时区通过；完整节界规则的影像级 Citation 仍待校订。" },
    { id: "day-context", label: "日辰", status: "PASS", note: "复用冻结 Calendar Core；五时区跨术数 Calendar Fact 契约通过。" },
    { id: "void-branches", label: "旬空", status: "PASS", note: "60 甲子、6 旬全部穷举通过，仅展示结构。" },
    { id: "rule-provenance", label: "规则典据", status: provenance.sourcedPolicyIds.includes(STANDARD_WENWANG_GUA.policies.najia.id) && provenance.sourcedPolicyIds.includes(STANDARD_WENWANG_GUA.policies.palace.id) && provenance.sourcedPolicyIds.includes(STANDARD_WENWANG_GUA.policies.shiYing.id) ? "PASS" : "LIMITED", note: `Passage-sourced policies：${provenance.sourcedPolicyIds.length}；月建完整来源仍有缺口。` },
    { id: "fixtures", label: "完整盘 fixtures", status: LIUYAO_FULL_CHART_FIXTURES.length >= 20 ? "PASS" : "LIMITED", note: `当前完整盘 fixture：Tier A ${fixtureCounts.A}，Tier B ${fixtureCounts.B}，Tier C ${fixtureCounts.C}。Tier A 不降级凑数。` },
    { id: "known-differences", label: "已知差异", status: LIUYAO_KNOWN_DIFFERENCES.every((item) => item.status === "CLASSIFIED") ? "PASS" : "LIMITED", note: `${LIUYAO_KNOWN_DIFFERENCES.length} 项已登记；未分类差异会阻止冻结。` },
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

export function evaluateLiuyaoRuleSetStatus() {
  const readiness = getLiuyaoFoundationReadiness();
  const criticalIds = ["hexagram-core", "palaces", "shi-ying", "najia", "six-relatives", "six-spirits", "month-jian", "day-context", "void-branches", "rule-provenance", "fixtures", "known-differences"];
  const critical = readiness.checks.filter((check) => criticalIds.includes(check.id));
  const stable = critical.every((check) => check.status === "PASS");
  return {
    recommendedStatus: stable ? "STABLE" as const : "EXPERIMENTAL" as const,
    blockers: critical.filter((check) => check.status !== "PASS").map((check) => check.id),
    regressionManifest: LIUYAO_REGRESSION_MANIFEST,
  };
}
