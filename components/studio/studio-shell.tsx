import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpenText, Bot, Boxes, CircleGauge, FileCheck2, GitBranch, Library, Link2, Network, ScrollText, ShieldCheck } from "lucide-react";

const navigation = [
  { href: "/studio", label: "总览", icon: CircleGauge },
  { href: "/studio/entries", label: "知识条目", icon: Boxes },
  { href: "/studio/relations", label: "关系", icon: GitBranch },
  { href: "/studio/sources", label: "资料来源", icon: Library },
  { href: "/studio/citations", label: "典据", icon: Link2 },
  { href: "/studio/classics", label: "典籍文本", icon: BookOpenText },
  { href: "/studio/interpretations", label: "异说", icon: FileCheck2 },
  { href: "/studio/review", label: "校订队列", icon: FileCheck2 },
  { href: "/studio/validation", label: "完整性检查", icon: ShieldCheck },
  { href: "/studio/rules", label: "规则典据", icon: Network },
  { href: "/studio/proposals", label: "AI 候选提议", icon: Bot },
  { href: "/studio/audit", label: "操作审计", icon: ScrollText },
];

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),hsl(var(--border))_calc(100%-1px))] bg-[size:4rem_100%]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="min-w-0 border-b bg-background/95 px-5 py-5 lg:min-h-[calc(100vh-8rem)] lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div><p className="text-[.68rem] tracking-[.18em] text-muted-foreground">INTERNAL WORKSPACE</p><h1 className="mt-2 font-serif text-2xl">玄象 · 编辑台</h1></div>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">返回前台</Link>
          </div>
          <nav className="mt-5 flex gap-1 overflow-x-auto pb-1 lg:mt-8 lg:flex-col" aria-label="编辑台导航">
            {navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex shrink-0 items-center gap-2 border border-transparent px-3 py-2.5 text-sm text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground"><Icon className="size-4" aria-hidden="true" />{label}</Link>)}
          </nav>
          <div className="mt-8 hidden border-t pt-5 text-xs leading-6 text-muted-foreground lg:block"><ScrollText className="mb-2 size-4"/><p>编辑的是结构化知识资产。算法规则只能查看典据，不可在此修改执行逻辑。</p></div>
        </aside>
        <div className="min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
