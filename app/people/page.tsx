import type { Metadata } from "next";
import { ResearchPanel } from "@/components/research/research-panel";
import { people } from "@/data/people";

export const metadata: Metadata = {
  title: "人物索引",
  description: "查看中国传统思想史中的人物、著述、学派与概念关系。",
};

export default function PeoplePage() {
  return (
    <div className="page-shell max-w-6xl">
      <header className="border-b pb-12">
        <h1 className="section-title">人物索引</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          沿着著述、注释与思想命题，辨认传统知识如何由不同时代的人物接续与改写。
        </p>
      </header>

      <ol className="border-b">
        {people.map((person, index) => (
          <li key={person.name} className="border-t first:border-t-0">
            <article className="grid gap-6 py-9 md:grid-cols-[5rem_12rem_minmax(0,1fr)] md:gap-8">
              <span className="tabular text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <header>
                <h2 className="font-serif text-3xl">{person.name}</h2>
                <p className="mt-2 text-sm text-primary">{person.era}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{person.role}</p>
              </header>
              <div>
                <p className="max-w-3xl leading-8 text-muted-foreground">{person.summary}</p>
                <ResearchPanel title="人物关系">
                  <dl className="grid gap-x-8 gap-y-6 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">出处</dt><dd className="mt-1 leading-7">{person.sources.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">经典与著述</dt><dd className="mt-1 leading-7">{person.classics.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">学派</dt><dd className="mt-1 leading-7">{person.schools.join("、")}</dd></div>
                    <div><dt className="text-muted-foreground">相关概念</dt><dd className="mt-1 leading-7">{person.concepts.join("、")}</dd></div>
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
