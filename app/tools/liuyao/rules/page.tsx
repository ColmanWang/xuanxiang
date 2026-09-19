import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getLiuyaoRuleProvenance } from "@/lib/liuyao/provenance";
import { STANDARD_WENWANG_GUA } from "@/lib/liuyao/rules";

export const metadata: Metadata = { title: "六爻规则档案", description: "查看玄象六爻排盘规则、工程形式化、验证状态与原典证据。" };

const policyLabels: Record<string, string> = {
  construction: "构卦与爻序", najia: "纳甲", palace: "八宫", shiYing: "世应",
  sixRelative: "六亲", sixSpirit: "六神", hiddenSpirit: "伏神 / 飞神", calendarContext: "月建与日辰",
};
const evidenceLabels = { DOCUMENTED: "有文献依据", TRADITIONAL: "传统归属", INFERRED: "关系推定", CONTESTED: "存在争议" };
const roleLabels = { DIRECT_RULE: "直接规则依据", HISTORICAL_PRECEDENT: "历史先例", LATER_FORMULATION: "后世定式", COMMENTARY: "注疏说明", EDITORIAL_CONTEXT: "编辑说明" };

export default async function LiuyaoRulesPage() {
  const provenance = await getLiuyaoRuleProvenance();
  const byPolicy = new Map(provenance.map((entry) => [entry.policyId, entry]));
  return <div className="page-shell max-w-6xl">
    <nav className="text-sm text-muted-foreground"><Link href="/tools/liuyao">六爻推演</Link> / 规则档案</nav>
    <header className="mt-8 max-w-3xl"><p className="eyebrow">RULE PROVENANCE · FORMALIZATION</p><h1 className="mt-4 font-serif text-4xl sm:text-5xl">六爻规则档案</h1><p className="mt-5 leading-8 text-muted-foreground">这里分别记录后世文献实际支持的规则、玄象为了确定性计算作出的形式化，以及仍未完成验证的能力。它不是断卦说明。</p></header>
    <section className="mt-12 border-t-2 border-primary bg-card p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge>{STANDARD_WENWANG_GUA.status}</Badge><h2 className="mt-4 font-serif text-3xl">{STANDARD_WENWANG_GUA.displayName}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{STANDARD_WENWANG_GUA.description}</p></div><div className="text-right text-xs text-muted-foreground"><p>RuleSet {STANDARD_WENWANG_GUA.version}</p><p className="mt-1">{STANDARD_WENWANG_GUA.verificationLevel}</p></div></div></section>
    <section className="mt-10 grid gap-5">{Object.entries(STANDARD_WENWANG_GUA.policies).map(([key, policy]) => {
      const item = byPolicy.get(policy.id);
      if (!item) return null;
      return <article id={policy.id} key={policy.id} className="scroll-mt-28 border bg-card p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-muted-foreground">{policyLabels[key] ?? key}</p><h2 className="mt-2 font-serif text-2xl">{policy.displayName}</h2></div><div className="flex flex-wrap gap-2"><Badge>{evidenceLabels[item.evidenceStatus]}</Badge><Badge>{roleLabels[item.referenceRole]}</Badge></div></div>
        <dl className="mt-6 grid gap-5 text-sm lg:grid-cols-2"><div><dt className="text-xs tracking-wider text-muted-foreground">传统规则说明</dt><dd className="mt-2 leading-7">{item.traditionalDescription}</dd></div><div><dt className="text-xs tracking-wider text-muted-foreground">玄象形式化</dt><dd className="mt-2 leading-7">{item.formalization}</dd></div></dl>
        <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-7 text-muted-foreground">{item.scopeNote}</p>
        <div className="mt-6 grid gap-3">{item.citations.length ? item.citations.map((citation) => <div className="border p-4" key={citation.id}><p className="font-medium">{citation.classicTitle} · {citation.sectionTitle}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{citation.witnessTitle}<br />{citation.locator}</p>{citation.readerHref ? <Link className="mt-3 inline-block text-sm text-primary" href={citation.readerHref}>查看原典 →</Link> : null}</div>) : <p className="border border-dashed p-4 text-sm text-muted-foreground">典据整理中；当前保留编辑说明，不伪造来源。</p>}</div>
        <details className="mt-5 border-t pt-4 text-sm"><summary className="cursor-pointer text-muted-foreground">研究说明</summary><div className="mt-3 space-y-2 leading-7 text-muted-foreground"><p>Policy ID：{policy.id} · v{policy.version} · {policy.verificationLevel}</p>{item.knownVariants?.map((variant) => <p key={variant}>{variant}</p>)}</div></details>
      </article>;
    })}</section>
    <div className="mt-12 flex flex-wrap gap-5 text-sm text-primary"><Link href="/tools/liuyao">返回六爻推演</Link><Link href="/techniques/liuyao">了解六爻知识档案</Link></div>
  </div>;
}
