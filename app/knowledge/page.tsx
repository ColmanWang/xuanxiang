import type { Metadata } from "next";
import { KnowledgeBrowser } from "@/components/knowledge/knowledge-browser";
import { concepts } from "@/data/concepts";

export const metadata: Metadata = {
  title: "知识库",
  description: "检索中国传统思想中的核心概念、历史来源与知识关联。",
};

export default function KnowledgePage() {
  return (
    <div className="page-shell max-w-6xl">
      <header className="grid gap-7 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
        <div>
          <h1 className="section-title">知识库</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            从基本范畴出发，理解概念的定义、演变，以及它们与人物、典籍和术数方法的联系。
          </p>
        </div>
        <p className="tabular border-t pt-4 text-sm text-muted-foreground lg:border-t-0 lg:border-l lg:pl-6">
          当前收录 {concepts.length} 个概念条目
        </p>
      </header>
      <div className="pt-10">
        <KnowledgeBrowser />
      </div>
    </div>
  );
}
