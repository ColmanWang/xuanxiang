import { isRagDocumentIncluded } from "../rag/inclusion-policy";
import type { AiAnswer, CitationContext, ValidatedCitation } from "../types";

export interface CitationValidationResult { valid: boolean; invalidKeys: string[]; citations: ValidatedCitation[] }
const presentation = (context: CitationContext): Pick<ValidatedCitation, "id" | "title" | "kind" | "href" | "locator"> => {
  const document = context.document;
  if (document.entityType === "PASSAGE") return { id: context.key, title: document.classicId ? `原典·${document.section}` : `原典文句·${document.section}`, kind: "PASSAGE", href: document.classicId ? `/classics/${encodeURIComponent(document.classicId)}${document.passageId ? `?passage=${encodeURIComponent(document.passageId)}` : ""}` : `/search?q=${encodeURIComponent(document.entityId)}`, locator: document.section };
  const kind = document.entityType === "PERSON_SUMMARY" ? "PERSON" : "KNOWLEDGE";
  return { id: context.key, title: `${document.entityType}·${document.section}`, kind, href: `/knowledge/${encodeURIComponent(document.entityId)}`, locator: document.section };
};
export function validateAiCitations(answer: Pick<AiAnswer, "answer" | "citationKeys">, allowlist: readonly CitationContext[]): CitationValidationResult {
  const byKey = new Map(allowlist.map((item) => [item.key, item]));
  const referenced = new Set([...answer.citationKeys, ...Array.from(answer.answer.matchAll(/\[([A-Z]\d+)\]/g), (match) => match[1])]);
  const invalidKeys = [...referenced].filter((key) => { const context = byKey.get(key); return !context || !isRagDocumentIncluded(context.document); });
  const citations = [...referenced].flatMap((key) => { const context = byKey.get(key); return context && isRagDocumentIncluded(context.document) ? [{ ...presentation(context), key, documentId: context.document.documentId, citationId: context.citationId, passageId: context.passageId, sourceId: context.sourceId }] : []; });
  return { valid: invalidKeys.length === 0, invalidKeys, citations };
}
