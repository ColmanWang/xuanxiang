import type { RagDocument } from "../types";
export interface ContextBudget { maxDocuments: number; maxCharacters: number; maxPerEntity: number; maxPerClassic: number }
export const DEFAULT_CONTEXT_BUDGET: ContextBudget = { maxDocuments: 8, maxCharacters: 16_000, maxPerEntity: 3, maxPerClassic: 3 };

export function applyContextBudget(documents: readonly RagDocument[], budget: ContextBudget = DEFAULT_CONTEXT_BUDGET): RagDocument[] {
  const selected: RagDocument[] = []; const entities = new Map<string, number>(); const classics = new Map<string, number>(); let characters = 0;
  for (const document of documents) {
    if (selected.length >= budget.maxDocuments || characters + document.text.length > budget.maxCharacters) continue;
    if ((entities.get(document.entityId) ?? 0) >= budget.maxPerEntity) continue;
    if (document.classicId && (classics.get(document.classicId) ?? 0) >= budget.maxPerClassic) continue;
    selected.push(document); characters += document.text.length; entities.set(document.entityId, (entities.get(document.entityId) ?? 0) + 1);
    if (document.classicId) classics.set(document.classicId, (classics.get(document.classicId) ?? 0) + 1);
  }
  return selected;
}
