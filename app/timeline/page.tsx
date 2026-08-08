import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { thoughtEvolution } from "@/data/timeline";

export const metadata: Metadata = {
  title: "中国传统宇宙观演化图",
  description: "以七个时期观察中国传统宇宙观如何积累、分化与重释。",
};

export default function TimelinePage() {
  return (
    <div>
      <header className="page-shell max-w-6xl pb-12 lg:pb-16">
        <h1 className="section-title">中国传统宇宙观演化图</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          从观象、阴阳五行到理气之辨与数字人文，这里记录的不是一条单线进步史，而是多种解释世界的方法如何不断叠合。
        </p>
      </header>

      <section className="border-y bg-ink text-ink-foreground" aria-label="宇宙观演化阶段">
        <ol className="mx-auto max-w-6xl px-5 lg:px-8">
          {thoughtEvolution.map((stage, index) => (
            <li
              key={stage.period}
              className="relative grid gap-5 border-b border-ink-rule py-10 last:border-b-0 md:grid-cols-[8rem_11rem_minmax(0,1fr)] md:gap-8 lg:py-12"
            >
              <div className="flex items-center gap-3 md:block">
                <span className="tabular text-xs text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                <p className="tabular text-sm text-ink-muted md:mt-3">{stage.range}</p>
              </div>
              <h2 className="font-serif text-3xl leading-tight">{stage.period}</h2>
              <div>
                <h3 className="max-w-2xl font-serif text-xl leading-8 sm:text-2xl">{stage.thesis}</h3>
                <p className="mt-4 max-w-3xl leading-8 text-ink-muted">{stage.summary}</p>
                <ResearchPanel title="概念线索">
                  <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                    {stage.ideas.map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                </ResearchPanel>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="page-shell max-w-6xl py-10 lg:py-12">
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="继续探索">
          <Link href="/systems" className="inline-flex items-center gap-2 text-primary hover:underline hover:underline-offset-4">
            返回体系 <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <Link href="/classics" className="inline-flex items-center gap-2 text-primary hover:underline hover:underline-offset-4">
            查阅典籍 <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
