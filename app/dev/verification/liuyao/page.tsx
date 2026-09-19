import { notFound } from "next/navigation";
import { LIUYAO_FULL_CHART_FIXTURES } from "@/fixtures/liuyao/full-charts";
import { HEXAGRAMS } from "@/lib/liuyao/hexagrams";
import { LIUYAO_ENGINE_VERSION } from "@/lib/liuyao/engine";
import { getLiuyaoFoundationReadiness, validateLiuyaoRuleProvenance } from "@/lib/liuyao/readiness";
import { getLiuyaoRuleProvenance } from "@/lib/liuyao/provenance";
import { LIUYAO_KNOWN_DIFFERENCES } from "@/lib/liuyao/known-differences";
import { LIUYAO_REGRESSION_MANIFEST } from "@/lib/liuyao/manifests";
import { STANDARD_WENWANG_GUA } from "@/lib/liuyao/rules";

export const dynamic = "force-dynamic";

export default async function LiuyaoVerificationPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const readiness = getLiuyaoFoundationReadiness();
  const provenance = validateLiuyaoRuleProvenance();
  const databaseProvenance = await getLiuyaoRuleProvenance();
  const passageCount = databaseProvenance.reduce((sum, item) => sum + item.citations.filter((citation) => citation.passageId).length, 0);
  const tierCounts = LIUYAO_FULL_CHART_FIXTURES.reduce(
    (counts, fixture) => ({ ...counts, [fixture.tier]: counts[fixture.tier] + 1 }),
    { A: 0, B: 0, C: 0 },
  );

  return (
    <div className="page-shell">
      <p className="text-xs tracking-[0.18em] text-muted-foreground">DEVELOPMENT ONLY</p>
      <h1 className="mt-4 font-serif text-4xl">六爻基础验证</h1>
      <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
        工程验证面板，不是准确率宣传。它区分软件验证、规则典据与尚未实现的能力。
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Engine" value={LIUYAO_ENGINE_VERSION} />
        <Metric label="RuleSet" value={`${STANDARD_WENWANG_GUA.id} ${STANDARD_WENWANG_GUA.version}`} />
        <Metric label="Status" value={STANDARD_WENWANG_GUA.status} />
        <Metric label="Readiness" value={readiness.status} />
      </section>

      <section className="mt-10 border bg-card p-6">
        <h2 className="font-serif text-2xl">验证检查</h2>
        <div className="mt-5 divide-y">
          {readiness.checks.map((check) => (
            <article key={check.id} className="grid gap-2 py-4 md:grid-cols-[12rem_7rem_1fr]">
              <strong className="font-medium">{check.label}</strong>
              <span className="font-mono text-xs text-muted-foreground">{check.status}</span>
              <p className="text-sm leading-6 text-muted-foreground">{check.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="border bg-card p-6">
          <h2 className="font-serif text-2xl">Fixtures</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <dt>六十四卦</dt><dd>{HEXAGRAMS.length} / 64</dd>
            <dt>动变穷举</dt><dd>4096 / 4096</dd>
            <dt>完整盘总数</dt><dd>{LIUYAO_REGRESSION_MANIFEST.fullChartFixtureCount}</dd>
            <dt>完整盘 Tier A</dt><dd>{tierCounts.A}</dd>
            <dt>完整盘 Tier B</dt><dd>{tierCounts.B}</dd>
            <dt>完整盘 Tier C</dt><dd>{tierCounts.C}</dd>
          </dl>
        </article>
        <article className="border bg-card p-6">
          <h2 className="font-serif text-2xl">Rule Provenance</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <dt>Policies</dt><dd>{provenance.policyCount}</dd>
            <dt>References</dt><dd>{provenance.referenceCount}</dd>
            <dt>Passage-sourced</dt><dd>{provenance.sourcedPolicyIds.length}</dd>
            <dt>Passage citations</dt><dd>{passageCount}</dd>
            <dt>Unsourced</dt><dd>{provenance.unsourcedPolicyIds.length}</dd>
          </dl>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">纳甲、八宫、世应、六亲、六神已建立 Passage 链；数字转录仍待影像校订，月建完整典据仍有限。</p>
        </article>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="border bg-card p-6"><h2 className="font-serif text-2xl">Known Differences</h2><div className="mt-5 space-y-4">{LIUYAO_KNOWN_DIFFERENCES.map((item)=><div key={item.id}><p className="text-sm">{item.summary}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{item.kind} · {item.status} · {item.impact}</p></div>)}</div></article>
        <article className="border bg-card p-6"><h2 className="font-serif text-2xl">Hidden Spirits</h2><p className="mt-5 font-mono text-sm">NOT_IMPLEMENTED</p><p className="mt-3 text-sm leading-6 text-muted-foreground">已定位飞伏历史文本，但尚缺独立 Golden Dataset 与至少 20 条可靠 fixture，不进入稳定计算。</p></article>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="border bg-card p-5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 break-words font-mono text-sm">{value}</p></article>;
}
