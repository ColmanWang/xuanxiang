import type { ChatProvider } from "./provider";
import { applyContextBudget, DEFAULT_CONTEXT_BUDGET, type ContextBudget } from "./rag/context-budget";
import { rankRetrievalResults } from "./rag/ranking";
import { validateAiCitations } from "./guardrails/citations";
import { assessGrounding, refusalForInsufficientContext } from "./guardrails/grounding";
import { refusalReason } from "./guardrails/refusal";
import { systemPromptFor } from "./prompts/system";
import { wrapPromptData } from "./prompts/boundaries";
import { AiError, type AiAnswer, type AiAnswerRequest, type AiAnswerResult, type CitationContext, type RetrievalResult } from "./types";

export interface AiAnswerService { answer(request: AiAnswerRequest): Promise<AiAnswerResult> }
export interface AiAnswerServiceDependencies {
  chatProvider: ChatProvider; chatModel: string;
  retrieve(request: AiAnswerRequest): Promise<readonly RetrievalResult[]>;
  contextBudget?: ContextBudget;
}

const parseAnswer = (content: string): AiAnswer => {
  let value: unknown; try { value = JSON.parse(content); } catch (error) { throw new AiError("MODEL_OUTPUT_INVALID", "Model output is not JSON.", error); }
  if (!value || typeof value !== "object") throw new AiError("MODEL_OUTPUT_INVALID", "Model output has an invalid shape.");
  const data = value as Record<string, unknown>;
  if (typeof data.answer !== "string" || !Array.isArray(data.claims) || !Array.isArray(data.citationKeys) || !Array.isArray(data.limitations)) throw new AiError("MODEL_OUTPUT_INVALID", "Model output has an invalid shape.");
  const claims = data.claims.map((claim) => { const item = claim as Record<string, unknown>; if (typeof item?.text !== "string" || !Array.isArray(item.citationKeys) || !item.citationKeys.every((key) => typeof key === "string")) throw new AiError("MODEL_OUTPUT_INVALID", "Model claims have an invalid shape."); return { text: item.text, citationKeys: item.citationKeys as string[] }; });
  if (!data.citationKeys.every((key) => typeof key === "string") || !data.limitations.every((item) => typeof item === "string")) throw new AiError("MODEL_OUTPUT_INVALID", "Model output has an invalid shape.");
  return { answer: data.answer, claims, citationKeys: data.citationKeys as string[], limitations: data.limitations as string[] };
};

export function createAiAnswerService(dependencies: AiAnswerServiceDependencies): AiAnswerService {
  return { async answer(request) {
    const refused = refusalReason(request.mode, request.message);
    if (refused) return { answer: refused === "PREDICTION_NOT_SUPPORTED" ? "当前 AI 功能仅解释排盘结构、规则与相关传统知识，不提供个体吉凶预测。" : "AI 不参与排盘计算或修改确定性结果，只解释引擎已生成的结果。", claims: [], citationKeys: [], citations: [], limitations: [refused] };
    const ranked = rankRetrievalResults(await dependencies.retrieve(request));
    const documents = applyContextBudget(ranked.map((item) => item.document), dependencies.contextBudget ?? DEFAULT_CONTEXT_BUDGET);
    if (documents.length === 0) return refusalForInsufficientContext();
    const allowlist: CitationContext[] = documents.map((document, index) => ({ key: `C${index + 1}`, document, citationId: document.citationIds[0], passageId: document.passageId }));
    const context = allowlist.map((item) => `[${item.key}] ${item.document.entityType}/${item.document.section}\n${item.document.text}`).join("\n\n");
    const startedAt = Date.now();
    const response = await dependencies.chatProvider.chat({ model: dependencies.chatModel, temperature: 0, responseFormat: "json", messages: [{ role: "system", content: systemPromptFor(request.mode) }, { role: "user", content: `${wrapPromptData("user_message", request.message)}\n\n${wrapPromptData("retrieved_context", context)}${request.context ? `\n\n${wrapPromptData("calculation_context", JSON.stringify(request.context))}` : ""}` }] });
    const answer = parseAnswer(response.content); const grounding = assessGrounding(answer, allowlist); const validation = validateAiCitations(answer, allowlist);
    if (!grounding.grounded || !validation.valid) throw new AiError(grounding.grounded ? "INVALID_CITATION" : grounding.reason === "INVALID_CITATION" ? "INVALID_CITATION" : "GROUNDING_FAILED", "AI answer failed grounding validation.");
    return { ...answer, citations: validation.citations, usage: { provider: dependencies.chatProvider.id, model: dependencies.chatModel, requestType: request.mode, latencyMs: Date.now() - startedAt } };
  } };
}
