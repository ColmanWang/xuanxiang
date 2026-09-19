import type { AiMode } from "../types";

const PREDICTION_PATTERNS = [/发财|财运|婚姻|结婚|疾病|生病|投资|吉凶|能不能过|会不会过/];
const RECALCULATION_PATTERNS = [/重新排盘|自行计算|修改.*(八字|四柱|卦|排盘)/];
export function refusalReason(mode: AiMode, message: string): "PREDICTION_NOT_SUPPORTED" | "DETERMINISTIC_CALCULATION_FORBIDDEN" | null {
  if ((mode === "BAZI_EXPLANATION" || mode === "LIUYAO_EXPLANATION") && PREDICTION_PATTERNS.some((pattern) => pattern.test(message))) return "PREDICTION_NOT_SUPPORTED";
  if (RECALCULATION_PATTERNS.some((pattern) => pattern.test(message))) return "DETERMINISTIC_CALCULATION_FORBIDDEN";
  return null;
}
