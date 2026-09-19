-- Editorial workflow progress and public visibility remain separate concepts.
CREATE TYPE "DataCategory" AS ENUM (
  'PRODUCTION_CONTENT',
  'DEVELOPMENT_FIXTURE',
  'REGRESSION_FIXTURE',
  'LAYOUT_FIXTURE',
  'SAMPLE_CONTENT'
);

CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TYPE "EditorialObjectType" AS ENUM (
  'CONCEPT',
  'CLASSIC',
  'PERSON',
  'SCHOOL',
  'TECHNIQUE',
  'DYNASTY',
  'RELATION',
  'SOURCE',
  'CITATION',
  'INTERPRETATION',
  'TEXT_WITNESS',
  'TEXT_SECTION',
  'TEXT_PASSAGE',
  'PASSAGE_ENTITY_LINK',
  'RULE_PROVENANCE'
);

CREATE TYPE "EditorialAuditAction" AS ENUM (
  'CREATE',
  'UPDATE',
  'STATUS_CHANGE',
  'REVIEW',
  'ARCHIVE',
  'DELETE'
);

ALTER TABLE "Concept"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "Classic"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "Person"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "School"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "Technique"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED';

ALTER TABLE "Dynasty" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "Source" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "Citation"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "TextWitness" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "TextSection" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "TextPassage" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "PassageEntityLink"
  ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT',
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Interpretation" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';
ALTER TABLE "Relation" ADD COLUMN "dataCategory" "DataCategory" NOT NULL DEFAULT 'PRODUCTION_CONTENT';

CREATE TABLE "EditorialAuditLog" (
  "id" TEXT NOT NULL,
  "entityType" "EditorialObjectType" NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" "EditorialAuditAction" NOT NULL,
  "actor" TEXT DEFAULT 'LOCAL_EDITOR',
  "changeSummary" JSONB NOT NULL,
  "beforeSnapshot" JSONB,
  "afterSnapshot" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EditorialAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EditorialAuditLog_entityType_entityId_createdAt_idx"
  ON "EditorialAuditLog"("entityType", "entityId", "createdAt");
CREATE INDEX "EditorialAuditLog_action_createdAt_idx"
  ON "EditorialAuditLog"("action", "createdAt");
