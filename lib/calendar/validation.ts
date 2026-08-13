import { Temporal } from "@js-temporal/polyfill";
import type { CalendarDateInput } from "./types";
import { CalculationError } from "./errors";

export function validateGregorianDate(date: CalendarDateInput): void {
  try { Temporal.PlainDate.from({ year: date.year, month: date.month, day: date.day }, { overflow: "reject" }); }
  catch { throw new CalculationError("INVALID_DATE", "日期不存在，请检查年、月、日。", "date"); }
}
export function validateCoordinates(latitude?: number, longitude?: number): void {
  if (latitude !== undefined && (latitude < -90 || latitude > 90)) throw new CalculationError("INVALID_COORDINATES", "纬度必须在 -90 到 90 之间。", "location.latitude");
  if (longitude !== undefined && (longitude < -180 || longitude > 180)) throw new CalculationError("INVALID_COORDINATES", "经度必须在 -180 到 180 之间。", "location.longitude");
}
