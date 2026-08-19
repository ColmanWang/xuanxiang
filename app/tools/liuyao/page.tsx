import type { Metadata } from "next";
import Link from "next/link";
import { LiuyaoWorkbench } from "@/components/tools/liuyao-workbench";

export const metadata: Metadata = {
  title: "六爻推演",
  description: "通过六爻阴阳、动变、纳甲与传统规则生成结构化卦盘，不提供断卦或吉凶判断。",
};

export default function LiuyaoPage() {
  return (
    <div className="page-shell">
      <Link href="/tools" className="text-sm text-primary hover:underline">
        ← 返回推演系统
      </Link>
      <header className="mt-10 grid gap-8 border-b pb-12 lg:grid-cols-[1fr_32rem] lg:items-end">
        <div>
          <div className="mb-7 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px w-9 bg-accent" />
            六爻结构 · 确定性排盘
          </div>
          <h1 className="section-title text-4xl sm:text-5xl">六爻推演</h1>
        </div>
        <p className="leading-8 text-muted-foreground">
          通过六个自初至上的爻值，生成本卦、动爻、变卦、八宫、世应、纳甲、六亲与六神。系统只负责结构化排盘，不提供断卦、吉凶或应期判断。
        </p>
      </header>
      <div className="mt-12">
        <LiuyaoWorkbench />
      </div>
    </div>
  );
}
