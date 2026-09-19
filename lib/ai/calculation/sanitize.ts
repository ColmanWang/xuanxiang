import { AiError } from "../types";

type RecordValue = Record<string, unknown>;
const asRecord = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
export function sanitizeCalculationContext(mode: "BAZI" | "LIUYAO", input: unknown): RecordValue {
  const context = asRecord(input); const rawInput = asRecord(context.input); const common = { engineVersion: context.engineVersion, trace: Array.isArray(context.trace) ? context.trace : [], fingerprint: context.fingerprint ?? context.calculationFingerprint };
  if (!common.engineVersion || !common.fingerprint) throw new AiError("INVALID_CONTEXT", "Calculation context lacks engine identity.");
  if (mode === "BAZI") return { ...common, ruleSetVersion: context.ruleSetVersion, ruleset: context.ruleset, pillars: context.pillars, derived: context.derived, luck: context.luck, nearestBoundary: context.nearestBoundary, input: { timezone: rawInput.timezone, localDateTime: rawInput.localDateTime, utcInstant: rawInput.utcInstant } };
  return { ...common, ruleSet: context.ruleSet, calendarContext: context.calendarContext, primaryHexagram: context.primaryHexagram, changedHexagram: context.changedHexagram, movingLines: context.movingLines, palace: context.palace, shiYing: context.shiYing, lines: context.lines, voidBranches: context.voidBranches, hiddenSpiritsStatus: context.hiddenSpiritsStatus, input: { timezone: rawInput.timezone, localDateTime: rawInput.localDateTime, lines: rawInput.lines } };
}
