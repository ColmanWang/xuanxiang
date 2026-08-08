import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { concepts } from "@/data/concepts";

type Props = { params: Promise<{ slug: string }> };

const schoolsBySystem: Record<string, string[]> = {
  易学: ["象数易学", "义理易学"],
  阴阳五行: ["阴阳家", "汉易象数传统"],
  命理学: ["子平命理"],
};

export function generateStaticParams() {
  return concepts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = concepts.find((item) => item.slug === slug);
  return concept
    ? { title: concept.name, description: concept.summary }
    : { title: "条目未找到" };
}

function ResearchField({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.12em] text-muted-foreground">{title}</dt>
      <dd className="mt-2 leading-7">{items.length > 0 ? items.join("、") : "暂无记录"}</dd>
    </div>
  );
}

export default async function KnowledgeDetailPage({ params }: Props) {
  const { slug } = await params;
  const concept = concepts.find((item) => item.slug === slug);
  if (!concept) notFound();

  const relatedEntries = concept.related.map((name) => ({
    name,
    slug: concepts.find((item) => item.name === name)?.slug,
  }));

  return (
    <div className="page-shell max-w-5xl">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:underline-offset-4"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> 返回知识库
      </Link>

      <article>
        <header className="mt-10 grid gap-8 border-b pb-12 md:grid-cols-[minmax(0,1fr)_13rem] md:items-end">
          <div>
            <h1 className="section-title">{concept.name}</h1>
            {concept.aliases.length > 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">亦称 {concept.aliases.join("、")}</p>
            ) : null}
            <p className="mt-6 max-w-3xl text-lg leading-9">{concept.summary}</p>
          </div>
          <dl className="border-t pt-4 text-sm md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <dt className="text-xs tracking-[0.12em] text-muted-foreground">所属体系</dt>
            <dd className="mt-2">{concept.system}</dd>
            <dt className="mt-5 text-xs tracking-[0.12em] text-muted-foreground">形成时代</dt>
            <dd className="mt-2">{concept.era}</dd>
          </dl>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,.8fr)]">
          <section>
            <h2 className="font-serif text-2xl">概念要点</h2>
            <ul className="mt-5 border-y">
              {concept.core.map((item) => (
                <li key={item} className="border-b py-4 leading-7 last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl">历史演变</h2>
            <p className="mt-5 leading-8 text-muted-foreground">{concept.history}</p>
          </section>
        </div>

        <section className="border-t py-9">
          <h2 className="font-serif text-2xl">相关概念</h2>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {relatedEntries.map((item) => (
              <li key={item.name}>
                {item.slug ? (
                  <Link
                    href={`/knowledge/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline hover:underline-offset-4"
                  >
                    {item.name} <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </Link>
                ) : (
                  <span className="text-sm">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <ResearchPanel title="条目研究索引">
          <dl className="grid gap-x-10 gap-y-7 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <ResearchField title="出处" items={concept.references} />
            <ResearchField title="时代" items={[concept.era]} />
            <ResearchField title="经典" items={concept.classics} />
            <ResearchField title="人物" items={concept.people} />
            <ResearchField title="学派" items={schoolsBySystem[concept.system] ?? [concept.system]} />
            <ResearchField title="相关概念" items={concept.related} />
            <ResearchField title="相关方法" items={concept.techniques} />
          </dl>
        </ResearchPanel>
      </article>
    </div>
  );
}
