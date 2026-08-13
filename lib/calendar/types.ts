export type CalendarType = "GREGORIAN" | "LUNAR";
export type TimePrecision = "MINUTE" | "HOUR" | "UNKNOWN";
export type TimeDisambiguation = "EARLIER" | "LATER";
export type TemporalConfidence = "MODERN_TIMEZONE" | "HISTORICAL_TIMEZONE" | "USER_SUPPLIED_OFFSET";
export type VerificationLevel = "INTERNAL" | "CROSS_CHECKED" | "AUTHORITATIVE_FIXTURE" | "MULTI_SOURCE_VERIFIED";

export interface CalendarDateInput {
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
}

export interface NormalizedBirthTime {
  localDateTime: string;
  calculationLocalDateTime: string;
  timezone: string;
  utcInstant: string;
  longitude?: number;
  calendarInput: CalendarDateInput & { type: CalendarType };
  gregorianDate: CalendarDateInput;
  conversionNotes: string[];
  precision: TimePrecision;
  timeDisambiguation?: TimeDisambiguation;
  temporalConfidence: TemporalConfidence;
  utcOffset: string;
}

export interface SolarTerm {
  name: string;
  utcInstant: string;
  localDateTime: string;
  longitude: number;
  provider: "lunar-typescript";
}
