import type { EditorialStatus, GraphEntityType, KnowledgeEntityType as PrismaKnowledgeType } from "@prisma/client";
import { knowledgeRepository } from "@/lib/repositories/knowledge-repository";
import { getGraph } from "@/lib/services/graph-service";
import type { KnowledgeEntry, KnowledgeEntityType, KnowledgePoint, KnowledgeDevelopmentSection, ReferenceView, ResearchNote } from "@/lib/knowledge/types";

const upper: Record<KnowledgeEntityType, PrismaKnowledgeType> = { concept: "CONCEPT", classic: "CLASSIC", person: "PERSON", school: "SCHOOL", technique: "TECHNIQUE" };
const graphUpper: Record<KnowledgeEntityType, GraphEntityType> = upper;
const asArray = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];
const mapCitation = (item: Awaited<ReturnType<typeof knowledgeRepository.citationsFor>>[number]): ReferenceView => ({ id: item.id, sourceTitle: item.source.title, sourceType: item.source.type, author: item.source.author ?? undefined, period: item.source.dynastyOrYear ?? undefined, locator: item.locator ?? undefined, note: item.note ?? undefined, evidenceStatus: item.evidenceStatus,passageId:item.passageId??undefined,readerHref:item.passage?`/classics/${item.passage.section.witness.classic.slug}/read?passage=${item.passage.id}`:undefined,classicTitle:item.passage?.section.witness.classic.title,sectionTitle:item.passage?.section.title });
interface BaseRecord { id: string; slug: string; aliases: string[]; summary: string; categories: string[]; editorialStatus: EditorialStatus; lastReviewedAt: Date | null }

async function common(entity: BaseRecord, type: KnowledgeEntityType) {
  const [relations, citations, interpretations, graph] = await Promise.all([knowledgeRepository.relationsFor(graphUpper[type], entity.id), knowledgeRepository.citationsFor(upper[type], entity.id), knowledgeRepository.interpretationsFor(upper[type], entity.id), getGraph()]);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  return {
    id: entity.id, entityType: type, slug: entity.slug, aliases: entity.aliases, summary: entity.summary, categories: entity.categories,
    relatedEntities: relations.map((relation) => { const outgoing = relation.sourceId === entity.id; const otherId = outgoing ? relation.targetId : relation.sourceId; const other = nodeById.get(otherId); return { id: relation.id, type: relation.relationType, label: relation.relationType, direction: outgoing ? "outgoing" as const : "incoming" as const, entityType: other?.entityType ?? "unknown", entityId: otherId, title: other?.title ?? "条目正在整理", href: other?.href, evidenceStatus: relation.evidenceStatus, note: relation.note ?? undefined, sourceNote: relation.sourceNote ?? undefined, references: relation.citations.map(mapCitation) }; }),
    references: citations.map(mapCitation), interpretations: interpretations.map((item) => ({ id: item.id, title: item.title, summary: item.summary, attribution: item.attributedToPerson?.name ?? item.attributedToSchool?.name ?? undefined, period: item.period ?? undefined, evidenceStatus: item.evidenceStatus, references: item.citations.map(mapCitation) })), graphNodeId: entity.id, editorialStatus: entity.editorialStatus, lastReviewedAt: entity.lastReviewedAt ?? undefined,
  };
}

export async function getKnowledgeEntry(type: KnowledgeEntityType, slug: string): Promise<KnowledgeEntry | null> {
  if (type === "concept") { const item=await knowledgeRepository.findConcept(slug); if(!item)return null; return { ...(await common(item,type)), title:item.name, dynasty:item.dynastyId??undefined, definition:item.definition??undefined, historicalContext:item.historicalContext??undefined, development:asArray<KnowledgeDevelopmentSection>(item.development), keyIdeas:asArray<KnowledgePoint>(item.keyIdeas), researchNotes:asArray<ResearchNote>(item.researchNotes) }; }
  if (type === "classic") { const item=await knowledgeRepository.findClassic(slug); if(!item)return null; return { ...(await common(item,type)), title:item.title, period:item.period??undefined, historicalContext:item.historicalContext??undefined, development:[], keyIdeas:item.themes.map(title=>({title})), researchNotes:[], authorDisplay:item.authorDisplay??undefined, attributionStatus:item.attributionStatus, influence:item.influence??undefined }; }
  if (type === "person") { const item=await knowledgeRepository.findPerson(slug); if(!item)return null; return { ...(await common(item,type)), title:item.name, period:item.period??undefined, historicalContext:item.historicalContext??undefined, development:[], keyIdeas:asArray<KnowledgePoint>(item.keyIdeas), researchNotes:[], role:item.role??undefined, influence:item.influence??undefined }; }
  if (type === "school") { const item=await knowledgeRepository.findSchool(slug); if(!item)return null; return { ...(await common(item,type)), title:item.name, period:item.period??undefined, historicalContext:item.historicalContext??undefined, development:asArray<KnowledgeDevelopmentSection>(item.development), keyIdeas:asArray<KnowledgePoint>(item.keyIdeas), researchNotes:[], coreQuestions:item.coreQuestions, editorialNote:item.editorialNote??undefined }; }
  const item=await knowledgeRepository.findTechnique(slug); if(!item)return null; return { ...(await common(item,type)), title:item.name, period:item.period??undefined, definition:item.definition??undefined, historicalContext:item.historicalContext??undefined, development:asArray<KnowledgeDevelopmentSection>(item.development), keyIdeas:asArray<KnowledgePoint>(item.keyIdeas), researchNotes:[], toolPath:item.toolPath??undefined };
}

export const knowledgeService = { getEntry: getKnowledgeEntry, listConcepts: knowledgeRepository.listConcepts, listClassics: knowledgeRepository.listClassics, listPeople: knowledgeRepository.listPeople, listSchools: knowledgeRepository.listSchools, listTechniques: knowledgeRepository.listTechniques };
