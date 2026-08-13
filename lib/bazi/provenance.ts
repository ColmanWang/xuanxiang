import { prisma } from "@/lib/prisma";
import { ruleSetRegistry } from "./rule-registry";
import type { BaziRuleSet, RuleReference } from "./types";

export interface RuleCitationView {
  id: string;
  sourceTitle: string;
  locator?: string;
  passageId?: string;
  passageText?: string;
  sectionTitle?: string;
  witnessTitle?: string;
  classicTitle?: string;
  classicSlug?: string;
  readerHref?: string;
}
export interface RuleProvenanceView extends RuleReference {
  policyName: string;
  policyVersion: string;
  verificationLevel: string;
  citations: RuleCitationView[];
  sourcingStatus: "SOURCED" | "UNSOURCED_WITH_EDITORIAL_NOTE";
}

const policyFor = (rule: BaziRuleSet, id: string) => Object.values(rule.policies).find((policy) => policy.id === id);

export async function getRuleProvenance(rule: BaziRuleSet = ruleSetRegistry.getDefault()): Promise<RuleProvenanceView[]> {
  const citationIds = rule.references.flatMap((reference) => reference.citationIds);
  const citations = citationIds.length ? await prisma.citation.findMany({
    where: { id: { in: citationIds } },
    include: { source: true, passage: { include: { section: { include: { witness: { include: { classic: true } } } } } } },
  }) : [];
  const byId = new Map(citations.map((citation) => [citation.id, citation]));
  return rule.references.map((reference) => {
    const policy = policyFor(rule, reference.policyId);
    const mapped = reference.citationIds.flatMap((id) => {
      const citation = byId.get(id);
      if (!citation) return [];
      const classic = citation.passage?.section.witness.classic;
      return [{ id: citation.id, sourceTitle: citation.source.title, locator: citation.locator ?? undefined, passageId: citation.passageId ?? undefined, passageText: citation.passage?.text, sectionTitle: citation.passage?.section.title, witnessTitle: citation.passage?.section.witness.title, classicTitle: classic?.title, classicSlug: classic?.slug, readerHref: classic && citation.passageId ? `/classics/${classic.slug}/read?passage=${citation.passageId}` : undefined }];
    });
    return { ...reference, policyName: policy?.displayName ?? reference.policyId, policyVersion: policy?.version ?? "unknown", verificationLevel: policy?.verificationLevel ?? "INTERNAL", citations: mapped, sourcingStatus: mapped.length ? "SOURCED" : "UNSOURCED_WITH_EDITORIAL_NOTE" };
  });
}

export async function getRulesForPassage(passageId: string) {
  const provenance = await getRuleProvenance();
  return provenance.filter((item) => item.citations.some((citation) => citation.passageId === passageId)).map((item) => ({ policyId: item.policyId, title: item.policyName, href: `/tools/bazi/rules#${item.policyId === "LUCK_DIRECTION_YEAR_STEM_SEX_V1" ? "luck-direction" : "luck-start"}`, evidenceStatus: item.evidenceStatus }));
}

export async function validateRuleProvenance(rule: BaziRuleSet = ruleSetRegistry.getDefault()) {
  const critical = new Set<string>([rule.policies.luckDirection.id, rule.policies.luckStart.id]);
  const provenance = (await getRuleProvenance(rule)).filter((item) => critical.has(item.policyId));
  const missing = provenance.filter((item) => item.citationIds.length !== item.citations.length || (item.sourcingStatus !== "SOURCED" && !item.note));
  const present = new Set(provenance.map((item) => item.policyId));
  const missingCritical = [...critical].filter((policyId) => !present.has(policyId));
  return { valid: missing.length === 0 && missingCritical.length === 0, entries: provenance, missingPolicyIds: [...missingCritical, ...missing.map((item) => item.policyId)] };
}
