import "dotenv/config";
import { ruleSetRegistry } from "../lib/bazi/rule-registry";
import { getRuleProvenance } from "../lib/bazi/provenance";

async function main(){const showProvenance=process.argv.includes("--provenance");
for(const rule of ruleSetRegistry.list({includeNonProduction:true})){
  console.log(`\n${rule.id} · ${rule.version} · ${rule.status}`);
  console.log(rule.displayName);
  for(const [name,policy] of Object.entries(rule.policies))console.log(`  ${name}: ${policy.id}@${policy.version} · ${policy.verificationLevel}`);
  if(showProvenance&&rule.status==="STABLE"){
    const entries=await getRuleProvenance(rule);
    for(const entry of entries){
      console.log(`  provenance: ${entry.policyId} · ${entry.evidenceStatus} · ${entry.verificationLevel} · citations=${entry.citations.length}`);
      for(const citation of entry.citations)console.log(`    -> ${citation.classicTitle} · ${citation.locator} · ${citation.readerHref}`);
    }
  }
}}
void main();
