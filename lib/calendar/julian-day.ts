import { Temporal } from "@js-temporal/polyfill";
export function daysSinceJiaziEpoch(localDate: string): number {
  return Temporal.PlainDate.from("2000-01-07").until(Temporal.PlainDate.from(localDate), { largestUnit: "days" }).days;
}
