import type { ExistingEmbeddingState, IndexPlan } from "./types";

export function createIndexPlan(
  wanted: readonly { documentId: string; contentHash: string }[],
  existing: readonly ExistingEmbeddingState[],
  options: { provider: string; model: string; full: boolean },
): IndexPlan {
  const current = new Map(existing.map((item) => [item.documentId, item]));
  const desiredIds = new Set(wanted.map((item) => item.documentId));
  const plan: IndexPlan = { create: [], update: [], unchanged: [], remove: [] };
  for (const document of wanted) {
    const previous = current.get(document.documentId);
    if (!previous) plan.create.push(document.documentId);
    else if (options.full || previous.contentHash !== document.contentHash || previous.provider !== options.provider || previous.model !== options.model) plan.update.push(document.documentId);
    else plan.unchanged.push(document.documentId);
  }
  plan.remove = existing.filter((item) => !desiredIds.has(item.documentId)).map((item) => item.documentId);
  for (const values of [plan.create, plan.update, plan.unchanged, plan.remove]) values.sort((a: string, b: string) => a.localeCompare(b, "en"));
  return plan;
}
