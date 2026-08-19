import type { LiuyaoChart, LiuyaoRuleSet } from "./types";

export interface LiuyaoRuleComparison {
  changedPolicyIds: string[];
  primaryHexagramChanged: boolean;
  changedHexagramChanged: boolean;
  calendarContextChanged: boolean;
  lineAssignmentsChanged: boolean;
}

/**
 * Phase 8 only establishes the deterministic comparison contract. A future
 * rules laboratory can calculate both charts and pass them here without
 * coupling either engine run to the UI.
 */
export function compareLiuyaoRules(
  leftRuleSet: LiuyaoRuleSet,
  rightRuleSet: LiuyaoRuleSet,
  leftChart: LiuyaoChart,
  rightChart: LiuyaoChart,
): LiuyaoRuleComparison {
  const leftPolicies = Object.values(leftRuleSet.policies);
  const rightPolicies = new Map(
    Object.values(rightRuleSet.policies).map((policy) => [policy.id, policy.version]),
  );
  const changedPolicyIds = leftPolicies
    .filter((policy) => rightPolicies.get(policy.id) !== policy.version)
    .map((policy) => policy.id);

  return {
    changedPolicyIds,
    primaryHexagramChanged: leftChart.primaryHexagram.id !== rightChart.primaryHexagram.id,
    changedHexagramChanged: leftChart.changedHexagram?.id !== rightChart.changedHexagram?.id,
    calendarContextChanged:
      leftChart.calendarContext.dayGanzhi.index !== rightChart.calendarContext.dayGanzhi.index ||
      leftChart.calendarContext.monthBranch !== rightChart.calendarContext.monthBranch,
    lineAssignmentsChanged: leftChart.lines.some((line, index) => {
      const other = rightChart.lines[index];
      return (
        !other ||
        line.najia.stem !== other.najia.stem ||
        line.najia.branch !== other.najia.branch ||
        line.relative !== other.relative ||
        line.spirit !== other.spirit
      );
    }),
  };
}
