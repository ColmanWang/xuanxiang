import "dotenv/config";
import { luckCycleFixtures,validateLuckFixtureProvenance } from "../fixtures/bazi/luck-cycles";
import { BAZI_REGRESSION_MANIFEST,evaluateBaziFoundation } from "../lib/bazi/foundation";
import { KNOWN_LUCK_DIFFERENCES,validateKnownDifferences } from "../lib/bazi/known-differences";
import { validateRuleProvenance } from "../lib/bazi/provenance";

async function main(){const provenance=await validateRuleProvenance();
const fixtureValidation=validateLuckFixtureProvenance();
const differences=validateKnownDifferences();
const tierCounts=luckCycleFixtures.reduce((result,item)=>({...result,[item.tier]:result[item.tier]+1}),{A:0,B:0,C:0});
const readiness=evaluateBaziFoundation({provenanceValid:provenance.valid&&fixtureValidation.valid,tierACount:tierCounts.A,unresolvedDifferenceCount:differences.unresolved.length});
console.log(`Solar Terms: ${BAZI_REGRESSION_MANIFEST.solarTermFixtureCount}`);
console.log(`Day Pillars: ${BAZI_REGRESSION_MANIFEST.dayPillarFixtureCount}`);
console.log(`Four Pillars: ${BAZI_REGRESSION_MANIFEST.fourPillarFixtureCount}`);
console.log(`Luck Cycles: ${BAZI_REGRESSION_MANIFEST.luckFixtureCount} · A${tierCounts.A}/B${tierCounts.B}/C${tierCounts.C}`);
console.log(`Rule Provenance: ${provenance.valid?"PASS":"FAIL"} · ${provenance.entries.reduce((sum,item)=>sum+item.citations.length,0)} citations`);
console.log(`Known Differences: ${KNOWN_LUCK_DIFFERENCES.length} classified · ${differences.unresolved.length} unresolved`);
console.log(`Provider Gate: ${BAZI_REGRESSION_MANIFEST.providers.solarTerms.provider}@${BAZI_REGRESSION_MANIFEST.providers.solarTerms.version}`);
console.log(`Readiness: ${readiness.status}`);
for(const reason of readiness.reasons)console.log(`  - ${reason}`);
if(readiness.status==="BLOCKED")process.exitCode=1;}
void main();
