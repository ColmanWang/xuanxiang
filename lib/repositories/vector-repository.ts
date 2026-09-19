import { Prisma, type PrismaClient } from "@prisma/client";

type RawDatabase = Pick<PrismaClient, "$executeRaw" | "$queryRaw">;

export interface VectorMatch {
  documentId: string;
  score: number;
}

function assertVector(vector: readonly number[], dimensions?: number): void {
  if (!vector.length || vector.some((value) => !Number.isFinite(value))) throw new Error("Embedding vector must contain finite numbers.");
  if (dimensions !== undefined && vector.length !== dimensions) throw new Error(`Embedding dimension mismatch: expected ${dimensions}, received ${vector.length}.`);
}

export class VectorRepository {
  constructor(private readonly db: RawDatabase) {}

  async upsert(input: { id?: string; documentId: string; provider: string; model: string; dimensions: number; contentHash: string; vector: readonly number[] }): Promise<void> {
    assertVector(input.vector, input.dimensions);
    const value = JSON.stringify(input.vector);
    await this.db.$executeRaw(Prisma.sql`
      INSERT INTO "RagEmbedding" ("id", "documentId", "provider", "model", "dimensions", "contentHash", "embedding", "indexedAt")
      VALUES (${input.id ?? crypto.randomUUID()}, ${input.documentId}, ${input.provider}, ${input.model}, ${input.dimensions}, ${input.contentHash}, ${value}::vector, NOW())
      ON CONFLICT ("documentId", "provider", "model") DO UPDATE SET
        "dimensions" = EXCLUDED."dimensions", "contentHash" = EXCLUDED."contentHash",
        "embedding" = EXCLUDED."embedding", "indexedAt" = NOW()
    `);
  }

  async search(input: { vector: readonly number[]; provider: string; model: string; dimensions: number; limit: number }): Promise<VectorMatch[]> {
    assertVector(input.vector, input.dimensions);
    if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100) throw new Error("Vector search limit must be between 1 and 100.");
    const value = JSON.stringify(input.vector);
    return this.db.$queryRaw<VectorMatch[]>(Prisma.sql`
      SELECT "documentId", 1 - ("embedding" <=> ${value}::vector) AS "score"
      FROM "RagEmbedding"
      WHERE "provider" = ${input.provider} AND "model" = ${input.model} AND "dimensions" = ${input.dimensions}
      ORDER BY "embedding" <=> ${value}::vector
      LIMIT ${input.limit}
    `);
  }
}
