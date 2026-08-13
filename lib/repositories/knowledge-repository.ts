import type { GraphEntityType, KnowledgeEntityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const citationInclude = { source: true, passage:{include:{section:{include:{witness:{include:{classic:true}}}}}} } satisfies Prisma.CitationInclude;
const interpretationInclude = { citations: { include: citationInclude }, attributedToPerson: true, attributedToSchool: true } satisfies Prisma.InterpretationInclude;

export const knowledgeRepository = {
  findConcept: (slug: string) => prisma.concept.findUnique({ where: { slug } }),
  findClassic: (slug: string) => prisma.classic.findUnique({ where: { slug } }),
  findPerson: (slug: string) => prisma.person.findUnique({ where: { slug } }),
  findSchool: (slug: string) => prisma.school.findUnique({ where: { slug } }),
  findTechnique: (slug: string) => prisma.technique.findUnique({ where: { slug } }),
  listConcepts: () => prisma.concept.findMany({ orderBy: { name: "asc" } }),
  listClassics: () => prisma.classic.findMany({ orderBy: { title: "asc" } }),
  listPeople: () => prisma.person.findMany({ orderBy: { name: "asc" } }),
  listSchools: () => prisma.school.findMany({ orderBy: { name: "asc" } }),
  listTechniques: () => prisma.technique.findMany({ orderBy: { name: "asc" } }),
  relationsFor: (type: GraphEntityType, id: string) => prisma.relation.findMany({ where: { OR: [{ sourceType: type, sourceId: id }, { targetType: type, targetId: id }] }, include: { citations: { include: citationInclude } }, orderBy: { id: "asc" } }),
  citationsFor: (type: KnowledgeEntityType, id: string) => prisma.citation.findMany({ where: { subjectType: type, subjectId: id }, include: citationInclude, orderBy: { createdAt: "asc" } }),
  interpretationsFor: (type: KnowledgeEntityType, id: string) => prisma.interpretation.findMany({ where: { subjectType: type, subjectId: id }, include: interpretationInclude, orderBy: { createdAt: "asc" } }),
};
