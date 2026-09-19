import type { ContentEntityRecord, ContentExport } from "@/lib/content/types";
import { contentHash } from "./hash";
import type { IndexableDocument, RagDocumentKind } from "./types";

const acceptedEditorial = new Set(["BASIC", "SOURCED", "REVIEWED"]);
const sectionLabels: Record<string, string> = { definition: "释义", historicalContext: "源流", development: "演变", keyIdeas: "核心观点", content: "正文" };

function isPublic(record: { editorialStatus: string; dataCategory?: string; publicationStatus?: string }): boolean {
  return record.dataCategory === "PRODUCTION_CONTENT" && record.publicationStatus === "PUBLISHED" && acceptedEditorial.has(record.editorialStatus);
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(stringify).filter(Boolean).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(stringify).filter(Boolean).join("\n");
  return value == null ? "" : String(value);
}

function entityKind(type: string): RagDocumentKind {
  return ({ CLASSIC: "CLASSIC_SUMMARY", PERSON: "PERSON_SUMMARY", SCHOOL: "SCHOOL_SUMMARY", TECHNIQUE: "TECHNIQUE_SUMMARY" } as const)[type as "CLASSIC"] ?? "KNOWLEDGE_ENTRY";
}

function entityDocuments(entity: ContentEntityRecord, citationIds: string[]): IndexableDocument[] {
  const sections: Array<[string, string]> = [["summary", entity.summary.trim()]];
  for (const key of Object.keys(sectionLabels)) {
    const text = stringify(entity.fields?.[key]);
    if (text) sections.push([key, text]);
  }
  return sections.filter(([, text]) => Boolean(text)).map(([section, text]) => ({
    documentId: `entity:${entity.type}:${entity.id}:${section}`, type: entityKind(entity.type), entityType: entity.type,
    entityId: entity.id, section: sectionLabels[section] ?? "概要", text: section === "summary" ? `${entity.title}\n${text}` : `${entity.title}｜${sectionLabels[section]}\n${text}`,
    sourceType: "EDITORIAL_KNOWLEDGE", citationIds, editorialStatus: entity.editorialStatus,
    publicationStatus: entity.publicationStatus ?? "DRAFT", contentHash: "",
  })).map((document) => ({ ...document, contentHash: contentHash(document.text) }));
}

export function buildIndexableDocuments(content: ContentExport): IndexableDocument[] {
  const publicEntities = content.entities.filter(isPublic);
  const entityByKey = new Map(publicEntities.map((entity) => [`${entity.type}:${entity.id}`, entity]));
  const citationsBySubject = new Map<string, string[]>();
  for (const citation of content.citations.filter((item) => item.dataCategory === "PRODUCTION_CONTENT")) {
    const key = `${citation.subjectType}:${citation.subjectId}`;
    citationsBySubject.set(key, [...(citationsBySubject.get(key) ?? []), citation.id]);
  }
  const documents = publicEntities.flatMap((entity) => entityDocuments(entity, citationsBySubject.get(`${entity.type}:${entity.id}`) ?? []));

  for (const interpretation of content.interpretations) {
    const parent = entityByKey.get(`${interpretation.subjectType}:${interpretation.subjectId}`);
    if (!parent || interpretation.dataCategory !== "PRODUCTION_CONTENT" || !acceptedEditorial.has(interpretation.editorialStatus)) continue;
    const text = `${interpretation.title}\n${interpretation.summary}`.trim();
    const citationIds = content.citations.filter((citation) => citation.interpretationId === interpretation.id && citation.dataCategory === "PRODUCTION_CONTENT").map((citation) => citation.id).sort();
    documents.push({ documentId: `interpretation:${interpretation.id}`, type: "INTERPRETATION", entityType: interpretation.subjectType, entityId: interpretation.id, section: "解释", text, sourceType: "EDITORIAL_INTERPRETATION", citationIds, editorialStatus: interpretation.editorialStatus, publicationStatus: parent.publicationStatus ?? "DRAFT", evidenceStatus: interpretation.evidenceStatus, contentHash: contentHash(text) });
  }

  const sections = new Map(content.sections.filter((item) => item.dataCategory === "PRODUCTION_CONTENT").map((item) => [item.id, item]));
  const witnesses = new Map(content.witnesses.filter((item) => item.dataCategory === "PRODUCTION_CONTENT" && acceptedEditorial.has(item.editorialStatus)).map((item) => [item.id, item]));
  for (const passage of content.passages) {
    const section = sections.get(passage.sectionId); const witness = section ? witnesses.get(section.witnessId) : undefined;
    const classic = witness ? entityByKey.get(`CLASSIC:${witness.classicId}`) : undefined;
    if (!section || !witness || !classic || passage.dataCategory !== "PRODUCTION_CONTENT" || !acceptedEditorial.has(passage.editorialStatus)) continue;
    const citationIds = content.citations.filter((citation) => citation.passageId === passage.id && citation.dataCategory === "PRODUCTION_CONTENT").map((citation) => citation.id).sort();
    documents.push({ documentId: `passage:${passage.id}`, type: "PASSAGE", entityType: "PASSAGE", entityId: passage.id, section: section.title, text: passage.text.trim(), sourceType: "PRIMARY_TEXT", citationIds, passageId: passage.id, classicId: witness.classicId, editorialStatus: passage.editorialStatus, publicationStatus: "PUBLISHED", contentHash: contentHash(passage.text) });
  }
  return documents.sort((a, b) => a.documentId.localeCompare(b.documentId, "en"));
}
