import { describe,expect,it } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { solarTermFixtures,absoluteTimeDifference } from "@/fixtures/calendar/solar-terms";
import { dayPillarFixtures } from "@/fixtures/calendar/day-pillars";
import { referenceDayPillar } from "@/tests/reference/day-pillar-reference";
import { getSolarTerms } from "@/lib/calendar/lunar-adapter";
import { daysSinceJiaziEpoch } from "@/lib/calendar/julian-day";
import { ganzhiAt,parseGanzhi,HEAVENLY_STEMS,EARTHLY_BRANCHES } from "@/lib/calendar/ganzhi";
import { localDateTimeToInstant } from "@/lib/calendar/timezone";
import { CalculationError } from "@/lib/calendar/errors";
import { lunarToGregorian } from "@/lib/calendar/lunar-adapter";
import { lunarConversionFixtures } from "@/fixtures/calendar/lunar-conversion";
import { DeterministicBaziEngine } from "./engine";
import { STANDARD_ZIPING } from "./rules";
import { TEST_DAY_BOUNDARY_AT_ZI } from "./testing-rules";
import { tenGod } from "./ten-gods";

const engine=new DeterministicBaziEngine();
const birth=(local:string,timezone="Asia/Shanghai")=>{const d=Temporal.PlainDateTime.from(local);return{calendarType:"GREGORIAN" as const,date:{year:d.year,month:d.month,day:d.day},time:{hour:d.hour,minute:d.minute,second:d.second},timezone,timePrecision:"MINUTE" as const};};

describe("golden calendar data",()=>{
  it(`validates ${solarTermFixtures.length} solar-term fixtures within declared tolerance`,()=>{for(const fixture of solarTermFixtures){const actual=getSolarTerms(fixture.year,fixture.displayedTimezone).find((term)=>term.name===fixture.term);expect(actual).toBeDefined();expect(absoluteTimeDifference(actual!.utcInstant,fixture.expectedInstant)).toBeLessThanOrEqual(fixture.toleranceSeconds);}});
  it(`validates ${dayPillarFixtures.length} frozen day fixtures through independent reference`,()=>{for(const fixture of dayPillarFixtures){expect(referenceDayPillar(fixture.date)).toBe(fixture.expectedGanzhi);const value=ganzhiAt(daysSinceJiaziEpoch(fixture.date));expect(`${value.stem}${value.branch}`).toBe(fixture.expectedGanzhi);}});
  it(`validates ${lunarConversionFixtures.length} lunar conversion fixtures`,()=>{for(const fixture of lunarConversionFixtures)expect(lunarToGregorian(fixture.lunar)).toEqual(fixture.gregorian);});
  it("fails closed for nonexistent lunar dates",()=>{expect(()=>lunarToGregorian({year:2024,month:3,day:30,isLeapMonth:true})).toThrowError(expect.objectContaining({code:"INVALID_LUNAR_DATE"}));expect(()=>lunarToGregorian({year:2000,month:12,day:30})).toThrowError(expect.objectContaining({code:"INVALID_LUNAR_DATE"}));});
});

describe("solar-term exact boundaries",()=>{
  for(const fixture of solarTermFixtures.filter((f)=>["立春","惊蛰","清明"].includes(f.term)).slice(-6))it(`${fixture.year} ${fixture.term} flips only at provider instant`,()=>{const term=getSolarTerms(fixture.year,"Asia/Shanghai").find((item)=>item.name===fixture.term)!;const t=Temporal.Instant.from(term.utcInstant);const charts=[-60,-1,0,1,60].map((seconds)=>{const local=t.add({seconds}).toZonedDateTimeISO("Asia/Shanghai").toPlainDateTime().toString({smallestUnit:"second"});return engine.calculate(birth(local));});expect(charts[0].pillars.month.display).toBe(charts[1].pillars.month.display);expect(charts[2].pillars.month.display).not.toBe(charts[1].pillars.month.display);expect(charts[2].pillars.month.display).toBe(charts[3].pillars.month.display);if(fixture.term==="立春")expect(charts[2].pillars.year.display).not.toBe(charts[1].pillars.year.display);});
});

