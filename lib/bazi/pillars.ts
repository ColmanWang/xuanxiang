import { Temporal } from "@js-temporal/polyfill";
import { EARTHLY_BRANCHES, ganzhiAt, ganzhiFromParts, HEAVENLY_STEMS, type Pillar } from "../calendar/ganzhi";
import { daysSinceJiaziEpoch } from "../calendar/julian-day";
import { MONTH_BOUNDARY_TERMS, type SolarTermContext } from "../calendar/solar-terms";
import type { NormalizedBirthTime } from "../calendar/types";
import type { BaziRuleSet, CalculationResult } from "./types";
import { step } from "./trace";

export function calculateYearPillar(time:NormalizedBirthTime,rules:BaziRuleSet,context:SolarTermContext):CalculationResult<Pillar>{
  const local=Temporal.PlainDateTime.from(time.calculationLocalDateTime); const liChun=context.terms.filter(t=>t.name==="立春").find(t=>Temporal.PlainDateTime.from(t.localDateTime).year===local.year);
  if(!liChun)throw new Error("缺少立春节气数据。"); const effectiveYear=Temporal.Instant.compare(time.utcInstant,liChun.utcInstant)>=0?local.year:local.year-1;
  const value={...ganzhiAt(effectiveYear-1984),display:`${ganzhiAt(effectiveYear-1984).stem}${ganzhiAt(effectiveYear-1984).branch}`};
  return{value,trace:[step("li-chun-time","读取立春时刻",`当年立春发生于 ${liChun.localDateTime}。`,"SOLAR_TERM_PROVIDER",undefined,{liChun:liChun.localDateTime},"lunar-typescript 1.8.6","ASTRONOMICAL_FACT"),step("year-boundary","确定年柱边界",`出生时刻${effectiveYear===local.year?"已过":"未过"}当年立春，按 ${effectiveYear} 干支年计算。`,rules.yearBoundary,{birth:time.calculationLocalDateTime,liChun:liChun.localDateTime},{effectiveYear,pillar:value.display},undefined,"BAZI_CONVENTION") ]};
}

export function calculateMonthPillar(time:NormalizedBirthTime,rules:BaziRuleSet,context:SolarTermContext,year:Pillar):CalculationResult<Pillar>{
  const instant=Temporal.Instant.from(time.utcInstant); const boundaries=context.terms.filter(t=>MONTH_BOUNDARY_TERMS.includes(t.name as typeof MONTH_BOUNDARY_TERMS[number])&&Temporal.Instant.compare(t.utcInstant,instant)<=0);
  const boundary=boundaries.at(-1); if(!boundary)throw new Error("无法确定月令边界。"); const monthIndex=MONTH_BOUNDARY_TERMS.indexOf(boundary.name as typeof MONTH_BOUNDARY_TERMS[number]);
  const branch=EARTHLY_BRANCHES[(2+monthIndex)%12]; const yearStemIndex=HEAVENLY_STEMS.indexOf(year.stem); const firstMonthStem=((yearStemIndex%5)*2+2)%10; const stem=HEAVENLY_STEMS[(firstMonthStem+monthIndex)%10]; const value=ganzhiFromParts(stem,branch);
  return{value,trace:[step("month-boundary","定位节气月",`最近的节月边界为${boundary.name}，进入${branch}月。`,rules.monthBoundary,{birth:time.calculationLocalDateTime,boundary:boundary.localDateTime,term:boundary.name},{monthIndex,branch},undefined,"BAZI_CONVENTION"),step("month-stem","五虎遁月干",`依据年干 ${year.stem} 与月序推得月干 ${stem}。`,"五虎遁",{yearStem:year.stem,monthIndex},{pillar:value.display},undefined,"DERIVED_CALCULATION")]};
}

export function calculateDayPillar(time:NormalizedBirthTime,rules:BaziRuleSet):CalculationResult<Pillar>{
  const local=Temporal.PlainDateTime.from(time.calculationLocalDateTime); const date=(rules.dayBoundary==="ZI_HOUR_START"&&local.hour>=23?local.toPlainDate().add({days:1}):local.toPlainDate()).toString(); const offset=daysSinceJiaziEpoch(date); const g=ganzhiAt(offset); const value={...g,display:`${g.stem}${g.branch}`};
  return{value,trace:[step("day-boundary-choice","选择日界",rules.dayBoundary==="ZI_HOUR_START"?"本测试规则在 23:00 子初换日。":"本规则在当地民用时 00:00 换日。",rules.dayBoundary,{localDateTime:time.calculationLocalDateTime},{effectiveDate:date},undefined,"RULESET_CHOICE"),step("day-cycle","计算日干支",`以 2000-01-07 甲子日为循环基准，按有效本地日期累计。`,rules.dayBoundary,{localDate:date,epoch:"2000-01-07",dayOffset:offset},{pillar:value.display},"独立 Julian Day 公式与历法适配器交叉核验","DERIVED_CALCULATION") ]};
}

export function calculateHourPillar(time:NormalizedBirthTime,rules:BaziRuleSet,day:Pillar):CalculationResult<Pillar|null>{
  if(time.precision==="UNKNOWN")return{value:null,trace:[step("hour-unknown","时柱不可计算","输入时刻未知，不使用默认时刻代替。","UNKNOWN_TIME",undefined,{pillar:"未知"},undefined,"RULESET_CHOICE")]};
  const hour=Temporal.PlainDateTime.from(time.calculationLocalDateTime).hour; const branchIndex=Math.floor((hour+1)/2)%12; const branch=EARTHLY_BRANCHES[branchIndex]; const dayStemIndex=HEAVENLY_STEMS.indexOf(day.stem); const stem=HEAVENLY_STEMS[((dayStemIndex%5)*2+branchIndex)%10]; const value=ganzhiFromParts(stem,branch);
  return{value,trace:[step("hour-branch","划分十二时辰",`${hour} 时落在${branch}时；23:00 至 00:59 同属子时，本规则日界仍为午夜。`,rules.dayBoundary,{hour},{branch}),step("hour-stem","五鼠遁时干",`依据日干 ${day.stem} 与时支 ${branch} 推得时干。`,"五鼠遁",{dayStem:day.stem,branch},{pillar:value.display})]};
}
