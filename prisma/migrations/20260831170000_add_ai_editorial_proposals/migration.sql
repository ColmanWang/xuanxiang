CREATE TYPE "AiEditorialProposalType" AS ENUM ('CANDIDATE_SUMMARY');
CREATE TYPE "AiEditorialProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE "AiEditorialProposal" (
  "id" TEXT NOT NULL,
  "type" "AiEditorialProposalType" NOT NULL,
  "targetType" "KnowledgeEntityType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "evidenceDocumentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "status" "AiEditorialProposalStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiEditorialProposal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiEditorialProposal_status_createdAt_idx" ON "AiEditorialProposal"("status", "createdAt");
CREATE INDEX "AiEditorialProposal_targetType_targetId_idx" ON "AiEditorialProposal"("targetType", "targetId");
