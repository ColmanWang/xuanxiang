import type { GraphEntityType, KnowledgeEntityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const citationInclude = { source: true, passage:{include:{section:{include:{witness:{include:{classic:true}}}}}} } satisfies Prisma.CitationInclude;
const interpretationInclude = { citations: { include: citationInclude }, attributedToPerson: true, attributedToSchool: true } satisfies Prisma.InterpretationInclude;

export const knowledgeRepository = {
  findConcept: (slug: string) => prisma.concept.findFirst({ where: { slug, publicationStatus: "PUBLISHED" } }),
  findClassic: (slug: string) => prisma.classic.findFirst({ where: { slug, publicationStatus: "PUBLISHED" } }),
  findPerson: (slug: string) => prisma.person.findFirst({ where: { slug, publicationStatus: "PUBLISHED" } }),
  findSchool: (slug: string) => prisma.school.findFirst({ where: { slug, publicationStatus: "PUBLISHED" } }),
  findTechnique: (slug: string) => prisma.technique.findFirst({ where: { slug, publicationStatus: "PUBLISHED" } }),
  listConcepts: () => prisma.concept.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { name: "asc" } }),
  listClassics: () => prisma.classic.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { title: "asc" } }),
  listPeople: () => prisma.person.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { name: "asc" } }),
  listSchools: () => prisma.school.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { name: "asc" } }),
  listTechniques: () => prisma.technique.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { name: "asc" } }),
  relationsFor: (type: GraphEntityType, id: string) => prisma.relation.findMany({ where: { OR: [{ sourceType: type, sourceId: id }, { targetType: type, targetId: id }] }, include: { citations: { include: citationInclude } }, orderBy: { id: "asc" } }),
  citationsFor: (type: KnowledgeEntityType, id: string) => prisma.citation.findMany({ where: { subjectType: type, subjectId: id }, include: citationInclude, orderBy: { createdAt: "asc" } }),
  interpretationsFor: (type: KnowledgeEntityType, id: string) => prisma.interpretation.findMany({ where: { subjectType: type, subjectId: id }, include: interpretationInclude, orderBy: { createdAt: "asc" } }),
};
