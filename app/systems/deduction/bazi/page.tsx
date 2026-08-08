import type { Metadata } from "next";
import Link from "next/link";
import { BaziWorkbench } from "@/components/tools/bazi-workbench";

export const metadata: Metadata = {
  title: "八字推演",
  description: "八字推演界面与四柱结果结构演示；确定性历法和规则引擎将在后续版本实现。",
};

export default function BaziDeductionPage() {
  return (
    <div className="page-shell">
      <Link href="/systems/deduction" className="text-sm text-primary hover:underline">
        ← 返回推演系统
      </Link>
      <header className="mt-10 grid gap-8 border-b pb-12 lg:grid-cols-[1fr_32rem] lg:items-end">
        <div>
          <div className="mb-7 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px w-9 bg-accent" />
            干支历法 · 四柱结构
          </div>
          <h1 className="section-title text-4xl sm:text-5xl">八字推演</h1>
        </div>
        <p className="leading-8 text-muted-foreground">
          第一阶段呈现输入、四柱字段和未来扩展区。当前数据仅用于检查信息结构，不代表真实计算结果。
        </p>
      </header>
      <div className="mt-12">
        <BaziWorkbench />
      </div>
    </div>
  );
}
