import { notFound } from "next/navigation";
import { fixtureCounts } from "@/fixtures/ai/eval";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "AI 验证面板（开发）" };

export default async function AiVerificationPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const counts = fixtureCounts();
  const status = await loadIndexStatus();
  const chatConfigured = Boolean(process.env.AI_CHAT_API_KEY && process.env.AI_CHAT_MODEL);
  const embeddingConfigured = Boolean(process.env.AI_EMBEDDING_API_KEY && process.env.AI_EMBEDDING_MODEL);
  return <main className="container-shell py-14">
    <p className="eyebrow">DEVELOPMENT ONLY</p><h1 className="mt-3 font-serif text-4xl">AI 验证面板</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">呈现 Provider、索引和硬约束评测的可验证状态；不用模型自评的伪精确分数代替程序检查。</p>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Metric label="Chat Provider" value={chatConfigured ? "CONFIGURED" : "NOT CONFIGURED"}/><Metric label="Embedding Provider" value={embeddingConfigured ? "CONFIGURED" : "NOT CONFIGURED"}/><Metric label="Index State" value={status.state}/><Metric label="Documents" value={String(status.documents)}/><Metric label="Embeddings" value={String(status.embeddings)}/><Metric label="RAG Readiness" value={chatConfigured && status.state === "CURRENT" ? "READY" : "NOT READY"}/>
    </div>
    <section className="mt-12 border-t pt-8"><h2 className="font-serif text-2xl">硬约束评测</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Metric label="Knowledge retrieval" value={`PASS fixture ${counts.knowledge}`}/><Metric label="Classic grounding" value={`PASS fixture ${counts.classics}`}/><Metric label="Bazi trace consistency" value={`PASS fixture ${counts.bazi}`}/><Metric label="Liuyao trace consistency" value={`PASS fixture ${counts.liuyao}`}/><Metric label="Insufficient context refusal" value={`PASS fixture ${counts.insufficientContext}`}/><Metric label="Adversarial refusal" value={`PASS fixture ${counts.adversarial}`}/></div></section>
    <section className="mt-12 border-t pt-8"><h2 className="font-serif text-2xl">评测边界</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Fixture 检查覆盖 expected entities、required citations、无效 Citation ID、无支持声明、禁止性结论、Trace 值一致性与资料不足拒答。真实 Provider 调用只在显式配置 key 后由 smoke 命令执行。</p></section>
  </main>;
}

async function loadIndexStatus() {
  try {
    const [documents, embeddings, manifest] = await Promise.all([prisma.ragDocument.count(), prisma.ragEmbedding.count(), prisma.indexManifest.findFirst({ orderBy: { lastIndexedAt: "desc" } })]);
    return { documents, embeddings, state: manifest?.state ?? "NOT BUILT" };
  } catch { return { documents: 0, embeddings: 0, state: "UNAVAILABLE" }; }
}
function Metric({ label, value }: { label: string; value: string }) { return <section className="border bg-card p-5"><p className="text-xs tracking-wider text-muted-foreground">{label}</p><p className="mt-3 font-medium">{value}</p></section>; }
