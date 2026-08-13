import {
  ArrowRight,
  BookOpenText,
  Braces,
  GitBranch,
  Landmark,
  Orbit,
} from "lucide-react";
import Link from "next/link";
import { HeroKnowledgeMap } from "@/components/home/hero-knowledge-map";
import { KnowledgeNetworkPreview } from "@/components/home/knowledge-network-preview";
import { ButtonLink } from "@/components/ui/button";
import { classics } from "@/data/classics";
import { concepts } from "@/data/concepts";
import { knowledgeSystems } from "@/data/systems";
import { thoughtEvolution } from "@/data/timeline";
import { deductionSystems } from "@/data/tools";
import { getPreviewGraph } from "@/lib/services/graph-service";

const featuredSystems = knowledgeSystems.filter((system) =>
  ["yixue", "yinyang-wuxing", "daoist-thought", "mingli", "fengshui", "physiognomy"].includes(system.slug),
);

function SectionLead({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid gap-5 border-t pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,31rem)] lg:items-end">
      <h2 className="section-title">{title}</h2>
      <p className="max-w-xl leading-8 text-muted-foreground lg:justify-self-end">{description}</p>
    </div>
  );
}

export default async function Home() {
  const previewGraph = await getPreviewGraph();
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="page-shell grid min-h-[calc(100svh-5rem)] items-center gap-14 py-16 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-9 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px w-9 bg-accent" />
              中国传统思想 · 数字知识库
            </div>
            <h1 className="font-serif text-[clamp(5rem,13vw,10rem)] font-medium leading-[.82] tracking-[.08em] text-ink">
              玄象
            </h1>
            <p className="mt-10 max-w-xl font-serif text-xl leading-9 sm:text-2xl">
              探索易学、术数、道家思想与中国传统宇宙观
            </p>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              从《周易》的象数体系，到魏晋玄学的思想探索，再到命理、堪舆与传统术数，构建中国传统认知体系的数字化图谱。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/knowledge">
                进入知识库 <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/graph" variant="outline">
                探索玄象图谱
              </ButtonLink>
            </div>
          </div>
          <HeroKnowledgeMap />
        </div>
        <div className="border-t bg-card/65">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 text-xs text-muted-foreground lg:px-8">
            <span className="text-foreground">知识对象</span>
            {['概念', '典籍', '人物', '学派', '术数', '时代'].map((item) => (
              <span key={item} className="before:mr-3 before:text-accent before:content-['＋']">{item}</span>
            ))}
            <span className="ml-auto hidden tabular md:block">STRUCTURED · TRACEABLE · CONNECTED</span>
          </div>
        </div>
      </section>

      <section className="page-shell" id="systems">
        <SectionLead
          title="玄象体系"
          description="不是孤立的术语目录，而是从起源、经典与关联路径进入每一套传统认知模型。"
        />
        <div className="mt-14 border-y">
          <div className="hidden grid-cols-[1.1fr_1.5fr_1.4fr_1.25fr] border-b bg-muted/60 px-5 py-3 text-xs text-muted-foreground lg:grid">
            <span>体系 / 起源</span><span>核心概念</span><span>代表典籍</span><span>关联体系</span>
          </div>
          {featuredSystems.map((system) => (
            <Link
              href="/systems"
              key={system.slug}
              className="group grid gap-5 border-b px-5 py-7 transition-colors last:border-b-0 hover:bg-card lg:grid-cols-[1.1fr_1.5fr_1.4fr_1.25fr] lg:items-center"
            >
              <div>
                <h3 className="font-serif text-2xl group-hover:text-primary">{system.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{system.origin}</p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground lg:text-foreground">{system.concepts.join(" · ")}</p>
              <p className="text-sm leading-7 text-muted-foreground">{system.classics.join(" · ")}</p>
              <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <span>{system.relatedSystems.slice(0, 2).join(" · ")}</span>
                <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="page-shell">
          <div className="grid gap-5 border-t border-ink-rule pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,31rem)] lg:items-end">
            <h2 className="section-title">中国传统宇宙观演化图</h2>
            <p className="max-w-xl leading-8 text-ink-muted lg:justify-self-end">
              观察解释世界的语言如何从观象、感应与本体论，走向体系集成与数字人文研究。
            </p>
          </div>
          <div className="mt-14 overflow-x-auto pb-3">
            <div className="relative grid min-w-[66rem] grid-cols-7 border-y border-ink-rule before:absolute before:left-[7%] before:right-[7%] before:top-[4.4rem] before:h-px before:bg-ink-rule">
              {thoughtEvolution.map((period, index) => (
                <Link
                  href="/timeline"
                  key={period.period}
                  className="group relative min-h-[24rem] border-r border-ink-rule px-5 py-6 last:border-r-0 hover:bg-white/[.035]"
                >
                  <p className="tabular text-xs text-ink-muted">{period.range}</p>
                  <span className="mt-6 block size-3 border border-ink-muted bg-ink transition-colors group-hover:bg-accent" />
                  <h3 className="mt-8 font-serif text-2xl">{period.period}</h3>
                  <p className="mt-5 text-sm leading-7 text-ink-muted">{period.thesis}</p>
                  <ul className="mt-6 space-y-2 text-xs text-ink-muted/80">
                    {period.ideas.map((idea) => <li key={idea}>— {idea}</li>)}
                  </ul>
                  <span className="absolute bottom-5 right-5 text-xs text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/timeline" className="mt-7 inline-flex items-center gap-2 text-sm text-ink-foreground hover:text-white">
            阅读完整演化脉络 <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="page-shell">
        <SectionLead
          title="象之网络"
          description="思想不是孤立的条目，而是在时代中彼此连接、解释与演化。"
        />
        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_18rem]">
          <KnowledgeNetworkPreview nodes={previewGraph.nodes} edges={previewGraph.edges} />
          <aside className="flex flex-col border-t pt-6 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
            <GitBranch className="size-8 text-accent" strokeWidth={1.4} aria-hidden="true" />
            <h3 className="mt-7 font-serif text-3xl">探索概念之间的关联</h3>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              以《周易》为中心，沿着阴阳、八卦、象数、人物与术数的直接关系，进入可追溯的思想脉络。
            </p>
            <dl className="mt-8 space-y-4 border-y py-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">节点类型</dt><dd>6 类</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">关系语义</dt><dd>9 种</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">当前版本</dt><dd>图谱 1.0</dd></div>
            </dl>
            <ButtonLink href="/graph" className="mt-auto translate-y-0 xl:mt-8">
              进入玄象图谱 <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </aside>
        </div>
      </section>

      <section className="border-y bg-card/80">
        <div className="page-shell">
          <SectionLead
            title="知识库索引"
            description="从核心概念进入简明解释；切换研究模式后，可继续查看出处、时代、人物、典籍与关联对象。"
          />
          <div className="mt-12 grid border-y sm:grid-cols-2 lg:grid-cols-4">
            {concepts.slice(0, 12).map((concept, index) => (
              <Link
                key={concept.slug}
                href={`/knowledge/${concept.slug}`}
                className="group flex min-h-36 flex-col border-b p-5 transition-colors hover:bg-background sm:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <span className="tabular text-xs text-muted-foreground">C-{String(index + 1).padStart(3, "0")}</span>
                <h3 className="mt-auto flex items-end justify-between gap-3 pt-8 font-serif text-2xl">
                  {concept.name}<ArrowRight className="size-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                </h3>
                <p className="research-only mt-3 text-xs text-muted-foreground">{concept.system} · {concept.era}</p>
              </Link>
            ))}
          </div>
          <Link href="/knowledge" className="mt-7 inline-flex items-center gap-2 text-sm text-primary">
            查看完整知识库 <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="page-shell">
        <SectionLead
          title="典籍索引"
          description="以书目摘要和历史地位为入口，连接经典、人物、概念与方法；MVP 暂不收录全文。"
        />
        <div className="mt-12 divide-y border-y">
          {classics.slice(0, 5).map((book, index) => (
            <Link
              href={`/classics/${book.slug}`}
              key={book.slug}
              className="group grid gap-3 py-6 transition-colors hover:bg-card sm:grid-cols-[5rem_1fr_1fr_2fr_1.5rem] sm:items-center sm:px-5"
            >
              <span className="tabular text-xs text-muted-foreground">B-{String(index + 1).padStart(3, "0")}</span>
              <h3 className="font-serif text-xl">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.dynasty} · {book.author}</p>
              <p className="text-sm leading-6 text-muted-foreground">{book.summary}</p>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/55">
        <div className="page-shell">
          <SectionLead
            title="推演系统"
            description="程序负责计算，解释层负责说明。确定性规则、历法边界与中间结果都将保持可复核。"
          />
          <div className="mt-12 grid gap-px border bg-border md:grid-cols-5">
            {deductionSystems.map((system) => {
              const available = system.status === "available";
              return available ? (
                <Link
                  href={`/tools/${system.slug}`}
                  key={system.slug}
                  className="group flex min-h-64 flex-col bg-background p-6 hover:bg-card"
                >
                  <Braces className="size-6 text-accent" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mt-9 font-serif text-2xl">{system.name}</h3>
                  <p className="mt-3 text-xs text-muted-foreground">{system.basis}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-primary">
                    进入推演 <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              ) : (
                <article key={system.slug} className="flex min-h-64 flex-col bg-background p-6 text-muted-foreground">
                  <Orbit className="size-6" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mt-9 font-serif text-2xl text-foreground">{system.name}</h3>
                  <p className="mt-3 text-xs">{system.basis}</p>
                  <span className="mt-auto pt-8 text-xs">开发中</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="page-shell grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <h2 className="section-title">关于玄象</h2>
            <p className="mt-8 max-w-3xl font-serif text-xl leading-9 text-primary-foreground/85">
              玄象是一个探索中国传统思想体系的平台。
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-primary-foreground/70">
              我们通过数字化方式连接经典、人物、概念与术数体系，呈现中国传统文化中的宇宙观、自然观与认知方式。
            </p>
          </div>
          <div className="grid grid-cols-3 border-y border-primary-foreground/25 py-6 text-center text-xs text-primary-foreground/70 lg:text-left">
            <div><BookOpenText className="mx-auto mb-3 size-5 lg:mx-0" aria-hidden="true" />数字典藏</div>
            <div><Landmark className="mx-auto mb-3 size-5 lg:mx-0" aria-hidden="true" />思想脉络</div>
            <div><GitBranch className="mx-auto mb-3 size-5 lg:mx-0" aria-hidden="true" />关系图谱</div>
          </div>
        </div>
      </section>
    </>
  );
}
