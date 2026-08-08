import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { classics } from "@/data/classics";

export const metadata: Metadata = {
  title: "典籍",
  description: "查阅典籍书目摘要、成书时代、作者归属与知识关联。",
};

export default function ClassicsPage() {
  return (
    <div className="page-shell max-w-6xl">
      <header className="grid gap-7 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <h1 className="section-title">典籍</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            从书目、作者与概念关系入手，建立可追溯的阅读路径。当前收录摘要与关联资料，不提供全文。
          </p>
        </div>
        <p className="tabular border-t pt-4 text-sm text-muted-foreground lg:border-t-0 lg:border-l lg:pl-6">
          当前书目 {classics.length} 种
        </p>
      </header>

      <ol className="border-b">
        {classics.map((book, index) => (
          <li key={book.slug} className="border-t first:border-t-0">
            <article className="grid gap-6 py-8 md:grid-cols-[5rem_minmax(0,1fr)_12rem] md:gap-8">
              <p className="tabular text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl">{book.title}</h2>
                  <span className="text-xs text-primary">{book.category}</span>
                </div>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{book.summary}</p>
                <ResearchPanel title="书目关系">
                  <dl className="grid gap-5 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-muted-foreground">人物</dt>
                      <dd className="mt-1">{book.people.join("、")}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">概念</dt>
                      <dd className="mt-1">{book.concepts.join("、")}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">所属传统</dt>
                      <dd className="mt-1">{book.techniques.join("、")}</dd>
                    </div>
                  </dl>
                </ResearchPanel>
              </div>
              <div className="md:text-right">
                <p className="text-sm leading-6 text-muted-foreground">
                  {book.dynasty}
                  <br />
                  {book.author}
                </p>
                <Link
                  href={`/classics/${book.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline hover:underline-offset-4"
                  aria-label={`查看${book.title}书目详情`}
                >
                  查看 <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
