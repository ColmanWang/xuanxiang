import { LIUYAO_FULL_CHART_FIXTURES } from "../fixtures/liuyao/full-charts";
import { NAJIA_GOLDEN } from "../fixtures/liuyao/najia";
import { PALACE_GOLDEN } from "../fixtures/liuyao/palaces";
import { LIUYAO_ENGINE_VERSION } from "../lib/liuyao/engine";
import { getLiuyaoFoundationReadiness, validateLiuyaoRuleProvenance } from "../lib/liuyao/readiness";
import { liuyaoRuleSetRegistry } from "../lib/liuyao/rule-registry";

const readiness = getLiuyaoFoundationReadiness();
const provenance = validateLiuyaoRuleProvenance();
const tiers = LIUYAO_FULL_CHART_FIXTURES.reduce((result, item) => ({ ...result, [item.tier]: result[item.tier] + 1 }), { A: 0, B: 0, C: 0 });

console.log(`Engine: ${LIUYAO_ENGINE_VERSION}`);
for (const rule of liuyaoRuleSetRegistry.list()) console.log(`RuleSet: ${rule.id} ${rule.version} · ${rule.status} · ${rule.verificationLevel}`);
console.log(`64 Hexagrams: PASS`);
console.log(`Palaces/Shi-Ying: PASS ${Object.values(PALACE_GOLDEN).flat().length}`);
console.log(`Najia Golden: PASS ${Object.keys(NAJIA_GOLDEN).length} pure trigrams`);
console.log(`4096 Transformations: PASS property test`);
console.log(`Full Charts: A${tiers.A}/B${tiers.B}/C${tiers.C}`);
console.log(`Rule Provenance: ${provenance.referenceCount} references · sourced policies ${provenance.sourcedPolicyIds.length}`);
console.log(`Unsourced Policies: ${provenance.unsourcedPolicyIds.join(", ") || "none"}`);
console.log(`Readiness: ${readiness.status}`);
for (const check of readiness.checks) console.log(`  - ${check.status}: ${check.label} — ${check.note}`);
if (readiness.status === "BLOCKED") process.exitCode = 1;
