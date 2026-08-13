import { Temporal } from "@js-temporal/polyfill";
import { CalculationError } from "./errors";
import type { TimeDisambiguation } from "./types";

export { CalculationError as CalendarValidationError } from "./errors";

export function assertTimeZone(timezone: string): void {
  try { Temporal.Now.instant().toZonedDateTimeISO(timezone); }
  catch { throw new CalculationError("INVALID_TIMEZONE", "请输入有效的 IANA 时区，例如 Asia/Shanghai。", "timezone"); }
}

export function localDateTimeToInstant(localDateTime: string, timezone: string, disambiguation?: TimeDisambiguation): Temporal.Instant {
  assertTimeZone(timezone);
  let plain: Temporal.PlainDateTime;
  try { plain = Temporal.PlainDateTime.from(localDateTime); }
  catch { throw new CalculationError("INVALID_DATE", "出生日期或时间无效。", "date"); }
  const earlier = plain.toZonedDateTime(timezone, { disambiguation: "earlier" });
  const later = plain.toZonedDateTime(timezone, { disambiguation: "later" });
  const earlierMatches = earlier.toPlainDateTime().equals(plain);
  const laterMatches = later.toPlainDateTime().equals(plain);
  if (!earlierMatches || !laterMatches) {
    throw new CalculationError("NONEXISTENT_LOCAL_TIME", "该本地时间因夏令时向前调整而不存在，请选择调整后的有效时间。", "time");
  }
  if (!earlier.toInstant().equals(later.toInstant())) {
    if (!disambiguation) throw new CalculationError("AMBIGUOUS_LOCAL_TIME", "该本地时间因夏令时回拨对应两个实际时刻，请选择较早或较晚的一次。", "time");
    return (disambiguation === "EARLIER" ? earlier : later).toInstant();
  }
  return earlier.toInstant();
}

export function getUtcOffset(instant: Temporal.Instant, timezone: string): string {
  return instant.toZonedDateTimeISO(timezone).offset;
}

export function instantToLocal(instant: Temporal.Instant, timezone: string): string {
  return instant.toZonedDateTimeISO(timezone).toPlainDateTime().toString({ smallestUnit: "second" });
}
