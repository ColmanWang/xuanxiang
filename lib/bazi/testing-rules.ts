import type { BaziRuleSet } from "./types";
import { STANDARD_ZIPING } from "./rules";
import { DAY_ZI_START_TEST,LUCK_DIRECTION_REVERSED_TEST,LUCK_START_ONE_DAY_TEST } from "./policies";

/** Test-only rule set. It is deliberately not returned by getRuleSet or exposed in UI. */
export const TEST_DAY_BOUNDARY_AT_ZI: BaziRuleSet = {
  ...STANDARD_ZIPING,
  id: "TEST_DAY_BOUNDARY_AT_ZI",
  name: "测试规则 · 子初换日",
  displayName:"测试规则 · 子初换日",
  version: "test-1",
  status:"TEST_ONLY",
  dayBoundary: "ZI_HOUR_START",
  policies:{...STANDARD_ZIPING.policies,dayBoundary:DAY_ZI_START_TEST},
};
export const TEST_REVERSED_LUCK:BaziRuleSet={...STANDARD_ZIPING,id:"TEST_REVERSED_LUCK",name:"测试规则 · 反向大运",displayName:"测试规则 · 反向大运",version:"test-1",status:"TEST_ONLY",policies:{...STANDARD_ZIPING.policies,luckDirection:LUCK_DIRECTION_REVERSED_TEST}};
export const TEST_ONE_DAY_START:BaziRuleSet={...STANDARD_ZIPING,id:"TEST_ONE_DAY_START",name:"测试规则 · 一日折年",displayName:"测试规则 · 一日折年",version:"test-1",status:"TEST_ONLY",policies:{...STANDARD_ZIPING.policies,luckStart:LUCK_START_ONE_DAY_TEST}};
