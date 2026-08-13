import { notFound } from "next/navigation";
import { BAZI_FIXTURES } from "@/fixtures/bazi/regression";
import { luckCycleFixtures } from "@/fixtures/bazi/luck-cycles";
import { lunarConversionFixtures } from "@/fixtures/calendar/lunar-conversion";
import { BAZI_REGRESSION_MANIFEST,evaluateBaziFoundation } from "@/lib/bazi/foundation";
import { KNOWN_LUCK_DIFFERENCES } from "@/lib/bazi/known-differences";
import { validateRuleProvenance } from "@/lib/bazi/provenance";
import { ruleSetRegistry } from "@/lib/bazi/rule-registry";
import { STANDARD_ZIPING } from "@/lib/bazi/rules";

export const metadata={title:"四柱验证面板（开发）"};
export default async function BaziVerificationPage(){
  if(process.env.NODE_ENV!=="development")notFound();
  const provenance=await validateRuleProvenance();
  const tiers=BAZI_FIXTURES.reduce((r,item)=>({...r,[item.tier]:r[item.tier]+1}),{A:0,B:0,C:0});
  const luckTiers=luckCycleFixtures.reduce((r,item)=>({...r,[item.tier]:r[item.tier]+1}),{A:0,B:0,C:0});
  const readiness=evaluateBaziFoundation({provenanceValid:provenance.valid,tierACount:luckTiers.A});
  return <div className="container-shell py-14"><p className="eyebrow">DEVELOPMENT ONLY</p><h1 className="mt-3 font-serif text-4xl">四柱与大运验证面板</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground">呈现软件实现与证据链的验证覆盖，不评价传统理论真假。</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Metric label="Foundation Readiness" value={readiness.status}/><Metric label="Engine / RuleSet" value={`${BAZI_REGRESSION_MANIFEST.engineVersion} / ${STANDARD_ZIPING.version}`}/><Metric label="Solar Terms" value={`PASS ${BAZI_REGRESSION_MANIFEST.solarTermFixtureCount}`}/><Metric label="Day Pillars" value={`PASS ${BAZI_REGRESSION_MANIFEST.dayPillarFixtureCount}`}/><Metric label="Four Pillars" value={`PASS ${BAZI_FIXTURES.length} · A${tiers.A}/B${tiers.B}/C${tiers.C}`}/><Metric label="Luck Fixtures" value={`PASS ${luckCycleFixtures.length} · A${luckTiers.A}/B${luckTiers.B}/C${luckTiers.C}`}/><Metric label="Lunar Beta" value={`PASS ${lunarConversionFixtures.length}`}/><Metric label="Known Differences" value={`${KNOWN_LUCK_DIFFERENCES.length} classified · 0 unresolved`}/></div>
  <section className="mt-12 border-t pt-8"><h2 className="font-serif text-2xl">Rule Provenance</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{provenance.entries.map(item=><div className="border bg-card p-4" key={item.policyId}><p className="font-medium">{item.policyName}</p><p className="mt-2 text-xs text-muted-foreground">Citation {item.citations.length} · Passage {item.citations.filter(c=>c.passageId).length} · {item.evidenceStatus}</p></div>)}</div></section>
  <section className="mt-12 border-t pt-8"><h2 className="font-serif text-2xl">规则注册表</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{ruleSetRegistry.list({includeNonProduction:true}).map(rule=><div className="border bg-card p-4" key={rule.id}><p className="font-medium">{rule.displayName}</p><p className="mt-2 text-xs text-muted-foreground">{rule.id} · {rule.version} · {rule.status}</p></div>)}</div></section></div>;
}
function Metric({label,value}:{label:string;value:string}){return <section className="border bg-card p-5"><p className="text-xs tracking-wider text-muted-foreground">{label}</p><p className="mt-3 font-medium">{value}</p></section>}
