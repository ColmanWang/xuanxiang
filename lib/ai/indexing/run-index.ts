import type { EmbeddingProvider } from "@/lib/ai/provider";
import type { ContentExport } from "@/lib/content/types";
import { createContentSnapshotManifest } from "@/lib/content/export";
import type { RagIndexRepository } from "@/lib/repositories/rag-index-repository";
import type { VectorRepository } from "@/lib/repositories/vector-repository";
import { createIndexPlan } from "./plan";
import { buildIndexableDocuments } from "./source-documents";
import type { IndexRunSummary } from "./types";

export async function runRagIndex(input: {
  content: ContentExport;
  provider: EmbeddingProvider;
  model: string;
  repository: RagIndexRepository;
  vectors: VectorRepository;
  dryRun?: boolean;
  full?: boolean;
}): Promise<IndexRunSummary> {
  const documents = buildIndexableDocuments(input.content);
  const snapshotChecksum = createContentSnapshotManifest(input.content).checksum;
  const existing = await input.repository.listEmbeddingStates(input.provider.id, input.model);
  const plan = createIndexPlan(documents, existing, { provider: input.provider.id, model: input.model, full: input.full ?? false });
  const summary: IndexRunSummary = { created: plan.create.length, updated: plan.update.length, unchanged: plan.unchanged.length, removed: plan.remove.length, failed: 0, dryRun: input.dryRun ?? false, snapshotChecksum };
  if (input.dryRun) return summary;

  const byId = new Map(documents.map((document) => [document.documentId, document]));
  for (const document of documents) await input.repository.upsertDocument(document);
  await input.repository.removeDocuments(plan.remove);

  for (const documentId of [...plan.create, ...plan.update]) {
    const document = byId.get(documentId);
    if (!document) continue;
    try {
      const [vector] = await input.provider.embedBatch([document.text], { model: input.model });
      await input.vectors.upsert({ documentId, provider: input.provider.id, model: input.model, dimensions: input.provider.dimensions, contentHash: document.contentHash, vector });
    } catch (error) {
      summary.failed += 1;
      console.error(`[ai:index] ${documentId}:`, error instanceof Error ? error.message : error);
    }
  }
  await input.repository.saveManifest({
    provider: input.provider.id, model: input.model, dimensions: input.provider.dimensions,
    documentCount: documents.length, embeddingCount: documents.length - summary.failed,
    contentSnapshotChecksum: snapshotChecksum, state: summary.failed ? "FAILED" : "CURRENT",
  });
  return summary;
}
