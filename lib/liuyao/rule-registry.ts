import { STANDARD_WENWANG_GUA } from "./rules";
import { LiuyaoCalculationError } from "./errors";
import type { LiuyaoRuleSet } from "./types";
const RULES=new Map<string,LiuyaoRuleSet>([[STANDARD_WENWANG_GUA.id,STANDARD_WENWANG_GUA]]);
export const liuyaoRuleSetRegistry={get(id:string){const rule=RULES.get(id);if(!rule)throw new LiuyaoCalculationError("UNSUPPORTED_RULESET","暂不支持所选六爻规则。","ruleSetId");return rule},getDefault(){return STANDARD_WENWANG_GUA},list(){return[...RULES.values()]}};
