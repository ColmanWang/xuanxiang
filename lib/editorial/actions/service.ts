import type { EditorialObjectType, GraphEntityType, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateRelations } from "@/lib/services/relation-validation-service";
import { EditorialActionError } from "./errors";
import { assertEditorialStudioEnabled } from "./gate";
import {
  citationInputSchema, classicInputSchema, conceptInputSchema, interpretationInputSchema,
  passageInputSchema, personInputSchema, relationInputSchema, schoolInputSchema,
  sectionInputSchema, sourceInputSchema, techniqueInputSchema, witnessInputSchema,
} from "./schemas";

type Transaction = Prisma.TransactionClient;
type JsonRecord = Readonly<Record<string, unknown>>;
const dataCategory = "PRODUCTION_CONTENT" as const;

function snapshot(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function changedFields(before: JsonRecord | null, after: JsonRecord): string[] {
  if (!before) return Object.keys(after).sort();
  return Object.keys(after).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])).sort();
}

async function audit(tx: Transaction, entityType: EditorialObjectType, entityId: string, action: "CREATE" | "UPDATE" | "STATUS_CHANGE" | "REVIEW" | "ARCHIVE", before: JsonRecord | null, after: JsonRecord) {
  await tx.editorialAuditLog.create({ data: { entityType, entityId, action, changeSummary: { fields: changedFields(before, after) }, beforeSnapshot: before ? snapshot(before) : undefined, afterSnapshot: snapshot(after) } });
}

function parse<T>(schema: { safeParse(value: unknown): { success: true; data: T } | { success: false; error: { flatten(): { fieldErrors: Record<string, string[] | undefined> } } } }, input: unknown): T {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const [field, messages] = Object.entries(result.error.flatten().fieldErrors)[0] ?? [];
  throw new EditorialActionError("VALIDATION_FAILED", messages?.[0] ?? "输入内容未通过校验。", field);
}

export async function assertRevision(current: { updatedAt: Date } | null, expected?: Date) {
  if (!current) throw new EditorialActionError("NOT_FOUND", "编辑对象不存在或已被移除。");
  if (expected && current.updatedAt.getTime() !== expected.getTime()) throw new EditorialActionError("EDITORIAL_CONFLICT", "该内容已在其他位置更新，请刷新后比较修改。", undefined, { currentUpdatedAt: current.updatedAt.toISOString() });
}

