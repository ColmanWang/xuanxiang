import { prisma } from "@/lib/prisma";
import { LIUYAO_RULE_REFERENCES, type LiuyaoRuleReference } from "./rule-references";
import { STANDARD_WENWANG_GUA } from "./rules";

export interface LiuyaoRuleCitationView {
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

export interface LiuyaoRuleProvenanceView extends LiuyaoRuleReference {
  policyName: string;
  policyVersion: string;
  verificationLevel: string;
  citations: LiuyaoRuleCitationView[];
  sourcingStatus: "SOURCED" | "UNSOURCED_WITH_EDITORIAL_NOTE";
}

const policyById = new Map(Object.values(STANDARD_WENWANG_GUA.policies).map((policy) => [policy.id, policy]));

export async function getLiuyaoRuleProvenance(): Promise<LiuyaoRuleProvenanceView[]> {
  const citationIds = LIUYAO_RULE_REFERENCES.flatMap((reference) => [...reference.citationIds]);
  const rows = citationIds.length ? await prisma.citation.findMany({
    where: { id: { in: citationIds } },
    include: { source: true, passage: { include: { section: { include: { witness: { include: { classic: true } } } } } } },
  }) : [];
  const byId = new Map(rows.map((citation) => [citation.id, citation]));
  return LIUYAO_RULE_REFERENCES.map((reference) => {
    const policy = policyById.get(reference.policyId);
    const citations = reference.citationIds.flatMap((id) => {
      const citation = byId.get(id);
      if (!citation) return [];
      const classic = citation.passage?.section.witness.classic;
      return [{
        id: citation.id,
        sourceTitle: citation.source.title,
        locator: citation.locator ?? undefined,
        passageId: citation.passageId ?? undefined,
        passageText: citation.passage?.text,
        sectionTitle: citation.passage?.section.title,
        witnessTitle: citation.passage?.section.witness.title,
        classicTitle: classic?.title,
        classicSlug: classic?.slug,
        readerHref: classic && citation.passageId ? `/classics/${classic.slug}/read?passage=${citation.passageId}&view=research` : undefined,
      }];
    });
    return {
      ...reference,
      policyName: policy?.displayName ?? reference.policyId,
      policyVersion: policy?.version ?? "unknown",
      verificationLevel: policy?.verificationLevel ?? "INTERNAL",
      citations,
      sourcingStatus: citations.length ? "SOURCED" : "UNSOURCED_WITH_EDITORIAL_NOTE",
    };
  });
}

export async function getLiuyaoRulesForPassage(passageId: string) {
  const provenance = await getLiuyaoRuleProvenance();
  return provenance
    .filter((item) => item.citations.some((citation) => citation.passageId === passageId))
    .map((item) => ({ policyId: item.policyId, title: item.policyName, href: `/tools/liuyao/rules#${item.policyId}`, evidenceStatus: item.evidenceStatus }));
}

export async function validateLiuyaoRuleProvenanceIntegrity() {
  const entries = await getLiuyaoRuleProvenance();
  const missingPolicyIds = entries
    .filter((entry) => entry.citationIds.length !== entry.citations.length || (!entry.citationIds.length && !entry.scopeNote))
    .map((entry) => entry.policyId);
  return { valid: missingPolicyIds.length === 0, entries, missingPolicyIds };
}
