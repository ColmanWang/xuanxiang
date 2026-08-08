import type { Metadata } from "next";
import { ResearchPanel } from "@/components/research/research-panel";
import { schools } from "@/data/schools";

export const metadata: Metadata = {
  title: "学派谱系",
  description: "追踪中国传统思想中的学说、传承、人物、典籍与概念关系。",
};

export default function SchoolsPage() {
  return (
    <div className="page-shell max-w-6xl">
      <header className="border-b pb-12">
        <h1 className="section-title">学派谱系</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          学派不是彼此封闭的标签。这份索引以概念、人物与典籍为线索，呈现各种诠释传统的形成与交流。
        </p>
      </header>

      <ol className="border-b">
        {schools.map((school, index) => (
          <li key={school.name} className="border-t first:border-t-0">
            <article className="grid gap-6 py-9 md:grid-cols-[5rem_14rem_minmax(0,1fr)] md:gap-8">
              <span className="tabular text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <header>
                <h2 className="font-serif text-2xl leading-tight">{school.name}</h2>
                <p className="mt-3 text-xs leading-5 text-primary">{school.era}</p>
              </header>
              <div>
                <p className="max-w-3xl leading-8 text-muted-foreground">{school.summary}</p>
                <ResearchPanel title="学派关系">
                  <dl className="grid gap-x-8 gap-y-6 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">出处</dt><dd className="mt-1 leading-7">{school.sources.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">人物</dt><dd className="mt-1 leading-7">{school.people.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">经典</dt><dd className="mt-1 leading-7">{school.classics.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">相关概念</dt><dd className="mt-1 leading-7">{school.concepts.join("、")}</dd></div>
                  </dl>
                </ResearchPanel>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
