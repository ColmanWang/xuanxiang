import { solarTermFixtures } from "@/fixtures/calendar/solar-terms";
import { dayPillarFixtures } from "@/fixtures/calendar/day-pillars";
import { BAZI_FIXTURES } from "@/fixtures/bazi/regression";
import { luckCycleFixtures } from "@/fixtures/bazi/luck-cycles";
import { BAZI_ENGINE_VERSION } from "./engine";
import { CALENDAR_PROVIDERS } from "./fingerprint";
import { KNOWN_LUCK_DIFFERENCES } from "./known-differences";
import { STANDARD_ZIPING } from "./rules";

export type BaziFoundationReadiness="READY"|"READY_WITH_LIMITATIONS"|"BLOCKED";
export interface BaziRegressionManifest {engineVersion:string;stableRuleSetVersion:string;providers:typeof CALENDAR_PROVIDERS;solarTermFixtureCount:number;dayPillarFixtureCount:number;fourPillarFixtureCount:number;luckFixtureCount:number;lastVerifiedAt:string}

export const BAZI_REGRESSION_MANIFEST:BaziRegressionManifest={engineVersion:BAZI_ENGINE_VERSION,stableRuleSetVersion:STANDARD_ZIPING.version,providers:CALENDAR_PROVIDERS,solarTermFixtureCount:solarTermFixtures.length,dayPillarFixtureCount:dayPillarFixtures.length,fourPillarFixtureCount:BAZI_FIXTURES.length,luckFixtureCount:luckCycleFixtures.length,lastVerifiedAt:"2026-08-13"};

export function evaluateBaziFoundation(input:{provenanceValid:boolean;tierACount?:number;unresolvedDifferenceCount?:number}){
  const unresolved=input.unresolvedDifferenceCount??KNOWN_LUCK_DIFFERENCES.filter((item)=>!item.resolved).length;
  if(!input.provenanceValid||unresolved>0)return {status:"BLOCKED" as const,reasons:[!input.provenanceValid?"关键生产 Policy 的 Citation 链不完整":"",unresolved?"仍有未分类计算差异":""].filter(Boolean)};
  if((input.tierACount??luckCycleFixtures.filter((item)=>item.tier==="A").length)===0)return {status:"READY_WITH_LIMITATIONS" as const,reasons:["大运 Tier A 独立盘例仍为 0；现有样例为独立软件交叉验证"]};
  return {status:"READY" as const,reasons:[]};
}
