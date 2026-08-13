"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { Input } from "@/components/ui/input";

export interface ConceptBrowserItem { name: string; slug: string; aliases: string[]; system: string; era: string; summary: string }

export function KnowledgeBrowser({ concepts }: { concepts: ConceptBrowserItem[] }) {
  const categories = ["全部", ...new Set(concepts.map((concept) => concept.system))];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const shown = useMemo(
    () =>
      concepts.filter((concept) => {
        const inCategory = category === "全部" || concept.system === category;
        const searchable = [
          concept.name,
          ...concept.aliases,
          concept.system,
          concept.era,
          concept.summary,
        ]
          .join(" ")
          .toLocaleLowerCase("zh-CN");
        return inCategory && searchable.includes(normalizedQuery);
      }),
    [category, concepts, normalizedQuery],
  );

  return (
    <section aria-label="概念检索">
      <div className="grid gap-5 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)] lg:items-start">
        <label className="relative block">
          <span className="sr-only">搜索概念</span>
          <Search aria-hidden="true" className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
          <Input
            className="h-11 rounded-sm border-foreground/25 bg-transparent pl-10"
            placeholder="搜索名称、别名或时代"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="按体系筛选">
          {categories.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(item)}
                className={
                  active
                    ? "min-h-10 rounded-sm bg-foreground px-4 py-2 text-sm text-background"
                    : "min-h-10 rounded-sm border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <p className="tabular mt-8 text-sm text-muted-foreground" aria-live="polite">
        找到 {shown.length} 个条目
      </p>

      {shown.length > 0 ? (
        <ul className="mt-3 border-y">
          {shown.map((concept) => (
            <li key={concept.slug} className="border-b last:border-b-0">
              <article className="grid gap-5 py-7 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-start">
                <div>
                  <h2 className="font-serif text-2xl">{concept.name}</h2>
                  <p className="mt-2 text-xs text-primary">{concept.system}</p>
                </div>
                <div>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{concept.summary}</p>
                  <ResearchPanel title="条目摘要">
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">时代</dt>
                        <dd className="mt-1">{concept.era}</dd>
                      </div>
                      <div><dt className="text-muted-foreground">编辑说明</dt><dd className="mt-1">完整关系与典据请进入条目查看</dd></div>
                    </dl>
                  </ResearchPanel>
                </div>
                <Link
                  href={`/knowledge/${concept.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:underline-offset-4"
                  aria-label={`查看${concept.name}条目`}
                >
                  查看 <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 border-y py-14 text-center">
          <p className="font-serif text-xl">暂未找到匹配条目</p>
          <p className="mt-2 text-sm text-muted-foreground">请尝试更短的关键词，或切换至“全部”体系。</p>
        </div>
      )}
    </section>
  );
}
