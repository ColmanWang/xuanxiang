import type { Prisma, PrismaClient } from "@prisma/client";
import { STANDARD_ZIPING } from "@/lib/bazi/rules";
import { LIUYAO_RULE_REFERENCES } from "@/lib/liuyao/rule-references";
import { STANDARD_WENWANG_GUA } from "@/lib/liuyao/rules";
import { canonicalizeContentExport } from "./export";
import type { ContentEntityRecord, ContentExport, ContentRuleProvenanceRecord } from "./types";
import { CONTENT_SCHEMA_VERSION } from "./types";

type ContentDb = PrismaClient | Prisma.TransactionClient;

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== null && item !== undefined)) as T;
}
function stripRuntimeFields<T extends { createdAt: unknown; updatedAt: unknown }>(record: T): Omit<T, "createdAt" | "updatedAt"> {
  const { createdAt, updatedAt, ...content } = record;
  void createdAt; void updatedAt;
  return content;
}

function ruleProvenance(): ContentRuleProvenanceRecord[] {
  return [
    ...STANDARD_ZIPING.references.map((reference) => ({ system: "BAZI" as const, policyId: reference.policyId, status: reference.citationIds.length ? "SOURCED" as const : "UNSOURCED_WITH_EDITORIAL_NOTE" as const, citationIds: [...reference.citationIds], editorialNote: reference.note, stable: STANDARD_ZIPING.status === "STABLE" })),
    ...LIUYAO_RULE_REFERENCES.map((reference) => ({ system: "LIUYAO" as const, policyId: reference.policyId, status: reference.citationIds.length ? "SOURCED" as const : "UNSOURCED_WITH_EDITORIAL_NOTE" as const, citationIds: [...reference.citationIds], editorialNote: reference.scopeNote, stable: STANDARD_WENWANG_GUA.status === "STABLE" })),
  ];
}

export async function exportKnowledgeBase(db: ContentDb): Promise<ContentExport> {
  const [concepts, classics, people, schools, techniques, dynasties, relations, sources, citations, interpretations, witnesses, sections, passages, passageEntityLinks] = await Promise.all([
    db.concept.findMany(), db.classic.findMany(), db.person.findMany(), db.school.findMany(), db.technique.findMany(), db.dynasty.findMany(),
    db.relation.findMany(), db.source.findMany(), db.citation.findMany(), db.interpretation.findMany(), db.textWitness.findMany(), db.textSection.findMany(), db.textPassage.findMany(), db.passageEntityLink.findMany(),
  ]);
  const entities: ContentEntityRecord[] = [
    ...concepts.map((row) => { const { id, name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, ...fields } = stripRuntimeFields(row); return { id, type: "CONCEPT" as const, title: name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, fields: compact(fields) }; }),
    ...classics.map((row) => { const { id, title, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, ...fields } = stripRuntimeFields(row); return { id, type: "CLASSIC" as const, title, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, fields: compact(fields) }; }),
    ...people.map((row) => { const { id, name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, ...fields } = stripRuntimeFields(row); return { id, type: "PERSON" as const, title: name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, fields: compact(fields) }; }),
    ...schools.map((row) => { const { id, name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, ...fields } = stripRuntimeFields(row); return { id, type: "SCHOOL" as const, title: name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, fields: compact(fields) }; }),
    ...techniques.map((row) => { const { id, name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, ...fields } = stripRuntimeFields(row); return { id, type: "TECHNIQUE" as const, title: name, slug, aliases, summary, editorialStatus, dataCategory, publicationStatus, fields: compact(fields) }; }),
    ...dynasties.map((row) => { const { id, name, slug, summary, editorialStatus, dataCategory, ...fields } = stripRuntimeFields(row); return { id, type: "DYNASTY" as const, title: name, slug, aliases: [], summary: summary ?? "", editorialStatus, dataCategory, fields: compact(fields) }; }),
  ];
  return canonicalizeContentExport({
    schemaVersion: CONTENT_SCHEMA_VERSION,
    entities,
    relations: relations.map((row) => { const { legacySources, ...record } = stripRuntimeFields(row); void legacySources; return record; }),
    sources: sources.map(stripRuntimeFields),
    citations: citations.map(stripRuntimeFields),
    interpretations: interpretations.map(stripRuntimeFields),
    witnesses: witnesses.map((row) => { const { editor, publisher, publicationYear, description, ...record } = stripRuntimeFields(row); return { ...record, fields: compact({ editor, publisher, publicationYear, description }) }; }),
    sections: sections.map((row) => { const { parentId, ...record } = stripRuntimeFields(row); return compact({ ...record, parentId: parentId ?? undefined }); }),
    passages: passages.map((row) => { const { normalizedText, ...record } = stripRuntimeFields(row); return compact({ ...record, normalizedText: normalizedText ?? undefined }); }),
    passageEntityLinks: passageEntityLinks.map((row) => { const { note, ...record } = stripRuntimeFields(row); return compact({ ...record, note: note ?? undefined }); }),
    ruleProvenance: ruleProvenance(),
  });
}

