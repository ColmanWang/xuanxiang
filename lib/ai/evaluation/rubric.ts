import type { EvaluationRubricItem } from "./types";

export const HUMAN_EVALUATION_RUBRIC: readonly EvaluationRubricItem[] = [
  { id: "grounded", label: "Grounded", question: "每个可验证声明是否只来自已提供证据或 Trace？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
  { id: "correct-context", label: "Correct Context", question: "检索内容是否回答了当前问题，而不是仅有关键词重合？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
  { id: "citation-valid", label: "Citation Valid", question: "Citation ID 是否存在，且真正支持相邻声明？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
  { id: "no-unsupported-claim", label: "No Unsupported Claim", question: "是否没有补全原文、归属、日期或预测性结论？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
  { id: "calculation-consistent", label: "Calculation Consistent", question: "所述数值与规则是否逐项等于 Engine Trace，且未重新计算？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
  { id: "appropriate-limitation", label: "Appropriate Limitation", question: "资料不足、异说或未实现能力是否被明确说明？", allowedStatuses: ["PASS", "FAIL", "REVIEW"] },
] as const;
