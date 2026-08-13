export type CalculationErrorCode =
  | "INVALID_DATE"
  | "INVALID_TIME"
  | "INVALID_TIMEZONE"
  | "NONEXISTENT_LOCAL_TIME"
  | "AMBIGUOUS_LOCAL_TIME"
  | "INVALID_LUNAR_DATE"
  | "UNSUPPORTED_DATE_RANGE"
  | "INVALID_COORDINATES"
  | "TRUE_SOLAR_TIME_NOT_IMPLEMENTED"
  | "UNSUPPORTED_RULESET"
  | "PROVIDER_MISMATCH"
  | "MISSING_RULE_INPUT"
  | "UNSUPPORTED_POLICY"
  | "POLICY_NOT_AVAILABLE"
  | "INVALID_RULE_OVERRIDE";

export class CalculationError extends Error {
  constructor(
    public readonly code: CalculationErrorCode,
    message: string,
    public readonly field?: string,
    public readonly details?: Record<string, string | number | boolean | null>,
  ) {
    super(message);
    this.name = "CalculationError";
  }
}
