import { Temporal } from "@js-temporal/polyfill";
import type { NormalizedBirthTime, SolarTerm } from "./types";
import { getSolarTermsAround } from "./lunar-adapter";

export interface SolarTermContext { previous: SolarTerm; next: SolarTerm; terms: SolarTerm[] }
export function locateSolarTermContext(time: NormalizedBirthTime): SolarTermContext {
  const year = Temporal.PlainDateTime.from(time.calculationLocalDateTime).year;
  const terms = getSolarTermsAround(year, time.timezone);
  const instant = Temporal.Instant.from(time.utcInstant);
  const previous = [...terms].reverse().find((term) => Temporal.Instant.compare(term.utcInstant, instant) <= 0);
  const next = terms.find((term) => Temporal.Instant.compare(term.utcInstant, instant) > 0);
  if (!previous || !next) throw new Error("无法定位节气区间。");
  return { previous, next, terms };
}
export const MONTH_BOUNDARY_TERMS = ["立春","惊蛰","清明","立夏","芒种","小暑","立秋","白露","寒露","立冬","大雪","小寒"] as const;
