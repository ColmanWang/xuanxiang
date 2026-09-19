import type { RetrievalResult } from "../types";
const clamp = (value = 0) => Math.max(0, Math.min(1, value));
export function rankRetrievalResults(results: readonly RetrievalResult[]): RetrievalResult[] {
  return results.map((result) => {
    const graph = result.signals.graphDistance ? 1 / (result.signals.graphDistance + 1) : 0;
    const editorial = result.editorialStatus === "REVIEWED" ? 1 : result.editorialStatus === "BASIC" ? 0.6 : 0.3;
    const score = 4 * clamp(result.signals.exactMatch) + 2 * clamp(result.signals.lexicalScore) + 2 * clamp(result.signals.vectorSimilarity) + clamp(result.signals.entityImportance) + editorial + 1.5 * clamp(result.citationCoverage) + graph;
    return { ...result, score };
  }).sort((a, b) => b.score - a.score || a.document.documentId.localeCompare(b.document.documentId));
}
