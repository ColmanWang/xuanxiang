import { prisma } from "@/lib/prisma";
import { exportKnowledgeBase } from "@/lib/content/database";
import { createContentSnapshotManifest } from "@/lib/content/export";
import { RagStatusRepository } from "@/lib/repositories/rag-status-repository";

async function main() {
  try {
    const [{ documents, embeddings, manifest }, content] = await Promise.all([new RagStatusRepository(prisma).counts(), exportKnowledgeBase(prisma)]);
  const checksum = createContentSnapshotManifest(content).checksum;
  const embeddingConfigured = Boolean(process.env.AI_EMBEDDING_MODEL && (process.env.AI_EMBEDDING_API_KEY || process.env.AI_ALLOW_TEST_PROVIDER === "true"));
  const chatConfigured = Boolean(process.env.AI_CHAT_MODEL && process.env.AI_CHAT_API_KEY);
  const indexState = !manifest ? "NOT_BUILT" : manifest.contentSnapshotChecksum === checksum && manifest.state === "CURRENT" ? "CURRENT" : "INDEX_STALE";
    console.log(JSON.stringify({ chatProvider: { configured: chatConfigured, provider: process.env.AI_CHAT_PROVIDER ?? null, model: process.env.AI_CHAT_MODEL ?? null }, embeddingProvider: { configured: embeddingConfigured, provider: process.env.AI_EMBEDDING_PROVIDER ?? null, model: process.env.AI_EMBEDDING_MODEL ?? null }, index: { state: indexState, documents, embeddings, snapshotChecksum: checksum, indexedSnapshotChecksum: manifest?.contentSnapshotChecksum ?? null }, ragReady: chatConfigured && embeddingConfigured && indexState === "CURRENT" }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

void main();
