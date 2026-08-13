import { Lunar, Solar } from "lunar-typescript";
import { Temporal } from "@js-temporal/polyfill";
import type { CalendarDateInput, SolarTerm } from "./types";
import { CalculationError } from "./errors";
import { instantToLocal, localDateTimeToInstant } from "./timezone";

const TERM_NAMES = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];

export function lunarToGregorian(input: CalendarDateInput): CalendarDateInput {
  try {
    const month = input.isLeapMonth ? -input.month : input.month;
    const solar = Lunar.fromYmd(month < 0 ? input.year : input.year, month, input.day).getSolar();
    const roundTrip=solar.getLunar();
    if(roundTrip.getYear()!==input.year||roundTrip.getMonth()!==month||roundTrip.getDay()!==input.day)throw new Error("lunar round-trip mismatch");
    return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
  } catch { throw new CalculationError("INVALID_LUNAR_DATE", "农历日期无效，可能是闰月设置或日期超出支持范围。", "date"); }
}

function providerTermToDomain(name: string, value: Solar, timezone: string): SolarTerm {
  const shanghaiLocal = `${value.toYmd()}T${String(value.getHour()).padStart(2,"0")}:${String(value.getMinute()).padStart(2,"0")}:${String(value.getSecond()).padStart(2,"0")}`;
  const instant = localDateTimeToInstant(shanghaiLocal, "Asia/Shanghai");
  return { name, utcInstant: instant.toString(), localDateTime: instantToLocal(instant, timezone), longitude: TERM_NAMES.indexOf(name) * 15 + 285, provider: "lunar-typescript" };
}

export function getSolarTerms(year: number, timezone: string): SolarTerm[] {
  const table = Solar.fromYmd(year, 6, 1).getLunar().getJieQiTable();
  const values=TERM_NAMES.map((name) => {
    const direct=table[name];
    const source=name==="冬至"&&direct.getYear()!==year?table.DONG_ZHI:direct;
    return providerTermToDomain(name,source,timezone);
  });
  return values.filter((term) => Temporal.Instant.from(term.utcInstant).toZonedDateTimeISO(timezone).year === year);
}

export function getSolarTermsAround(year: number, timezone: string): SolarTerm[] {
  return [year - 1, year, year + 1].flatMap((value) => getSolarTerms(value, timezone)).sort((a,b) => Temporal.Instant.compare(a.utcInstant,b.utcInstant));
}

export function providerPillars(localDateTime: string): { year: string; month: string; day: string; hour: string } {
  const d = Temporal.PlainDateTime.from(localDateTime);
  const lunar = Solar.fromYmdHms(d.year,d.month,d.day,d.hour,d.minute,d.second).getLunar();
  const eightChar=lunar.getEightChar();eightChar.setSect(2);
  return { year: eightChar.getYear(), month: eightChar.getMonth(), day: eightChar.getDay(), hour: eightChar.getTime() };
}
