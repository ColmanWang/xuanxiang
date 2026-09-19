import Link from "next/link";
import { CitationCard } from "@/components/knowledge/citation-card";
import { RelationCard } from "@/components/knowledge/relation-card";
import { editorialStatusLabels, evidenceStatusLabels } from "@/lib/knowledge/labels";
import type { KnowledgeEntry } from "@/lib/knowledge/types";

const entityLabels = { concept: "概念", classic: "典籍", person: "人物", school: "学派", technique: "术数" };
const roots = { concept: ["知识库", "/knowledge"], classic: ["典籍", "/classics"], person: ["人物", "/people"], school: ["学派", "/schools"], technique: ["术数知识", "/techniques"] } as const;

export function KnowledgeEntryView({ entry, classicText }: { entry: KnowledgeEntry; classicText?: { witnesses: Array<{id:string;title:string;shortTitle?:string;description?:string;editorialStatus:string}>; sectionCount:number; passageCount:number } }) {
  const root = roots[entry.entityType];
  return <div className="page-shell max-w-6xl">
    <nav className="mb-8 flex flex-wrap gap-2 text-xs text-muted-foreground" aria-label="面包屑"><Link href="/">玄象</Link><span>/</span><Link href={root[1]}>{root[0]}</Link><span>/</span>{entry.entityType === "concept" ? <><span>概念</span><span>/</span></> : null}<span>{entry.title}</span></nav>
    <header className="border-b pb-10">
      <div className="flex flex-wrap items-center gap-3 text-xs tracking-wider text-muted-foreground"><span>{entityLabels[entry.entityType]}</span>{entry.period ? <span>· {entry.period}</span> : null}{entry.categories.map((item) => <span key={item} className="border px-2 py-1">{item}</span>)}</div>
      <h1 className="mt-5 font-serif text-4xl sm:text-6xl">{entry.title}</h1>
      {entry.aliases.length ? <p className="mt-3 text-sm text-muted-foreground">别名：{entry.aliases.join("、")}</p> : null}
      <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{entry.summary}</p>
      <div className="mt-7 flex flex-wrap gap-3">{entry.entityType==="classic" ? classicText?.passageCount ? <Link href={`/classics/${entry.slug}/read`} className="inline-flex h-11 items-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground">阅读原典</Link> : <span className="inline-flex h-11 items-center border px-5 text-sm text-muted-foreground">原典整理中</span> : null}{entry.toolPath ? <Link href={entry.toolPath} className="inline-flex h-11 items-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground">进入{entry.slug==="liuyao"?"六爻":"四柱"}推演</Link> : null}{entry.entityType==="technique"&&entry.slug==="sizhu-mingli"?<Link href="/tools/bazi/rules" className="inline-flex h-11 items-center border px-5 text-sm font-medium">查看排盘规则</Link>:null}{entry.entityType==="technique"&&entry.slug==="liuyao"?<Link href="/tools/liuyao/rules" className="inline-flex h-11 items-center border px-5 text-sm font-medium">查看六爻规则</Link>:null}</div>
    </header>
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <main className="space-y-12">
        <section><p className="eyebrow">Definition</p><h2 className="section-title mt-2 text-2xl">释义</h2><p className="mt-5 leading-8 text-muted-foreground">{entry.definition ?? entry.summary}</p></section>
        <section><p className="eyebrow">Lineage</p><h2 className="section-title mt-2 text-2xl">源流</h2><p className="mt-5 leading-8 text-muted-foreground">{entry.historicalContext ?? "资料待补：当前仅保留中性条目摘要，历史源流将在完成典据校订后补充。"}</p></section>
        <section><p className="eyebrow">Development</p><h2 className="section-title mt-2 text-2xl">演变</h2>{entry.development.length ? <div className="mt-5 space-y-4">{entry.development.map((item) => <div key={item.period} className="border-l pl-4"><h3>{item.period}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.summary}</p></div>)}</div> : <p className="mt-5 text-sm text-muted-foreground">分期材料正在整理。</p>}</section>
        {entry.interpretations.length ? <section><p className="eyebrow">Interpretations</p><h2 className="section-title mt-2 text-2xl">异说</h2><div className="mt-5 space-y-4">{entry.interpretations.map((item) => <article key={item.id} className="border p-5"><h3 className="font-serif text-lg">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.summary}</p><p className="research-only mt-3 text-xs text-muted-foreground">{evidenceStatusLabels[item.evidenceStatus]}{item.attribution ? ` · ${item.attribution}` : ""}</p></article>)}</div></section> : null}
      </main>
      <aside className="space-y-8">
        <section className="border-t pt-5"><div className="flex items-center justify-between"><h2 className="font-serif text-xl">玄象关系</h2><Link href={`/graph?node=${entry.graphNodeId}`} className="text-xs underline-offset-4 hover:underline">在图谱中查看</Link></div><div className="mt-3">{entry.relatedEntities.length ? entry.relatedEntities.map((item) => <RelationCard key={item.id} relation={item} subject={entry.title} />) : <p className="text-sm text-muted-foreground">关系正在整理。</p>}</div></section>
        <section className="border-t pt-5"><h2 className="font-serif text-xl">典据</h2><div className="mt-4 space-y-3">{entry.references.length ? entry.references.map((item) => <CitationCard key={item.id} reference={item} />) : <p className="text-sm text-muted-foreground">典据待补，不以未核材料填充。</p>}</div></section>
        {entry.entityType==="classic"&&classicText?<section className="border-t pt-5"><h2 className="font-serif text-xl">版本与文本</h2><p className="mt-3 text-sm text-muted-foreground">{classicText.witnesses.length} 个版本记录 · {classicText.sectionCount} 个已整理篇章 · {classicText.passageCount} 条文句</p><div className="mt-4 flex flex-col gap-3">{classicText.witnesses.map(w=><article key={w.id} className="border p-3"><p className="text-sm">{w.shortTitle??w.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{w.description??"整理说明待补"}</p></article>)}</div></section>:null}
        <section className="research-only border-t pt-5 text-sm text-muted-foreground"><h2 className="font-serif text-xl text-foreground">编辑记录</h2><dl className="mt-4 space-y-2"><div className="flex justify-between gap-4"><dt>资料状态</dt><dd>{editorialStatusLabels[entry.editorialStatus]}</dd></div><div className="flex justify-between gap-4"><dt>最后校订</dt><dd>{entry.lastReviewedAt ? entry.lastReviewedAt.toISOString().slice(0,10) : "待校订"}</dd></div></dl></section>
      </aside>
    </div>
  </div>;
}