async function subjectExists(tx: Transaction, type: string, entityId: string): Promise<boolean> {
  switch (type) {
    case "CONCEPT": return Boolean(await tx.concept.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "CLASSIC": return Boolean(await tx.classic.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "PERSON": return Boolean(await tx.person.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "SCHOOL": return Boolean(await tx.school.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "TECHNIQUE": return Boolean(await tx.technique.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "DYNASTY": return Boolean(await tx.dynasty.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "RELATION": return Boolean(await tx.relation.findUnique({ where: { id: entityId }, select: { id: true } }));
    case "INTERPRETATION": return Boolean(await tx.interpretation.findUnique({ where: { id: entityId }, select: { id: true } }));
    default: return false;
  }
}

export function createEditorialWriteService(db: PrismaClient = prisma) {
  const ensureWriteAccess = () => assertEditorialStudioEnabled();
  return {
    async saveConcept(raw: unknown) {
      ensureWriteAccess();
      const input = parse(conceptInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.concept.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.concept.update({ where: { id }, data: fields }) : await tx.concept.create({ data: { ...fields, id, dataCategory, publicationStatus: "DRAFT" } }); await audit(tx, "CONCEPT", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async savePerson(raw: unknown) {
      ensureWriteAccess();
      const input = parse(personInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.person.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.person.update({ where: { id }, data: fields }) : await tx.person.create({ data: { ...fields, id, dataCategory, publicationStatus: "DRAFT" } }); await audit(tx, "PERSON", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveSchool(raw: unknown) {
      ensureWriteAccess();
      const input = parse(schoolInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.school.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.school.update({ where: { id }, data: fields }) : await tx.school.create({ data: { ...fields, id, dataCategory, publicationStatus: "DRAFT" } }); await audit(tx, "SCHOOL", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveClassic(raw: unknown) {
      ensureWriteAccess();
      const input = parse(classicInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.classic.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.classic.update({ where: { id }, data: fields }) : await tx.classic.create({ data: { ...fields, id, dataCategory, publicationStatus: "DRAFT" } }); await audit(tx, "CLASSIC", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveTechnique(raw: unknown) {
      ensureWriteAccess();
      const input = parse(techniqueInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.technique.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.technique.update({ where: { id }, data: fields }) : await tx.technique.create({ data: { ...fields, id, dataCategory, publicationStatus: "DRAFT" } }); await audit(tx, "TECHNIQUE", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveRelation(raw: unknown) {
      ensureWriteAccess();
      const input = parse(relationInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { await validateRelations(tx, [{ sourceType: input.sourceType as GraphEntityType, sourceId: input.sourceId, targetType: input.targetType as GraphEntityType, targetId: input.targetId }]).catch(() => { throw new EditorialActionError("RELATION_INTEGRITY_ERROR", "关系起点或终点不存在。"); }); const before = input.id ? await tx.relation.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.relation.update({ where: { id }, data: fields }) : await tx.relation.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "RELATION", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveSource(raw: unknown) {
      ensureWriteAccess();
      const input = parse(sourceInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.source.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.source.update({ where: { id }, data: fields }) : await tx.source.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "SOURCE", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveCitation(raw: unknown) {
      ensureWriteAccess();
      const input = parse(citationInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const [source, subject, passage] = await Promise.all([tx.source.findUnique({ where: { id: input.sourceId }, select: { id: true } }), subjectExists(tx, input.subjectType, input.subjectId), input.passageId ? tx.textPassage.findUnique({ where: { id: input.passageId }, select: { id: true, section: { select: { witness: { select: { sourceId: true } } } } } }) : null]); if (!source || !subject || (input.passageId && !passage)) throw new EditorialActionError("CITATION_INTEGRITY_ERROR", "Citation 的资料、引用对象或原典文句不存在。"); if (passage?.section.witness.sourceId && passage.section.witness.sourceId !== input.sourceId) throw new EditorialActionError("CITATION_INTEGRITY_ERROR", "所选 Passage 的版本来源与 Citation Source 不一致。"); const before = input.id ? await tx.citation.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.citation.update({ where: { id }, data: fields }) : await tx.citation.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "CITATION", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveInterpretation(raw: unknown) {
      ensureWriteAccess();
      const input = parse(interpretationInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { if (!await subjectExists(tx, input.subjectType, input.subjectId)) throw new EditorialActionError("VALIDATION_FAILED", "异说对应的知识条目不存在。", "subjectId"); const before = input.id ? await tx.interpretation.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.interpretation.update({ where: { id }, data: fields }) : await tx.interpretation.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "INTERPRETATION", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveWitness(raw: unknown) {
      ensureWriteAccess();
      const input = parse(witnessInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { if (!await tx.classic.findUnique({ where: { id: input.classicId }, select: { id: true } })) throw new EditorialActionError("NOT_FOUND", "典籍不存在。"); if (input.isPrimary) { const another = await tx.textWitness.findFirst({ where: { classicId: input.classicId, isPrimary: true, NOT: { id } }, select: { id: true } }); if (another) throw new EditorialActionError("DEPENDENCY_CONFLICT", "该典籍已存在主要版本，请先调整原主要版本。", "isPrimary", { witnessId: another.id }); } const before = input.id ? await tx.textWitness.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.textWitness.update({ where: { id }, data: fields }) : await tx.textWitness.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "TEXT_WITNESS", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async saveSection(raw: unknown) {
      ensureWriteAccess();
      const input = parse(sectionInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { if (input.parentId === id) throw new EditorialActionError("VALIDATION_FAILED", "章节不能成为自己的父节点。", "parentId"); const parent = input.parentId ? await tx.textSection.findUnique({ where: { id: input.parentId }, select: { id: true, witnessId: true, parentId: true } }) : null; if (input.parentId && (!parent || parent.witnessId !== input.witnessId)) throw new EditorialActionError("VALIDATION_FAILED", "父章节不存在或不属于同一版本。", "parentId"); let cursor = parent; while (cursor?.parentId) { if (cursor.parentId === id) throw new EditorialActionError("VALIDATION_FAILED", "移动章节会形成循环。", "parentId"); cursor = await tx.textSection.findUnique({ where: { id: cursor.parentId }, select: { id: true, witnessId: true, parentId: true } }); } const before = input.id ? await tx.textSection.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const { expectedUpdatedAt: _, ...fields } = input; void _; const after = before ? await tx.textSection.update({ where: { id }, data: fields }) : await tx.textSection.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "TEXT_SECTION", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async savePassage(raw: unknown) {
      ensureWriteAccess();
      const input = parse(passageInputSchema, raw); const id = input.id ?? crypto.randomUUID();
      return db.$transaction(async (tx) => { const before = input.id ? await tx.textPassage.findUnique({ where: { id } }) : null; if (input.id) await assertRevision(before, input.expectedUpdatedAt); const sourceTextChanged = before?.contentType === "SOURCE_TEXT" && before.text !== input.text; if (sourceTextChanged && !input.confirmSourceTextChange) throw new EditorialActionError("SOURCE_TEXT_CONFIRMATION_REQUIRED", "原典证据层文本发生变化，请查看 Diff 并明确确认。", "confirmSourceTextChange", { before: before.text, after: input.text }); const { expectedUpdatedAt: _, confirmSourceTextChange: __, ...fields } = input; void _; void __; const after = before ? await tx.textPassage.update({ where: { id }, data: fields }) : await tx.textPassage.create({ data: { ...fields, id, dataCategory } }); await audit(tx, "TEXT_PASSAGE", id, before ? "UPDATE" : "CREATE", before, after); return after; });
    },
    async markReviewed(entityType: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", entityId: string, expectedUpdatedAt: Date) {
      ensureWriteAccess();
      return db.$transaction(async (tx) => {
        const access = { CONCEPT: tx.concept, PERSON: tx.person, SCHOOL: tx.school, CLASSIC: tx.classic, TECHNIQUE: tx.technique } as const;
        const model = access[entityType] as unknown as { findUnique(args: object): Promise<JsonRecord | null>; update(args: object): Promise<JsonRecord> };
        const before = await model.findUnique({ where: { id: entityId } }); await assertRevision(before as { updatedAt: Date } | null, expectedUpdatedAt);
        const citationCount = await tx.citation.count({ where: { subjectType: entityType, subjectId: entityId } });
        if (citationCount === 0) throw new EditorialActionError("CITATION_INTEGRITY_ERROR", "标记为已校订前至少需要一条正式 Citation。");
        const after = await model.update({ where: { id: entityId }, data: { editorialStatus: "REVIEWED", lastReviewedAt: new Date() } });
        await audit(tx, entityType, entityId, "REVIEW", before, after); return after;
      });
    },
    async archiveEntity(entityType: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", entityId: string, expectedUpdatedAt: Date) {
      ensureWriteAccess();
      return db.$transaction(async (tx) => {
        const relationCount = await tx.relation.count({ where: { OR: [{ sourceType: entityType, sourceId: entityId }, { targetType: entityType, targetId: entityId }] } });
        const citationCount = await tx.citation.count({ where: { subjectType: entityType, subjectId: entityId } });
        const passageLinkCount = await tx.passageEntityLink.count({ where: { entityType, entityId } });
        const access = { CONCEPT: tx.concept, PERSON: tx.person, SCHOOL: tx.school, CLASSIC: tx.classic, TECHNIQUE: tx.technique } as const;
        const model = access[entityType] as unknown as { findUnique(args: object): Promise<JsonRecord | null>; update(args: object): Promise<JsonRecord> };
        const before = await model.findUnique({ where: { id: entityId } }); await assertRevision(before as { updatedAt: Date } | null, expectedUpdatedAt);
        const after = await model.update({ where: { id: entityId }, data: { publicationStatus: "ARCHIVED" } });
        await audit(tx, entityType, entityId, "ARCHIVE", before, after); return { entity: after, impact: { relationCount, citationCount, passageLinkCount } };
      });
    },
    async setPublicationStatus(entityType: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", entityId: string, publicationStatus: "DRAFT" | "PUBLISHED", expectedUpdatedAt: Date) {
      ensureWriteAccess();
      return db.$transaction(async (tx) => {
        const access = { CONCEPT: tx.concept, PERSON: tx.person, SCHOOL: tx.school, CLASSIC: tx.classic, TECHNIQUE: tx.technique } as const;
        const model = access[entityType] as unknown as { findUnique(args: object): Promise<JsonRecord | null>; update(args: object): Promise<JsonRecord> };
        const before = await model.findUnique({ where: { id: entityId } }); await assertRevision(before as { updatedAt: Date } | null, expectedUpdatedAt);
        const after = await model.update({ where: { id: entityId }, data: { publicationStatus } });
        await audit(tx, entityType, entityId, "STATUS_CHANGE", before, after); return after;
      });
    },
  };
}

export const editorialWriteService = createEditorialWriteService();
