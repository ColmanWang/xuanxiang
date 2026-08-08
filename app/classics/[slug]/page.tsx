import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResearchPanel } from "@/components/research/research-panel";
import { classics } from "@/data/classics";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return classics.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = classics.find((item) => item.slug === slug);
  return book
    ? { title: book.title, description: book.summary }
    : { title: "书目未找到" };
}

function Field({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.12em] text-muted-foreground">{title}</dt>
      <dd className="mt-2 leading-7">{value}</dd>
    </div>
  );
}

export default async function ClassicDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = classics.find((item) => item.slug === slug);
  if (!book) notFound();

  return (
    <div className="page-shell max-w-5xl">
      <Link
        href="/classics"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:underline-offset-4"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> 返回典籍
      </Link>

      <article>
        <header className="mt-10 grid gap-9 border-b pb-12 md:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
          <div className="flex aspect-[3/4] flex-col justify-between border bg-secondary p-6" aria-hidden="true">
            <span className="text-xs tracking-[0.16em] text-muted-foreground">玄象书目</span>
            <span className="font-serif text-3xl leading-snug">{book.title}</span>
            <span className="h-px w-10 bg-accent" />
          </div>
          <div className="self-end">
            <p className="text-sm text-primary">{book.category}</p>
            <h1 className="section-title mt-3">{book.title}</h1>
            <p className="mt-5 text-sm text-muted-foreground">
              {book.dynasty} · {book.author}
            </p>
            <p className="mt-7 max-w-3xl text-lg leading-9">{book.summary}</p>
          </div>
        </header>

        <section className="py-12">
          <h2 className="font-serif text-2xl">文献地位</h2>
          <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">{book.status}</p>
        </section>

        <section className="border-t py-9">
          <h2 className="font-serif text-2xl">内容索引</h2>
          <ul className="mt-5 grid border-y sm:grid-cols-3 sm:divide-x">
            {book.contents.map((item) => (
              <li key={item} className="border-b px-4 py-4 text-sm last:border-b-0 sm:border-b-0">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <ResearchPanel title="书目研究索引">
          <dl className="grid gap-x-10 gap-y-7 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Field title="出处" value="玄象书目摘要；具体版本与校勘依据待补" />
            <Field title="时代" value={book.dynasty} />
            <Field title="典籍" value={book.title} />
            <Field title="人物" value={book.people.join("、")} />
            <Field title="学派或传统" value={book.category} />
            <Field title="相关概念" value={book.concepts.join("、")} />
            <Field title="相关方法" value={book.techniques.join("、")} />
          </dl>
        </ResearchPanel>
      </article>
    </div>
  );
}
