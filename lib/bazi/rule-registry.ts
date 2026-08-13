import { CalculationError } from "../calendar/errors";
import { DAY_LOCAL_MIDNIGHT,DAY_ZI_START_TEST,LUCK_DIRECTION_REVERSED_TEST,LUCK_DIRECTION_STANDARD,LUCK_START_ONE_DAY_TEST,LUCK_START_THREE_DAYS } from "./policies";
import { STANDARD_ZIPING } from "./rules";
import { TEST_DAY_BOUNDARY_AT_ZI,TEST_ONE_DAY_START,TEST_REVERSED_LUCK } from "./testing-rules";
import type { BaziRuleOverrides,BaziRuleSet,DayBoundaryPolicy,LuckDirectionPolicy,LuckStartPolicy } from "./types";

const ALL_RULES=[STANDARD_ZIPING,TEST_DAY_BOUNDARY_AT_ZI,TEST_REVERSED_LUCK,TEST_ONE_DAY_START] as const;
const DAY_POLICIES=new Map<string,DayBoundaryPolicy>([[DAY_LOCAL_MIDNIGHT.id,DAY_LOCAL_MIDNIGHT],[DAY_ZI_START_TEST.id,DAY_ZI_START_TEST]]);
const DIRECTION_POLICIES=new Map<string,LuckDirectionPolicy>([[LUCK_DIRECTION_STANDARD.id,LUCK_DIRECTION_STANDARD],[LUCK_DIRECTION_REVERSED_TEST.id,LUCK_DIRECTION_REVERSED_TEST]]);
const START_POLICIES=new Map<string,LuckStartPolicy>([[LUCK_START_THREE_DAYS.id,LUCK_START_THREE_DAYS],[LUCK_START_ONE_DAY_TEST.id,LUCK_START_ONE_DAY_TEST]]);
export class BaziRuleSetRegistry{
 list(options?:{includeNonProduction?:boolean}){return ALL_RULES.filter(rule=>options?.includeNonProduction||rule.status==="STABLE"||rule.status==="EXPERIMENTAL");}
 getDefault(){return STANDARD_ZIPING;}
 get(id:string,options?:{allowTestRules?:boolean}){const rule=ALL_RULES.find(item=>item.id===id);if(!rule)throw new CalculationError("UNSUPPORTED_POLICY",`未知规则集：${id}`,"ruleSetId");if(rule.status==="TEST_ONLY"&&!options?.allowTestRules)throw new CalculationError("POLICY_NOT_AVAILABLE","测试规则不能用于生产计算。","ruleSetId");return rule;}
 resolve(base:BaziRuleSet,overrides?:BaziRuleOverrides,options?:{allowTestPolicies?:boolean}):BaziRuleSet{if(!overrides)return base;const day=overrides.dayBoundaryPolicyId?DAY_POLICIES.get(overrides.dayBoundaryPolicyId):base.policies.dayBoundary;const direction=overrides.luckDirectionPolicyId?DIRECTION_POLICIES.get(overrides.luckDirectionPolicyId):base.policies.luckDirection;const start=overrides.luckStartPolicyId?START_POLICIES.get(overrides.luckStartPolicyId):base.policies.luckStart;if(!day||!direction||!start)throw new CalculationError("INVALID_RULE_OVERRIDE","规则覆盖包含未知 Policy。","ruleOverrides");if(!options?.allowTestPolicies&&[day,direction,start].some(policy=>policy.version.startsWith("test")))throw new CalculationError("POLICY_NOT_AVAILABLE","研究或测试 Policy 不能用于生产计算。","ruleOverrides");return{...base,id:`${base.id}_RESOLVED`,name:`${base.name}（研究组合）`,displayName:`${base.displayName}（研究组合）`,status:"RESEARCH_ONLY",dayBoundary:day.boundary,policies:{...base.policies,dayBoundary:day,luckDirection:direction,luckStart:start}};}
}
export const ruleSetRegistry=new BaziRuleSetRegistry();
export function getRuleSet(id?:string){return ruleSetRegistry.get(id??ruleSetRegistry.getDefault().id);}
export function resolveRuleSet(base:BaziRuleSet,overrides?:BaziRuleOverrides,options?:{allowTestPolicies?:boolean}){return ruleSetRegistry.resolve(base,overrides,options);}
