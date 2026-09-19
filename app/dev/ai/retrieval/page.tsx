import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "AI 检索调试器（开发）" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function RetrievalDebuggerPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 200);
  const documents = query ? await loadMatches(query) : [];
  const ranked = documents.map((document) => {
    const exact = document.text.includes(query) || document.entityId === query;
    const lexical = tokenCoverage(query, document.text);
    return { ...document, exact, lexical, score: (exact ? 4 : 0) + lexical * 2 + Math.min(1, document.citationIds.length) * 1.5 };
  }).sort((a, b) => b.score - a.score);
  const citationCount = new Set(ranked.flatMap((item) => item.citationIds)).size;

  return <main className="container-shell py-14">
    <p className="eyebrow">DEVELOPMENT ONLY</p>
    <h1 className="mt-3 font-serif text-4xl">AI 检索调试器</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">查看当前开发索引的词面命中、排序与引用覆盖。未建立向量或图扩展时会明确标记，不伪造命中。</p>
    <form className="mt-8 flex max-w-3xl gap-3"><input name="q" defaultValue={query} maxLength={200} placeholder="输入问题或关键词" className="min-w-0 flex-1 border bg-background px-4 py-3"/><button className="border bg-foreground px-5 py-3 text-background">检索</button></form>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Lexical matches" value={String(ranked.length)}/><Metric label="Vector matches" value="N/A"/><Metric label="Graph expansion" value="N/A"/><Metric label="Citation coverage" value={`${citationCount} citation IDs`}/>
    </div>
    {query && <section className="mt-10"><h2 className="font-serif text-2xl">Final ranked context</h2>{ranked.length === 0 ? <p className="mt-4 border p-5 text-sm text-muted-foreground">没有可用索引内容；系统应转入资料不足流程。</p> : <div className="mt-5 space-y-3">{ranked.map((item, index) => <article key={item.id} className="border bg-card p-5"><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>#{index + 1}</span><span>{item.type}</span><span>{item.entityType}:{item.entityId}</span><span>score {item.score.toFixed(2)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{item.text.slice(0, 600)}</p><p className="mt-3 text-xs text-muted-foreground">Signals: exact {item.exact ? "YES" : "NO"} · lexical {item.lexical.toFixed(2)} · citations {item.citationIds.join(", ") || "NONE"}</p></article>)}</div>}</section>}
  </main>;
}

async function loadMatches(query: string) {
  try {
    return await prisma.ragDocument.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ text: { contains: query, mode: "insensitive" } }, { entityId: { contains: query, mode: "insensitive" } }, { section: { contains: query, mode: "insensitive" } }] }, select: { id: true, type: true, entityType: true, entityId: true, section: true, text: true, citationIds: true, editorialStatus: true }, take: 20 });
  } catch { return []; }
}

function tokenCoverage(query: string, text: string) {
  const tokens = [...new Set(query.toLocaleLowerCase().split(/[\s　，。？！、]+/u).filter(Boolean))];
  return tokens.length ? tokens.filter((token) => text.toLocaleLowerCase().includes(token)).length / tokens.length : 0;
}
function Metric({ label, value }: { label: string; value: string }) { return <section className="border bg-card p-5"><p className="text-xs tracking-wider text-muted-foreground">{label}</p><p className="mt-3 font-medium">{value}</p></section>; }

