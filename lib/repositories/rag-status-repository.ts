import type { PrismaClient } from "@prisma/client";

export class RagStatusRepository {
  constructor(private readonly db: PrismaClient) {}
  async counts() {
    const [documents, embeddings, manifest] = await Promise.all([
      this.db.ragDocument.count(), this.db.ragEmbedding.count(), this.db.indexManifest.findFirst({ orderBy: { lastIndexedAt: "desc" } }),
    ]);
    return { documents, embeddings, manifest };
  }
}