function value<T>(fields: Readonly<Record<string, unknown>> | undefined, key: string): T | undefined { return fields?.[key] as T | undefined; }
function json(value: unknown): Prisma.InputJsonValue | undefined { return value === null || value === undefined ? undefined : value as Prisma.InputJsonValue; }

export async function applyKnowledgeBase(db: ContentDb, content: ContentExport): Promise<void> {
  const entitiesByDependency = [...content.entities].sort((left, right) => Number(right.type === "DYNASTY") - Number(left.type === "DYNASTY"));
  for (const entity of entitiesByDependency) {
    const common = { id: entity.id, slug: entity.slug, aliases: entity.aliases, summary: entity.summary, editorialStatus: entity.editorialStatus, dataCategory: entity.dataCategory, publicationStatus: entity.publicationStatus };
    if (entity.type === "CONCEPT") { const data = { ...common, name: entity.title, categories: value<string[]>(entity.fields, "categories") ?? [], definition: value<string>(entity.fields, "definition"), historicalContext: value<string>(entity.fields, "historicalContext"), development: json(value(entity.fields, "development")), keyIdeas: json(value(entity.fields, "keyIdeas")), researchNotes: json(value(entity.fields, "researchNotes")), content: value<string>(entity.fields, "content"), dynastyId: value<string>(entity.fields, "dynastyId"), lastReviewedAt: value<Date>(entity.fields, "lastReviewedAt") }; await db.concept.upsert({ where: { id: entity.id }, create: data, update: data }); }
    if (entity.type === "CLASSIC") { const data = { ...common, title: entity.title, categories: value<string[]>(entity.fields, "categories") ?? [], authorDisplay: value<string>(entity.fields, "authorDisplay"), attributionStatus: value<"CERTAIN" | "TRADITIONAL" | "CONTESTED" | "ANONYMOUS" | "COMPOSITE" | "UNKNOWN">(entity.fields, "attributionStatus") ?? "UNKNOWN", period: value<string>(entity.fields, "period"), contentStructure: json(value(entity.fields, "contentStructure")), themes: value<string[]>(entity.fields, "themes") ?? [], historicalContext: value<string>(entity.fields, "historicalContext"), influence: value<string>(entity.fields, "influence"), dynastyId: value<string>(entity.fields, "dynastyId"), lastReviewedAt: value<Date>(entity.fields, "lastReviewedAt") }; await db.classic.upsert({ where: { id: entity.id }, create: data, update: data }); }
    if (entity.type === "PERSON") { const data = { ...common, name: entity.title, categories: value<string[]>(entity.fields, "categories") ?? [], birthYear: value<number>(entity.fields, "birthYear"), deathYear: value<number>(entity.fields, "deathYear"), period: value<string>(entity.fields, "period"), role: value<string>(entity.fields, "role"), keyIdeas: json(value(entity.fields, "keyIdeas")), historicalContext: value<string>(entity.fields, "historicalContext"), influence: value<string>(entity.fields, "influence"), lastReviewedAt: value<Date>(entity.fields, "lastReviewedAt") }; await db.person.upsert({ where: { id: entity.id }, create: data, update: data }); }
    if (entity.type === "SCHOOL") { const data = { ...common, name: entity.title, categories: value<string[]>(entity.fields, "categories") ?? [], period: value<string>(entity.fields, "period"), coreQuestions: value<string[]>(entity.fields, "coreQuestions") ?? [], keyIdeas: json(value(entity.fields, "keyIdeas")), historicalContext: value<string>(entity.fields, "historicalContext"), development: json(value(entity.fields, "development")), editorialNote: value<string>(entity.fields, "editorialNote"), classificationStatus: value<"DOCUMENTED" | "TRADITIONAL" | "INFERRED" | "CONTESTED">(entity.fields, "classificationStatus") ?? "INFERRED", lastReviewedAt: value<Date>(entity.fields, "lastReviewedAt") }; await db.school.upsert({ where: { id: entity.id }, create: data, update: data }); }
    if (entity.type === "TECHNIQUE") { const data = { ...common, name: entity.title, category: value<string>(entity.fields, "category") ?? "未分类", categories: value<string[]>(entity.fields, "categories") ?? [], period: value<string>(entity.fields, "period"), definition: value<string>(entity.fields, "definition"), historicalContext: value<string>(entity.fields, "historicalContext"), development: json(value(entity.fields, "development")), keyIdeas: json(value(entity.fields, "keyIdeas")), toolPath: value<string>(entity.fields, "toolPath"), lastReviewedAt: value<Date>(entity.fields, "lastReviewedAt") }; await db.technique.upsert({ where: { id: entity.id }, create: data, update: data }); }
    if (entity.type === "DYNASTY") { const data = { id: entity.id, name: entity.title, slug: entity.slug, summary: entity.summary || undefined, editorialStatus: entity.editorialStatus, dataCategory: entity.dataCategory, startYear: value<number>(entity.fields, "startYear"), endYear: value<number>(entity.fields, "endYear") }; await db.dynasty.upsert({ where: { id: entity.id }, create: data, update: data }); }
  }
  for (const source of content.sources) await db.source.upsert({ where: { id: source.id }, create: source, update: source });
  for (const relation of content.relations) await db.relation.upsert({ where: { id: relation.id }, create: relation, update: relation });
  for (const interpretation of content.interpretations) await db.interpretation.upsert({ where: { id: interpretation.id }, create: interpretation, update: interpretation });
  for (const witness of content.witnesses) { const data = { id: witness.id, classicId: witness.classicId, sourceId: witness.sourceId, title: witness.title, shortTitle: witness.shortTitle, editionType: witness.editionType, isPrimary: witness.isPrimary, editorialStatus: witness.editorialStatus, dataCategory: witness.dataCategory, editor: value<string>(witness.fields, "editor"), publisher: value<string>(witness.fields, "publisher"), publicationYear: value<number>(witness.fields, "publicationYear"), description: value<string>(witness.fields, "description") }; await db.textWitness.upsert({ where: { id: witness.id }, create: data, update: data }); }
  for (const section of content.sections) { const data = { ...section, parentId: undefined }; await db.textSection.upsert({ where: { id: section.id }, create: data, update: data }); }
  for (const section of content.sections.filter((item) => item.parentId)) await db.textSection.update({ where: { id: section.id }, data: { parentId: section.parentId } });
  for (const passage of content.passages) await db.textPassage.upsert({ where: { id: passage.id }, create: passage, update: passage });
  for (const link of content.passageEntityLinks) await db.passageEntityLink.upsert({ where: { id: link.id }, create: link, update: link });
  for (const citation of content.citations) await db.citation.upsert({ where: { id: citation.id }, create: citation, update: citation });
}
