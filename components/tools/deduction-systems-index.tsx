import { ArrowRight, Braces, Construction, GitBranch } from "lucide-react";
import Link from "next/link";
import { deductionSystems } from "@/data/tools";

export function DeductionSystemsIndex() {
  return (
    <div className="page-shell">
      <header className="grid gap-8 border-b pb-12 lg:grid-cols-[1fr_28rem] lg:items-end">
        <div>
          <div className="mb-7 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px w-9 bg-accent" />规则、历法与结构化结果</div>
          <h1 className="section-title text-4xl sm:text-5xl">推演系统</h1>
        </div>
        <p className="leading-8 text-muted-foreground">程序负责计算，解释层负责说明。每套系统都将公开规则边界、中间步骤与输入依据，语言模型不直接计算结果。</p>
      </header>
      <div className="mt-14 border-y">
        <div className="hidden grid-cols-[5rem_1fr_1.4fr_1fr_8rem] border-b bg-muted/60 px-5 py-3 text-xs text-muted-foreground md:grid"><span>编号</span><span>系统</span><span>计算基础</span><span>状态</span><span>入口</span></div>
        {deductionSystems.map((system, index) => {
          const available = system.status === "available";
          const content = <><span className="tabular text-xs text-muted-foreground">D-{String(index + 1).padStart(3, "0")}</span><div><h2 className="font-serif text-2xl">{system.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground md:hidden">{system.description}</p></div><div><p className="text-sm text-foreground">{system.basis}</p><p className="mt-2 hidden text-sm leading-6 text-muted-foreground md:block">{system.description}</p></div><span className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground">{available ? <Braces className="size-4 text-accent" aria-hidden="true" /> : <Construction className="size-4" aria-hidden="true" />}{available ? "引擎可用" : "开发中"}</span><span className="inline-flex items-center gap-2 text-sm text-primary">{available ? "进入推演" : "查看规划"}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></>;
          return available ? <Link href={`/tools/${system.slug}`} key={system.slug} className="group grid gap-5 border-b px-5 py-7 transition-colors last:border-b-0 hover:bg-card md:grid-cols-[5rem_1fr_1.4fr_1fr_8rem] md:items-center">{content}</Link> : <article key={system.slug} className="group grid gap-5 border-b px-5 py-7 opacity-75 last:border-b-0 md:grid-cols-[5rem_1fr_1.4fr_1fr_8rem] md:items-center">{content}</article>;
        })}
      </div>
      <aside className="mt-12 grid gap-5 border-l-2 border-accent bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-start"><GitBranch className="size-6 text-accent" strokeWidth={1.5} aria-hidden="true" /><div><h2 className="font-serif text-xl">计算层与解释层分离</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">四柱推演已接入确定性历法内核；输入、规则、计算过程与输出均不依赖页面组件，也不调用语言模型。其他推演系统仍在建设中。</p></div></aside>
    </div>
  );
}
