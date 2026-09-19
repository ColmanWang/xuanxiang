CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "RagDocumentType" AS ENUM (
  'KNOWLEDGE_ENTRY', 'PASSAGE', 'INTERPRETATION', 'CLASSIC_SUMMARY',
  'PERSON_SUMMARY', 'SCHOOL_SUMMARY', 'TECHNIQUE_SUMMARY'
);
CREATE TYPE "IndexState" AS ENUM ('BUILDING', 'CURRENT', 'STALE', 'FAILED');

CREATE TABLE "RagDocument" (
  "id" TEXT NOT NULL,
  "type" "RagDocumentType" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "citationIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "passageId" TEXT,
  "classicId" TEXT,
  "editorialStatus" "EditorialStatus" NOT NULL,
  "publicationStatus" "PublicationStatus" NOT NULL,
  "evidenceStatus" "EvidenceStatus",
  "contentHash" TEXT NOT NULL,
  "indexVersion" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RagDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RagEmbedding" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "dimensions" INTEGER NOT NULL,
  "contentHash" TEXT NOT NULL,
  "embedding" vector NOT NULL,
  "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RagEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IndexManifest" (
  "id" TEXT NOT NULL,
  "indexVersion" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "dimensions" INTEGER NOT NULL,
  "documentCount" INTEGER NOT NULL,
  "embeddingCount" INTEGER NOT NULL,
  "contentSnapshotChecksum" TEXT NOT NULL,
  "state" "IndexState" NOT NULL DEFAULT 'CURRENT',
  "lastIndexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IndexManifest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RagDocument_entityType_entityId_idx" ON "RagDocument"("entityType", "entityId");
CREATE INDEX "RagDocument_type_idx" ON "RagDocument"("type");
CREATE INDEX "RagDocument_contentHash_idx" ON "RagDocument"("contentHash");
CREATE UNIQUE INDEX "RagEmbedding_documentId_provider_model_key" ON "RagEmbedding"("documentId", "provider", "model");
CREATE INDEX "RagEmbedding_provider_model_idx" ON "RagEmbedding"("provider", "model");
CREATE INDEX "RagEmbedding_contentHash_idx" ON "RagEmbedding"("contentHash");
CREATE UNIQUE INDEX "IndexManifest_indexVersion_provider_model_key" ON "IndexManifest"("indexVersion", "provider", "model");
CREATE INDEX "IndexManifest_lastIndexedAt_idx" ON "IndexManifest"("lastIndexedAt");
CREATE INDEX "IndexManifest_contentSnapshotChecksum_idx" ON "IndexManifest"("contentSnapshotChecksum");
ALTER TABLE "RagEmbedding" ADD CONSTRAINT "RagEmbedding_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "RagDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
