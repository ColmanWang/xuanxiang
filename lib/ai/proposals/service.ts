import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { STUDIO_PERMISSIONS } from "@/lib/auth/permissions";
import { assertEditorialStudioEnabled, authorizeEditorialMutation } from "@/lib/editorial/actions/gate";
import { editorialWriteService } from "@/lib/editorial/actions/service";
import { isEligibleProposalEvidence } from "./evidence-policy";

const createSchema = z.object({
  targetType: z.literal("CONCEPT"),
  targetId: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(4000),
  evidenceDocumentIds: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  provider: z.string().trim().min(1).max(120),
  model: z.string().trim().min(1).max(160),
}).strict();

export async function createCandidateSummaryProposal(raw: unknown) {
  await authorizeEditorialMutation(STUDIO_PERMISSIONS.CREATE_PROPOSAL);
  const input = createSchema.parse(raw);
  const [target, manifest] = await Promise.all([
    prisma.concept.findUnique({ where: { id: input.targetId }, select: { id: true } }),
    prisma.indexManifest.findFirst({ where: { state: "CURRENT" }, orderBy: { lastIndexedAt: "desc" } }),
  ]);
  if (!target) throw new Error("PROPOSAL_TARGET_NOT_FOUND");
  if (!manifest) throw new Error("PROPOSAL_EVIDENCE_INVALID");
  const evidence = await prisma.ragDocument.findMany({
    where: {
      id: { in: input.evidenceDocumentIds },
      publicationStatus: "PUBLISHED",
      editorialStatus: { in: ["BASIC", "SOURCED", "REVIEWED"] },
      sourceType: { notIn: ["DEVELOPMENT_FIXTURE", "REGRESSION_FIXTURE", "SAMPLE_CONTENT"] },
      indexVersion: manifest.indexVersion,
    },
    select: {
      publicationStatus: true, editorialStatus: true, sourceType: true, indexVersion: true, contentHash: true,
      embeddings: { where: { provider: manifest.provider, model: manifest.model }, select: { provider: true, model: true, contentHash: true } },
    },
  });
  if (evidence.length !== input.evidenceDocumentIds.length || evidence.some((document) => !isEligibleProposalEvidence(document, manifest))) {
    throw new Error("PROPOSAL_EVIDENCE_INVALID");
  }
  return prisma.aiEditorialProposal.create({ data: {
    type: "CANDIDATE_SUMMARY", targetType: input.targetType, targetId: input.targetId,
    payload: { summary: input.summary }, evidenceDocumentIds: input.evidenceDocumentIds,
    provider: input.provider, model: input.model,
  } });
}

export async function acceptCandidateSummaryProposal(id: string) {
  await authorizeEditorialMutation(STUDIO_PERMISSIONS.ACCEPT_PROPOSAL);
  const proposal = await prisma.aiEditorialProposal.findUnique({ where: { id } });
  if (!proposal || proposal.status !== "PENDING" || proposal.type !== "CANDIDATE_SUMMARY" || proposal.targetType !== "CONCEPT") {
    throw new Error("PROPOSAL_NOT_PENDING");
  }
  const target = await prisma.concept.findUnique({ where: { id: proposal.targetId } });
  const summary = z.object({ summary: z.string().trim().min(1).max(4000) }).parse(proposal.payload).summary;
  if (!target) throw new Error("PROPOSAL_TARGET_NOT_FOUND");
  await editorialWriteService.saveConcept({
    id: target.id, slug: target.slug, aliases: target.aliases, name: target.name,
    summary, categories: target.categories, editorialStatus: target.editorialStatus,
    definition: target.definition, historicalContext: target.historicalContext,
    dynastyId: target.dynastyId, expectedUpdatedAt: target.updatedAt,
  });
  return prisma.aiEditorialProposal.update({ where: { id }, data: { status: "ACCEPTED", reviewedAt: new Date() } });
}

export async function rejectCandidateSummaryProposal(id: string) {
  await authorizeEditorialMutation(STUDIO_PERMISSIONS.REJECT_PROPOSAL);
  return prisma.aiEditorialProposal.update({ where: { id, status: "PENDING" }, data: { status: "REJECTED", reviewedAt: new Date() } });
}

export async function listAiEditorialProposals() {
  assertEditorialStudioEnabled();
  return prisma.aiEditorialProposal.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
