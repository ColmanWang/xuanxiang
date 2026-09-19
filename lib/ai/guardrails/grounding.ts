import type { AiAnswer, AiAnswerResult, CitationContext } from "../types";
import { validateAiCitations } from "./citations";

export type GroundingAssessment = { grounded: true } | { grounded: false; reason: "INVALID_CITATION" | "UNGROUNDED_CLAIM" | "INSUFFICIENT_CONTEXT" };
export function assessGrounding(answer: AiAnswer, context: readonly CitationContext[]): GroundingAssessment {
  if (context.length === 0) return { grounded: false, reason: "INSUFFICIENT_CONTEXT" };
  if (!validateAiCitations(answer, context).valid) return { grounded: false, reason: "INVALID_CITATION" };
  if (answer.claims.length === 0) return { grounded: false, reason: "UNGROUNDED_CLAIM" };
  if (answer.claims.some((claim) => claim.citationKeys.length === 0 || claim.citationKeys.some((key) => !answer.citationKeys.includes(key)))) return { grounded: false, reason: "UNGROUNDED_CLAIM" };
  const normalize = (value: string) => value.replace(/\s+/g, "").replace(/[，。！？；：、“”‘’（）()]/g, "");
  const answerText = normalize(answer.answer);
  if (answer.claims.some((claim) => !answerText.includes(normalize(claim.text)))) return { grounded: false, reason: "UNGROUNDED_CLAIM" };
  const sentences = answer.answer.split(/[。！？；\n]+/).map(normalize).filter((sentence) => sentence.length >= 4);
  if (sentences.some((sentence) => !answer.claims.some((claim) => sentence.includes(normalize(claim.text)) || normalize(claim.text).includes(sentence)))) return { grounded: false, reason: "UNGROUNDED_CLAIM" };
  return { grounded: true };
}
export function refusalForInsufficientContext(): AiAnswerResult {
  return { answer: "当前玄象资料库不足以支持这一结论。", claims: [], citationKeys: [], citations: [], limitations: ["未检索到足够的可公开证据。"], refusal: "INSUFFICIENT_CONTEXT" };
}
