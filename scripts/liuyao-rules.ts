import "dotenv/config";
import { getLiuyaoRuleProvenance } from "../lib/liuyao/provenance";
import { liuyaoRuleSetRegistry } from "../lib/liuyao/rule-registry";

async function main() {
  const showProvenance = process.argv.includes("--provenance");
  for (const rule of liuyaoRuleSetRegistry.list()) {
    console.log(`\n${rule.id} · ${rule.version} · ${rule.status}`);
    console.log(rule.displayName);
    for (const [name, policy] of Object.entries(rule.policies)) console.log(`  ${name}: ${policy.id}@${policy.version} · ${policy.verificationLevel}`);
  }
  if (!showProvenance) return;
  const entries = await getLiuyaoRuleProvenance();
  for (const entry of entries) {
    console.log(`  provenance: ${entry.policyId} · ${entry.evidenceStatus} · ${entry.verificationLevel} · citations=${entry.citations.length} · passages=${entry.citations.filter((item) => item.passageId).length}`);
    for (const citation of entry.citations) console.log(`    -> ${citation.classicTitle} · ${citation.locator} · ${citation.readerHref}`);
  }
}

void main();
