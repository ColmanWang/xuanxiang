import type { BirthInput } from "../bazi/types";
import type { NormalizedBirthTime } from "./types";
import { lunarToGregorian } from "./lunar-adapter";
import { getUtcOffset, instantToLocal, localDateTimeToInstant } from "./timezone";
import { validateCoordinates, validateGregorianDate } from "./validation";

export function normalizeBirthInput(input: BirthInput): NormalizedBirthTime {
  validateCoordinates(input.location?.latitude, input.location?.longitude);
  const gregorian = input.calendarType === "LUNAR" ? lunarToGregorian(input.date) : input.date;
  validateGregorianDate(gregorian);
  const notes = input.calendarType === "LUNAR" ? [`农历输入已转换为公历 ${gregorian.year}-${gregorian.month}-${gregorian.day}。`] : ["输入为公历，无需历法转换。"];
  const clock = input.timePrecision === "UNKNOWN" ? "12:00:00" : `${String(input.time?.hour ?? 0).padStart(2,"0")}:${String(input.time?.minute ?? 0).padStart(2,"0")}:${String(input.time?.second ?? 0).padStart(2,"0")}`;
  const local = `${gregorian.year}-${String(gregorian.month).padStart(2,"0")}-${String(gregorian.day).padStart(2,"0")}T${clock}`;
  const instant = localDateTimeToInstant(local, input.timezone, input.timeDisambiguation);
  notes.push(input.timePrecision === "UNKNOWN" ? "时刻未知；中午仅用于日期标准化，不计算时柱。" : `使用 IANA 时区 ${input.timezone} 解析本地时刻。`);
  if (input.trueSolarTime) notes.push("真太阳时尚未启用：本次请求被规则校验拒绝，不会伪校正。");
  if (input.timeDisambiguation) notes.push(`夏令时重复时刻采用${input.timeDisambiguation === "EARLIER" ? "较早" : "较晚"}的实际时刻。`);
  return { localDateTime: local, calculationLocalDateTime: instantToLocal(instant,input.timezone), timezone: input.timezone, utcInstant: instant.toString(), longitude: input.location?.longitude, calendarInput: { ...input.date, type: input.calendarType }, gregorianDate: gregorian, conversionNotes: notes, precision: input.timePrecision, timeDisambiguation: input.timeDisambiguation, temporalConfidence: gregorian.year < 1970 ? "HISTORICAL_TIMEZONE" : "MODERN_TIMEZONE", utcOffset: getUtcOffset(instant,input.timezone) };
}
