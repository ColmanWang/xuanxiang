import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StudioEntryRow, StudioGap, StudioStat } from "./types";

const statusLabels = { DRAFT: "草稿", BASIC: "基础", SOURCED: "已有典据", REVIEWED: "已校订" } as const;

export function StudioPageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="flex flex-col gap-5 border-b pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-[.68rem] tracking-[.18em] text-muted-foreground">{eyebrow ?? "EDITORIAL WORKSPACE"}</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p></div>{action}</header>;
}

export function StudioStats({ items }: { items: StudioStat[] }) {
  return <div className="grid gap-px border bg-border sm:grid-cols-2 xl:grid-cols-5">{items.map(item=><Link key={item.label} href={item.href} className="bg-card p-5 transition hover:bg-muted/70"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-2 font-mono text-2xl">{item.value}</p></Link>)}</div>;
}

export function EntryTable({ entries }: { entries: StudioEntryRow[] }) {
  if (!entries.length) return <EmptyState title="没有匹配条目" detail="调整筛选，或建立一个新的草稿条目。"/>;
  return <div className="overflow-x-auto border bg-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-muted/40 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">条目</th><th className="px-4 py-3 font-medium">类型</th><th className="px-4 py-3 font-medium">状态</th><th className="px-4 py-3 font-medium">最后修改</th></tr></thead><tbody className="divide-y">{entries.map(entry=><tr key={`${entry.type}:${entry.id}`} className="hover:bg-muted/30"><td className="px-4 py-4"><Link href={`/studio/entries/${entry.type}/${entry.id}`} className="font-medium hover:text-primary">{entry.title}</Link><p className="mt-1 max-w-xl truncate text-xs text-muted-foreground">/{entry.slug} · {entry.summary}</p></td><td className="px-4 py-4 uppercase text-muted-foreground">{entry.type}</td><td className="px-4 py-4"><Badge>{statusLabels[entry.editorialStatus]}</Badge></td><td className="px-4 py-4 font-mono text-xs text-muted-foreground">{entry.updatedAt.slice(0,10)}</td></tr>)}</tbody></table></div>;
}

export function GapList({ gaps }: { gaps: StudioGap[] }) {
  return <div className="divide-y border bg-card">{gaps.length ? gaps.map(gap=><Link key={gap.id} href={gap.href} className="grid gap-2 p-4 hover:bg-muted/30 sm:grid-cols-[7rem_13rem_1fr]"><Badge className={gap.level==="ERROR"?"border-destructive/40 text-destructive":""}>{gap.level}</Badge><strong className="text-sm font-medium">{gap.label}</strong><p className="text-sm leading-6 text-muted-foreground">{gap.detail}</p></Link>) : <EmptyState title="没有待处理缺口" detail="当前筛选范围内未发现内容完整性问题。"/>}</div>;
}

export function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="border border-dashed bg-card/60 px-6 py-12 text-center"><h3 className="font-serif text-xl">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{detail}</p></div>; }

export function StatusPill({ status }: { status: "PASS"|"WARNING"|"ERROR" }) { return <span className={cn("inline-flex w-fit border px-2 py-1 font-mono text-[.68rem]", status==="PASS"&&"border-emerald-800/30 text-emerald-800 dark:text-emerald-300",status==="WARNING"&&"border-amber-700/30 text-amber-800 dark:text-amber-300",status==="ERROR"&&"border-destructive/30 text-destructive")}>{status}</span>; }
