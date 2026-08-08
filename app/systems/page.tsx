import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { knowledgeSystems } from "@/data/systems";

export const metadata: Metadata = {
  title: "体系",
  description: "从思想范畴、历史源流与核心典籍理解中国传统知识体系。",
};

export default function SystemsPage() {
  return (
    <div className="page-shell max-w-6xl">
      <header className="grid gap-7 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div>
          <h1 className="section-title">知识体系</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            玄象将思想、时间、空间与象数传统置于同一索引中，呈现它们的起源、核心范畴与交叉关系。
          </p>
        </div>
        <p className="border-t pt-4 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pl-6">
          普通浏览用于快速建立坐标；切换至研究模式，可查看经典与相关体系。
        </p>
      </header>

      <div className="border-b">
        {knowledgeSystems.map((system) => (
          <article
            id={system.slug}
            key={system.slug}
            className="grid scroll-mt-24 gap-7 border-t py-9 first:border-t-0 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10"
          >
            <header>
              <h2 className="font-serif text-2xl leading-tight sm:text-3xl">{system.name}</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{system.auxiliary}</p>
            </header>
            <div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_13rem]">
                <p className="max-w-3xl text-base leading-8">{system.summary}</p>
                <dl className="border-t pt-4 text-sm lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
                  <dt className="text-xs tracking-[0.14em] text-muted-foreground">源流</dt>
                  <dd className="mt-2 leading-6">{system.origin}</dd>
                </dl>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label={`${system.name}核心概念`}>
                {system.concepts.map((concept) => (
                  <li key={concept} className="text-sm text-primary">
                    {concept}
                  </li>
                ))}
              </ul>

              <ResearchPanel title="文献与关系">
                <div className="grid gap-6 text-sm sm:grid-cols-2">
                  <section>
                    <h3 className="font-medium">核心经典</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">
                      {system.classics.join("、")}
                    </p>
                  </section>
                  <section>
                    <h3 className="font-medium">相关体系</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">
                      {system.relatedSystems.join("、")}
                    </p>
                  </section>
                </div>
              </ResearchPanel>
            </div>
          </article>
        ))}
      </div>

      <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="继续探索">
        <Link href="/timeline" className="inline-flex items-center gap-2 text-primary hover:underline hover:underline-offset-4">
          查看演化 <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
        <Link href="/knowledge" className="inline-flex items-center gap-2 text-primary hover:underline hover:underline-offset-4">
          进入知识库 <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </nav>
    </div>
  );
}
