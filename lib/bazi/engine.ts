import { Temporal } from "@js-temporal/polyfill";
import { normalizeBirthInput } from "../calendar/normalize";
import { locateSolarTermContext } from "../calendar/solar-terms";
import type { Pillar } from "../calendar/ganzhi";
import { providerPillars } from "../calendar/lunar-adapter";
import { calculateAnnualCycles } from "./annual-cycles";
import { branchElement, countFiveElements } from "./five-elements";
import { growthPhase } from "./growth-phases";
import { hiddenStems } from "./hidden-stems";
import { nayinFor } from "./nayin";
import { calculateDayPillar,calculateHourPillar,calculateMonthPillar,calculateYearPillar } from "./pillars";
import { STANDARD_ZIPING } from "./rules";
import { getRuleSet,resolveRuleSet } from "./rule-registry";
import { stemElement,tenGod } from "./ten-gods";
import { step } from "./trace";
import type { BaziChart,BaziEngine,BaziRuleSet,BirthInput,PillarDerived } from "./types";
import { CalculationError } from "../calendar/errors";
import { CALENDAR_PROVIDERS, calculationFingerprint } from "./fingerprint";
import { calculateLuck } from "./luck-cycles";

export const BAZI_ENGINE_VERSION="1.2.0";
function derive(pillar:Pillar|null,day:Pillar,isDay=false):PillarDerived|null{return pillar?{tenGod:isDay?"日主":tenGod(day.stem,pillar.stem),hiddenStems:hiddenStems(pillar.branch,day.stem),nayin:nayinFor(pillar),growthPhase:growthPhase(day.stem,pillar.branch),elements:{stem:stemElement(pillar.stem),branch:branchElement(pillar.branch)}}:null;}
export class DeterministicBaziEngine implements BaziEngine{
 calculate(input:BirthInput,provided?:BaziRuleSet):BaziChart{
  const base=provided??getRuleSet(input.ruleSetId);const rules=input.ruleOverrides?resolveRuleSet(base,input.ruleOverrides):base;if(input.trueSolarTime)throw new CalculationError("TRUE_SOLAR_TIME_NOT_IMPLEMENTED","真太阳时尚未实现，当前版本不会执行未经验证的校正。请改用标准时。","trueSolarTime");
  const normalized=normalizeBirthInput(input);const context=locateSolarTermContext(normalized);const year=calculateYearPillar(normalized,rules,context);const month=calculateMonthPillar(normalized,rules,context,year.value);const day=calculateDayPillar(normalized,rules);const hour=calculateHourPillar(normalized,rules,day.value);
  const pillars={year:year.value,month:month.value,day:day.value,hour:hour.value};
  const cross=providerPillars(normalized.calculationLocalDateTime);const computed=[pillars.year.display,pillars.month.display,pillars.day.display,pillars.hour?.display];const provider=[cross.year,cross.month,cross.day,cross.hour];
  const localHour=Temporal.PlainDateTime.from(normalized.calculationLocalDateTime).hour;
  const canCrossCheck=rules.id===STANDARD_ZIPING.id&&normalized.timezone==="Asia/Shanghai";
  const agrees=!canCrossCheck||computed.slice(0,localHour===23?3:4).every((v,i)=>v===undefined||v===provider[i]);
  const trace=[step("normalize","标准化出生时间",`将本地输入转换为唯一 UTC 时刻；采用 ${normalized.utcOffset} 历史/现代 IANA 偏移。`,rules.timezonePolicy,{local:normalized.localDateTime,timezone:normalized.timezone},{utc:normalized.utcInstant,offset:normalized.utcOffset},"IANA tzdb via Temporal","CALENDAR_CONVERSION"),...year.trace,...month.trace,...day.trace,...hour.trace,step("derive","派生结构","由四柱确定十神、藏干、纳音、十二长生与五行简单计数。","DETERMINISTIC_DERIVATION",undefined,{completed:true},undefined,"DERIVED_CALCULATION"),step("cross-check","适配器交叉检查",!canCrossCheck?"该时区不使用假定中国民用时的适配器八字结果作运行时裁决；由固定多时区测试验证。":agrees?(localHour===23?"年、月、日柱与适配器一致；23 点时柱因适配器采用不同子初日界口径，不纳入同口径比较。":"玄象柱算法与历法适配器结果一致。") :"玄象柱算法与适配器存在差异，请停止使用并核验。","CROSS_CHECK",{provider:provider.join(" "),applicable:canCrossCheck},{agrees},"lunar-typescript 1.8.6","DERIVED_CALCULATION")];
  if(!agrees)throw new CalculationError("PROVIDER_MISMATCH",`历法交叉检查失败：玄象 ${computed.join(" ")} / 适配器 ${provider.join(" ")}`);
  const localYear=Temporal.PlainDateTime.from(normalized.calculationLocalDateTime).year;
  const shouldCalculateLuck=input.includeLuckCycles!==false&&rules.luckCyclePolicy.enabled;const hasDirectionInput=input.sex==="MALE"||input.sex==="FEMALE";const hasPreciseTime=input.timePrecision!=="UNKNOWN";const canCalculateLuck=hasDirectionInput&&hasPreciseTime;const luck=shouldCalculateLuck&&canCalculateLuck?calculateLuck(normalized,{year:pillars.year,month:pillars.month},input.sex!,rules,context):null;
  const instant=Temporal.Instant.from(normalized.utcInstant); const nearest=[context.previous,context.next].sort((a,b)=>Math.abs(instant.since(a.utcInstant).total("seconds"))-Math.abs(instant.since(b.utcInstant).total("seconds")))[0]; const deltaSeconds=Math.round(instant.since(nearest.utcInstant).total("seconds"));
  const annual=calculateAnnualCycles(localYear,10).map(item=>{const cycle=luck?.value.cycles.find(value=>value.startYear!==undefined&&value.endYear!==undefined&&item.year>=value.startYear&&item.year<=value.endYear);return{...item,luckCycleIndex:cycle?.index,luckPillar:cycle?.pillar};});
  const luckUnavailableReason=!shouldCalculateLuck?undefined:!hasDirectionInput?"所选大运顺逆规则需要男/女分类输入；该字段仅用于传统顺逆计算。":!hasPreciseTime?"当前起运规则依赖明确出生时刻；未知时辰仍可计算年、月、日柱。":undefined;
  return{input:normalized,ruleset:{id:rules.id,name:rules.name,displayName:rules.displayName,version:rules.version,status:rules.status,verificationLevel:rules.verificationLevel,policies:rules.policies,references:rules.references,yearBoundary:rules.yearBoundary,monthBoundary:rules.monthBoundary,dayBoundary:rules.dayBoundary,timezonePolicy:rules.timezonePolicy,trueSolarTimePolicy:rules.trueSolarTimePolicy,luckCyclePolicy:rules.luckCyclePolicy},pillars,derived:{pillars:{year:derive(pillars.year,pillars.day),month:derive(pillars.month,pillars.day),day:derive(pillars.day,pillars.day,true),hour:derive(pillars.hour,pillars.day)},fiveElements:countFiveElements(Object.values(pillars))},luck:luck?.value??null,luckUnavailableReason,annualCycles:annual,trace:[...trace,...(luck?.trace??[])],engineVersion:BAZI_ENGINE_VERSION,ruleSetVersion:rules.version,calculationFingerprint:calculationFingerprint(BAZI_ENGINE_VERSION,rules),providers:CALENDAR_PROVIDERS,nearestBoundary:{term:nearest.name,instant:nearest.utcInstant,localDateTime:nearest.localDateTime,deltaSeconds,affectedPillars:nearest.name==="立春"?["year","month"]:["month"]},derivedConventions:[{ruleId:"GROWTH_PHASE_YANG_FORWARD_YIN_REVERSE_V1",label:"十二长生：阳干顺行、阴干逆行",verificationLevel:"INTERNAL"}]};
 }
}
