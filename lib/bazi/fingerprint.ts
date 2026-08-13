import type { BaziRuleSet } from "./types";

export const CALENDAR_PROVIDERS = {
  timezone: { provider: "IANA tzdb via Temporal", version: "runtime", verificationLevel: "CROSS_CHECKED" as const },
  solarTerms: { provider: "lunar-typescript", version: "1.8.6", verificationLevel: "CROSS_CHECKED" as const },
  lunarCalendar: { provider: "lunar-typescript", version: "1.8.6", verificationLevel: "CROSS_CHECKED" as const },
};

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 0x01000193); }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function calculationFingerprint(engineVersion: string, rules: BaziRuleSet): string {
  const policyVersions=Object.values(rules.policies).map(policy=>`${policy.id}@${policy.version}`).sort().join(",");
  const environment = [engineVersion,rules.id,rules.version,policyVersions,CALENDAR_PROVIDERS.timezone.provider,CALENDAR_PROVIDERS.solarTerms.provider,CALENDAR_PROVIDERS.solarTerms.version].join("|");
  return `xx-bazi-${fnv1a(environment)}`;
}