describe("timezone and rules",()=>{
  it.each([["America/New_York","2024-03-10T02:30"],["Europe/London","2024-03-31T01:30"],["Australia/Sydney","2024-10-06T02:30"]])("rejects nonexistent %s local time",(zone,local)=>expect(()=>localDateTimeToInstant(local,zone)).toThrowError(CalculationError));
  it.each([["America/New_York","2024-11-03T01:30"],["Europe/London","2024-10-27T01:30"],["Australia/Sydney","2024-04-07T02:30"]])("requires disambiguation for repeated %s local time",(zone,local)=>{expect(()=>localDateTimeToInstant(local,zone)).toThrowError(expect.objectContaining({code:"AMBIGUOUS_LOCAL_TIME"}));expect(localDateTimeToInstant(local,zone,"EARLIER").equals(localDateTimeToInstant(local,zone,"LATER"))).toBe(false);});
  it("proves day-boundary rule set changes output",()=>{const input=birth("2024-01-01T23:30");expect(engine.calculate(input,STANDARD_ZIPING).pillars.day.display).not.toBe(engine.calculate(input,TEST_DAY_BOUNDARY_AT_ZI).pillars.day.display);});
  it.each([["Asia/Shanghai","1901-02-04T12:00"],["Asia/Hong_Kong","1912-01-01T12:00"],["America/New_York","1918-03-31T01:30"],["Europe/London","1916-05-21T01:30"]])("uses historical IANA offset for %s",(zone,local)=>{const chart=engine.calculate(birth(local,zone));expect(chart.input.temporalConfidence).toBe("HISTORICAL_TIMEZONE");expect(chart.input.utcOffset).toMatch(/^[+-]\d\d:\d\d/);});
  it("documents same instant represented in different local rules",()=>{const shanghai=engine.calculate(birth("2024-01-02T07:30","Asia/Shanghai"));const newYork=engine.calculate(birth("2024-01-01T18:30","America/New_York"));expect(shanghai.input.utcInstant).toBe(newYork.input.utcInstant);expect(shanghai.pillars.day.display).not.toBe(newYork.pillars.day.display);});
  it("fingerprint identifies environment, not personal input",()=>{expect(engine.calculate(birth("2024-01-01T12:00")).calculationFingerprint).toBe(engine.calculate(birth("1990-06-01T05:00")).calculationFingerprint);});
});

describe("exhaustive domain invariants",()=>{
  it("five-tiger month pillars are legal for 10x12",()=>{for(const yearStem of HEAVENLY_STEMS)for(let i=0;i<12;i++){const stem=HEAVENLY_STEMS[((HEAVENLY_STEMS.indexOf(yearStem)%5)*2+2+i)%10];expect(()=>parseGanzhi(`${stem}${EARTHLY_BRANCHES[(2+i)%12]}`)).not.toThrow();}});
  it("five-rat hour pillars are legal for 10x12",()=>{for(const dayStem of HEAVENLY_STEMS)for(let i=0;i<12;i++){const stem=HEAVENLY_STEMS[((HEAVENLY_STEMS.indexOf(dayStem)%5)*2+i)%10];expect(()=>parseGanzhi(`${stem}${EARTHLY_BRANCHES[i]}`)).not.toThrow();}});
  it("covers all 100 ten-god relations",()=>{const values=HEAVENLY_STEMS.flatMap((day)=>HEAVENLY_STEMS.map((target)=>tenGod(day,target)));expect(values).toHaveLength(100);for(let index=0;index<HEAVENLY_STEMS.length;index+=2){const yang=HEAVENLY_STEMS[index],yin=HEAVENLY_STEMS[index+1];expect(tenGod(yang,yang)).toBe("比肩");expect(tenGod(yang,yin)).toBe("劫财");expect(tenGod(yin,yang)).toBe("劫财");}});
  it("fuzzes 1000 supported Gregorian inputs",()=>{let seed=65;for(let i=0;i<1000;i++){seed=(seed*48271)%2147483647;const year=1900+(seed%201);const month=1+(Math.floor(seed/13)%12);const day=1+(Math.floor(seed/157)%28);const hour=Math.floor(seed/1901)%23;const chart=engine.calculate({calendarType:"GREGORIAN",date:{year,month,day},time:{hour,minute:i%60},timezone:["UTC","Asia/Tokyo","America/New_York","Europe/London"][i%4],timePrecision:"MINUTE"});for(const pillar of Object.values(chart.pillars))if(pillar)expect(()=>parseGanzhi(pillar.display)).not.toThrow();expect(chart.trace.length).toBeGreaterThan(7);}},20000);
});
