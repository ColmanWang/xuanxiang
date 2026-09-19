import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertEditorialStudioEnabled } from "@/lib/editorial/actions/gate";
import { editorialWriteService } from "@/lib/editorial/actions/service";

const createSchema = z.object({
  targetType: z.literal("CONCEPT"),
  targetId: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(4000),
  evidenceDocumentIds: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  provider: z.string().trim().min(1).max(120),
  model: z.string().trim().min(1).max(160),
}).strict();

export async function createCandidateSummaryProposal(raw: unknown) {
  assertEditorialStudioEnabled();
  const input = createSchema.parse(raw);
  const [target, evidenceCount] = await Promise.all([
    prisma.concept.findUnique({ where: { id: input.targetId }, select: { id: true } }),
    prisma.ragDocument.count({ where: { id: { in: input.evidenceDocumentIds }, embeddings: { some: {} } } }),
  ]);
  if (!target) throw new Error("PROPOSAL_TARGET_NOT_FOUND");
  if (evidenceCount !== input.evidenceDocumentIds.length) throw new Error("PROPOSAL_EVIDENCE_INVALID");
  return prisma.aiEditorialProposal.create({ data: {
    type: "CANDIDATE_SUMMARY", targetType: input.targetType, targetId: input.targetId,
    payload: { summary: input.summary }, evidenceDocumentIds: input.evidenceDocumentIds,
    provider: input.provider, model: input.model,
  } });
}

export async function acceptCandidateSummaryProposal(id: string) {
  assertEditorialStudioEnabled();
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
  assertEditorialStudioEnabled();
  return prisma.aiEditorialProposal.update({ where: { id, status: "PENDING" }, data: { status: "REJECTED", reviewedAt: new Date() } });
}

export async function listAiEditorialProposals() {
  assertEditorialStudioEnabled();
  return prisma.aiEditorialProposal.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
