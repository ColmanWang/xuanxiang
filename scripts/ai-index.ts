import { prisma } from "@/lib/prisma";
import { exportKnowledgeBase } from "@/lib/content/database";
import { DeterministicFakeEmbeddingProvider } from "@/lib/ai/providers/fake";
import { OpenAiCompatibleEmbeddingProvider } from "@/lib/ai/providers/openai-compatible";
import { runRagIndex } from "@/lib/ai/indexing/run-index";
import { RagIndexRepository } from "@/lib/repositories/rag-index-repository";
import { VectorRepository } from "@/lib/repositories/vector-repository";

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has("--dry-run");
const full = flags.has("--full");
if (full && flags.has("--changed-only")) throw new Error("Use either --full or --changed-only, not both.");

const model = process.env.AI_EMBEDDING_MODEL ?? "unconfigured";
const dimensions = Number(process.env.AI_EMBEDDING_DIMENSIONS ?? "8");
const provider = process.env.AI_ALLOW_TEST_PROVIDER === "true"
  ? new DeterministicFakeEmbeddingProvider({ dimensions })
  : process.env.AI_EMBEDDING_BASE_URL && process.env.AI_EMBEDDING_API_KEY
    ? new OpenAiCompatibleEmbeddingProvider({ id: process.env.AI_EMBEDDING_PROVIDER ?? "openai-compatible", baseUrl: process.env.AI_EMBEDDING_BASE_URL, apiKey: process.env.AI_EMBEDDING_API_KEY, dimensions })
    : dryRun ? new DeterministicFakeEmbeddingProvider({ dimensions }) : undefined;
if (!provider) throw new Error("Embedding provider is not configured. Use --dry-run or configure server-side AI_EMBEDDING_* variables.");
const embeddingProvider = provider;

async function main() {
  try {
    const summary = await runRagIndex({ content: await exportKnowledgeBase(prisma), provider: embeddingProvider, model, repository: new RagIndexRepository(prisma), vectors: new VectorRepository(prisma), dryRun, full });
    console.log(JSON.stringify(summary, null, 2));
    if (summary.failed) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
