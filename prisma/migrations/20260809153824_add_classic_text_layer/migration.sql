-- CreateEnum
CREATE TYPE "EditionType" AS ENUM ('MANUSCRIPT', 'BLOCK_PRINT', 'MODERN_COLLATION', 'DIGITAL_TRANSCRIPTION', 'REFERENCE');

-- CreateEnum
CREATE TYPE "PassageContentType" AS ENUM ('SOURCE_TEXT', 'EDITORIAL_NOTE');

-- CreateEnum
CREATE TYPE "PassageLinkType" AS ENUM ('MENTIONS', 'DISCUSSES', 'DEFINES', 'INTERPRETED_AS', 'RELATED');

-- AlterTable
ALTER TABLE "Citation" ADD COLUMN     "passageId" TEXT;

-- CreateTable
CREATE TABLE "TextWitness" (
    "id" TEXT NOT NULL,
    "classicId" TEXT NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT,
    "editionType" "EditionType" NOT NULL,
    "editor" TEXT,
    "publisher" TEXT,
    "publicationYear" INTEGER,
    "description" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextWitness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextSection" (
    "id" TEXT NOT NULL,
    "witnessId" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "sectionType" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextPassage" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "normalizedText" TEXT,
    "contentType" "PassageContentType" NOT NULL DEFAULT 'SOURCE_TEXT',
    "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextPassage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassageEntityLink" (
    "id" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "entityType" "KnowledgeEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "linkType" "PassageLinkType" NOT NULL,
    "note" TEXT,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'INFERRED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PassageEntityLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TextWitness_classicId_isPrimary_idx" ON "TextWitness"("classicId", "isPrimary");

-- CreateIndex
CREATE INDEX "TextWitness_sourceId_idx" ON "TextWitness"("sourceId");

-- CreateIndex
CREATE INDEX "TextWitness_editorialStatus_idx" ON "TextWitness"("editorialStatus");

-- CreateIndex
CREATE INDEX "TextSection_witnessId_parentId_ordinal_idx" ON "TextSection"("witnessId", "parentId", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "TextSection_witnessId_slug_key" ON "TextSection"("witnessId", "slug");

-- CreateIndex
CREATE INDEX "TextPassage_sectionId_ordinal_idx" ON "TextPassage"("sectionId", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "TextPassage_sectionId_ordinal_key" ON "TextPassage"("sectionId", "ordinal");

-- CreateIndex
CREATE INDEX "PassageEntityLink_entityType_entityId_idx" ON "PassageEntityLink"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "PassageEntityLink_passageId_idx" ON "PassageEntityLink"("passageId");

-- CreateIndex
CREATE UNIQUE INDEX "PassageEntityLink_passageId_entityType_entityId_linkType_key" ON "PassageEntityLink"("passageId", "entityType", "entityId", "linkType");

-- CreateIndex
CREATE INDEX "Citation_passageId_idx" ON "Citation"("passageId");

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "TextPassage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextWitness" ADD CONSTRAINT "TextWitness_classicId_fkey" FOREIGN KEY ("classicId") REFERENCES "Classic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextWitness" ADD CONSTRAINT "TextWitness_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextSection" ADD CONSTRAINT "TextSection_witnessId_fkey" FOREIGN KEY ("witnessId") REFERENCES "TextWitness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextSection" ADD CONSTRAINT "TextSection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TextSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextPassage" ADD CONSTRAINT "TextPassage_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TextSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassageEntityLink" ADD CONSTRAINT "PassageEntityLink_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "TextPassage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
