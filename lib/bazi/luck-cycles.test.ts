import { describe,expect,it } from "vitest";
import { EARTHLY_BRANCHES,HEAVENLY_STEMS,ganzhiAt } from "../calendar/ganzhi";
import { calculateLuckStart,determineLuckDirection,generateLuckCycles } from "./luck-cycles";
import { compareBaziRules } from "./rule-diff";
import { ruleSetRegistry } from "./rule-registry";
import { DeterministicBaziEngine } from "./engine";
import type { BirthInput,Sex } from "./types";
import { normalizeBirthInput } from "../calendar/normalize";
import { locateSolarTermContext } from "../calendar/solar-terms";

const input=(date="2024-02-10",time="08:30",sex:Sex="MALE"):BirthInput=>{const[y,m,d]=date.split("-").map(Number),[hour,minute]=time.split(":").map(Number);return{calendarType:"GREGORIAN",date:{year:y,month:m,day:d},time:{hour,minute},timezone:"Asia/Shanghai",timePrecision:"MINUTE",sex,ruleSetId:"STANDARD_ZIPING"};};

describe("RuleSet registry",()=>{
 it("exposes only production rules by default",()=>{expect(ruleSetRegistry.getDefault().id).toBe("STANDARD_ZIPING");expect(ruleSetRegistry.list().every(rule=>rule.status!=="TEST_ONLY")).toBe(true);expect(()=>ruleSetRegistry.get("TEST_DAY_BOUNDARY_AT_ZI")).toThrowError(expect.objectContaining({code:"POLICY_NOT_AVAILABLE"}));});
});
describe("luck direction",()=>{
 it("exhausts year-stem polarity by traditional binary sex input",()=>{for(let i=0;i<10;i++)for(const sex of ["MALE","FEMALE"] as const){const expected=(i%2===0)===(sex==="MALE")?"FORWARD":"BACKWARD";expect(determineLuckDirection(HEAVENLY_STEMS[i],sex,ruleSetRegistry.getDefault().policies.luckDirection).value.direction).toBe(expected);}});
 it("does not alter four pillars when sex changes",()=>{const engine=new DeterministicBaziEngine();const male=engine.calculate(input(undefined,undefined,"MALE"));const female=engine.calculate(input(undefined,undefined,"FEMALE"));expect(male.pillars).toEqual(female.pillars);expect(male.luck?.direction).not.toBe(female.luck?.direction);});
});
describe("luck cycle sequence",()=>{
 it("exhausts 60 pillars in both directions",()=>{for(let index=0;index<60;index++)for(const direction of ["FORWARD","BACKWARD"] as const){const month={...ganzhiAt(index),display:`${HEAVENLY_STEMS[index%10]}${EARTHLY_BRANCHES[index%12]}`};const cycles=generateLuckCycles(month,direction,{years:1,months:0,days:0,decimalYears:1},12);expect(cycles).toHaveLength(12);expect(cycles[0].pillar.index).toBe((index+(direction==="FORWARD"?1:59))%60);expect(cycles.every(c=>c.pillar.index>=0&&c.pillar.index<60)).toBe(true);}});
});
describe("luck-start boundary",()=>{
 it.each([[6,1],[7,0],[8,31556940]])("selects the correct forward Jie around Li Chun at second %i",(second,expectedSeconds)=>{const birth:BirthInput={...input("2024-02-04","16:27"),time:{hour:16,minute:27,second}};const normalized=normalizeBirthInput(birth);const result=calculateLuckStart(normalized,"FORWARD",locateSolarTermContext(normalized),ruleSetRegistry.getDefault().policies.luckStart);if(second===6)expect(result.value.durationToBoundary.seconds).toBe(expectedSeconds);else if(second===7)expect(result.value.durationToBoundary.seconds).toBe(expectedSeconds);else expect(result.value.sourceBoundary.term).toBe("惊蛰");});
});
describe("rule diff",()=>{
 it("returns no diff for identical rules",()=>expect(compareBaziRules(input(),"STANDARD_ZIPING","STANDARD_ZIPING").hasDifferences).toBe(false));
 it("propagates a day-boundary difference",()=>{const diff=compareBaziRules(input("2024-01-01","23:30"),"STANDARD_ZIPING","TEST_DAY_BOUNDARY_AT_ZI",{allowTestRules:true});expect(diff.firstDifference).toBe("dayBoundaryPolicy");expect(diff.downstreamDifferences).toEqual(expect.arrayContaining(["dayPillar","hourPillar","tenGods"]));});
 it("keeps pillars but changes all luck pillars when direction differs",()=>{const diff=compareBaziRules(input(),"STANDARD_ZIPING","TEST_REVERSED_LUCK",{allowTestRules:true});expect(diff.pillarDifferences).toEqual([]);expect(diff.luckDirectionDifference).toBeDefined();expect(diff.luckCycleDifferences).toHaveLength(10);expect(diff.downstreamDifferences).toContain("luckCycles");});
 it("keeps pillars and direction but changes start age",()=>{const diff=compareBaziRules(input(),"STANDARD_ZIPING","TEST_ONE_DAY_START",{allowTestRules:true});expect(diff.pillarDifferences).toEqual([]);expect(diff.luckDirectionDifference).toBeUndefined();expect(diff.luckStartDifference).toBeDefined();expect(diff.downstreamDifferences).toContain("luckStartAge");});
});
