-- CreateEnum
CREATE TYPE "KnowledgeEntityType" AS ENUM ('CONCEPT', 'PERSON', 'CLASSIC', 'SCHOOL', 'TECHNIQUE');

-- CreateEnum
CREATE TYPE "GraphEntityType" AS ENUM ('CONCEPT', 'PERSON', 'CLASSIC', 'SCHOOL', 'TECHNIQUE', 'DYNASTY');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('RELATED_TO', 'BELONGS_TO', 'DERIVED_FROM', 'INFLUENCED_BY', 'WRITTEN_BY', 'APPEARS_IN', 'DEVELOPED_DURING', 'USES', 'INTERPRETS');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('DOCUMENTED', 'TRADITIONAL', 'INFERRED', 'CONTESTED');

-- CreateEnum
CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'BASIC', 'SOURCED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('PRIMARY_TEXT', 'CLASSICAL_COMMENTARY', 'MODERN_BOOK', 'ACADEMIC_PAPER', 'REFERENCE_WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "CitationSubjectType" AS ENUM ('CONCEPT', 'CLASSIC', 'PERSON', 'SCHOOL', 'TECHNIQUE', 'DYNASTY', 'RELATION', 'INTERPRETATION');

-- CreateEnum
CREATE TYPE "CitationType" AS ENUM ('DEFINITION', 'HISTORICAL_CONTEXT', 'ATTRIBUTION', 'RELATION_EVIDENCE', 'INTERPRETATION', 'GENERAL');

-- CreateEnum
CREATE TYPE "AttributionStatus" AS ENUM ('CERTAIN', 'TRADITIONAL', 'CONTESTED', 'ANONYMOUS', 'COMPOSITE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "definition" TEXT,
    "historicalContext" TEXT,
    "development" JSONB,
    "keyIdeas" JSONB,
    "researchNotes" JSONB,
    "content" TEXT,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "lastReviewedAt" TIMESTAMP(3),
    "dynastyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorDisplay" TEXT,
    "attributionStatus" "AttributionStatus" NOT NULL DEFAULT 'UNKNOWN',
    "period" TEXT,
    "contentStructure" JSONB,
    "themes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "historicalContext" TEXT,
    "influence" TEXT,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "lastReviewedAt" TIMESTAMP(3),
    "dynastyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "period" TEXT,
    "role" TEXT,
    "keyIdeas" JSONB,
    "historicalContext" TEXT,
    "influence" TEXT,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "period" TEXT,
    "coreQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keyIdeas" JSONB,
    "historicalContext" TEXT,
    "development" JSONB,
    "editorialNote" TEXT,
    "classificationStatus" "EvidenceStatus" NOT NULL DEFAULT 'INFERRED',
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "period" TEXT,
    "definition" TEXT,
    "historicalContext" TEXT,
    "development" JSONB,
    "keyIdeas" JSONB,
    "toolPath" TEXT,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dynasty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "summary" TEXT,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dynasty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "dynastyOrYear" TEXT,
    "publisher" TEXT,
    "edition" TEXT,
    "isbn" TEXT,
    "url" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "subjectType" "CitationSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "locator" TEXT,
    "note" TEXT,
    "citationType" "CitationType" NOT NULL,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'DOCUMENTED',
    "relationId" TEXT,
    "interpretationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interpretation" (
    "id" TEXT NOT NULL,
    "subjectType" "KnowledgeEntityType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "attributedToPersonId" TEXT,
    "attributedToSchoolId" TEXT,
    "period" TEXT,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'INFERRED',
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interpretation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" TEXT NOT NULL,
    "sourceType" "GraphEntityType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" "GraphEntityType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'INFERRED',
    "note" TEXT,
    "sourceNote" TEXT,
    "legacySources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Concept_slug_key" ON "Concept"("slug");

-- CreateIndex
CREATE INDEX "Concept_dynastyId_idx" ON "Concept"("dynastyId");

-- CreateIndex
CREATE INDEX "Concept_editorialStatus_idx" ON "Concept"("editorialStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Classic_slug_key" ON "Classic"("slug");

-- CreateIndex
CREATE INDEX "Classic_dynastyId_idx" ON "Classic"("dynastyId");

-- CreateIndex
CREATE INDEX "Classic_editorialStatus_idx" ON "Classic"("editorialStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "Person_editorialStatus_idx" ON "Person"("editorialStatus");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_editorialStatus_idx" ON "School"("editorialStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Technique_slug_key" ON "Technique"("slug");

-- CreateIndex
CREATE INDEX "Technique_category_idx" ON "Technique"("category");

-- CreateIndex
CREATE INDEX "Technique_editorialStatus_idx" ON "Technique"("editorialStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Dynasty_name_key" ON "Dynasty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dynasty_slug_key" ON "Dynasty"("slug");

-- CreateIndex
CREATE INDEX "Source_type_idx" ON "Source"("type");

-- CreateIndex
CREATE INDEX "Source_title_idx" ON "Source"("title");

-- CreateIndex
CREATE INDEX "Citation_subjectType_subjectId_idx" ON "Citation"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "Citation_sourceId_idx" ON "Citation"("sourceId");

-- CreateIndex
CREATE INDEX "Citation_relationId_idx" ON "Citation"("relationId");

-- CreateIndex
CREATE INDEX "Citation_interpretationId_idx" ON "Citation"("interpretationId");

-- CreateIndex
CREATE UNIQUE INDEX "Citation_sourceId_subjectType_subjectId_locator_citationTyp_key" ON "Citation"("sourceId", "subjectType", "subjectId", "locator", "citationType");

-- CreateIndex
CREATE INDEX "Interpretation_subjectType_subjectId_idx" ON "Interpretation"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "Interpretation_attributedToPersonId_idx" ON "Interpretation"("attributedToPersonId");

-- CreateIndex
CREATE INDEX "Interpretation_attributedToSchoolId_idx" ON "Interpretation"("attributedToSchoolId");

-- CreateIndex
CREATE INDEX "Interpretation_editorialStatus_idx" ON "Interpretation"("editorialStatus");

-- CreateIndex
CREATE INDEX "Relation_sourceType_sourceId_idx" ON "Relation"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "Relation_targetType_targetId_idx" ON "Relation"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Relation_relationType_idx" ON "Relation"("relationType");

-- CreateIndex
CREATE INDEX "Relation_evidenceStatus_idx" ON "Relation"("evidenceStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_sourceType_sourceId_targetType_targetId_relationTy_key" ON "Relation"("sourceType", "sourceId", "targetType", "targetId", "relationType");

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classic" ADD CONSTRAINT "Classic_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "Dynasty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "Relation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_interpretationId_fkey" FOREIGN KEY ("interpretationId") REFERENCES "Interpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_attributedToPersonId_fkey" FOREIGN KEY ("attributedToPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_attributedToSchoolId_fkey" FOREIGN KEY ("attributedToSchoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
