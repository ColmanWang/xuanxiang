export const LIUYAO_ERROR_CODES = [
  "INVALID_INPUT",
  "INVALID_LINE_COUNT",
  "INVALID_LINE_VALUE",
  "INVALID_LINE_ORDER",
  "INVALID_DATE",
  "INVALID_TIMEZONE",
  "AMBIGUOUS_LOCAL_TIME",
  "NONEXISTENT_LOCAL_TIME",
  "UNSUPPORTED_RULESET",
  "UNSUPPORTED_POLICY",
  "POLICY_NOT_AVAILABLE",
  "PROVIDER_MISMATCH",
] as const;

export type LiuyaoErrorCode = (typeof LIUYAO_ERROR_CODES)[number];

export function isLiuyaoErrorCode(value: unknown): value is LiuyaoErrorCode {
  return typeof value === "string" && LIUYAO_ERROR_CODES.some((code) => code === value);
}

export class LiuyaoCalculationError extends Error {
  constructor(
    public readonly code: LiuyaoErrorCode,
    message: string,
    public readonly field?: string,
    public readonly details?: Readonly<Record<string, string | number | boolean | null>>,
  ) {
    super(message);
    this.name = "LiuyaoCalculationError";
  }
}

export function normalizeLiuyaoError(error: unknown): LiuyaoCalculationError {
  if (error instanceof LiuyaoCalculationError) return error;
  if (error instanceof Error && isLiuyaoErrorCode(error.message)) {
    return new LiuyaoCalculationError(error.message, "六爻推演未能完成，请检查输入与规则。");
  }
  if (error instanceof Error && error.name === "CalculationError") {
    const candidate = error as Error & {
      code?: unknown;
      field?: string;
      details?: Readonly<Record<string, string | number | boolean | null>>;
    };
    if (isLiuyaoErrorCode(candidate.code)) {
      return new LiuyaoCalculationError(candidate.code, error.message, candidate.field, candidate.details);
    }
  }
  return new LiuyaoCalculationError("INVALID_INPUT", "六爻推演未能完成，请检查输入。");
}
