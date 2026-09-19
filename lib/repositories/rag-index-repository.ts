import type { IndexState, PrismaClient } from "@prisma/client";
import type { ExistingEmbeddingState, IndexableDocument } from "@/lib/ai/indexing/types";
import { RAG_INDEX_VERSION } from "@/lib/ai/indexing/types";

export class RagIndexRepository {
  constructor(private readonly db: PrismaClient) {}

  async listEmbeddingStates(provider: string, model: string): Promise<ExistingEmbeddingState[]> {
    const documents = await this.db.ragDocument.findMany({
      select: { id: true, contentHash: true, embeddings: { where: { provider, model }, select: { provider: true, model: true, contentHash: true }, take: 1 } },
    });
    return documents.map((document) => ({ documentId: document.id, contentHash: document.embeddings[0]?.contentHash ?? document.contentHash, provider: document.embeddings[0]?.provider ?? "", model: document.embeddings[0]?.model ?? "" }));
  }

  async upsertDocument(document: IndexableDocument): Promise<void> {
    const data = {
      type: document.type, entityType: document.entityType, entityId: document.entityId, section: document.section,
      text: document.text, sourceType: document.sourceType, citationIds: document.citationIds, passageId: document.passageId,
      classicId: document.classicId, editorialStatus: document.editorialStatus as "BASIC", publicationStatus: document.publicationStatus as "PUBLISHED",
      evidenceStatus: document.evidenceStatus as "DOCUMENTED" | undefined, contentHash: document.contentHash, indexVersion: RAG_INDEX_VERSION,
    };
    await this.db.ragDocument.upsert({ where: { id: document.documentId }, create: { id: document.documentId, ...data }, update: data });
  }

  async removeDocuments(documentIds: readonly string[]): Promise<number> {
    if (!documentIds.length) return 0;
    return (await this.db.ragDocument.deleteMany({ where: { id: { in: [...documentIds] } } })).count;
  }

  async saveManifest(input: { provider: string; model: string; dimensions: number; documentCount: number; embeddingCount: number; contentSnapshotChecksum: string; state: IndexState }): Promise<void> {
    const key = { indexVersion_provider_model: { indexVersion: RAG_INDEX_VERSION, provider: input.provider, model: input.model } };
    const data = { ...input, indexVersion: RAG_INDEX_VERSION, lastIndexedAt: new Date() };
    await this.db.indexManifest.upsert({ where: key, create: data, update: data });
  }

  async latestManifest() {
    return this.db.indexManifest.findFirst({ orderBy: { lastIndexedAt: "desc" } });
  }

  async manifestFor(provider: string, model: string) {
    return this.db.indexManifest.findUnique({ where: { indexVersion_provider_model: { indexVersion: RAG_INDEX_VERSION, provider, model } } });
  }
}
