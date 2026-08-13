import type { Metadata } from "next";
import Link from "next/link";
import { BaziWorkbench } from "@/components/tools/bazi-workbench";

export const metadata: Metadata = { title: "四柱推演", description: "依据出生时间、IANA 时区、节气边界与干支规则生成可追溯的四柱结构。" };

export default function BaziPage() {
  return <div className="page-shell"><Link href="/tools" className="text-sm text-primary hover:underline">← 返回推演系统</Link><header className="mt-10 grid gap-8 border-b pb-12 lg:grid-cols-[1fr_32rem] lg:items-end"><div><div className="mb-7 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px w-9 bg-accent" />历法基础设施 · 确定性排盘</div><h1 className="section-title text-4xl sm:text-5xl">四柱推演</h1></div><p className="leading-8 text-muted-foreground">依据出生时间、节气与干支规则生成四柱结构。程序负责计算，每一柱都保留可复核的边界与推导过程。</p></header><div className="mt-12"><BaziWorkbench /></div></div>;
}
