import type { GraphEntityType } from "@prisma/client";

export interface RelationEndpoint {
  sourceType: GraphEntityType;
  sourceId: string;
  targetType: GraphEntityType;
  targetId: string;
}

interface FindModel { findUnique(args: { where: { id: string }; select: { id: true } }): Promise<{ id: string } | null> }
interface EntityReader { concept: FindModel; classic: FindModel; person: FindModel; school: FindModel; technique: FindModel; dynasty: FindModel }

async function exists(db: EntityReader, type: GraphEntityType, id: string) {
  switch (type) {
    case "CONCEPT": return Boolean(await db.concept.findUnique({ where: { id }, select: { id: true } }));
    case "CLASSIC": return Boolean(await db.classic.findUnique({ where: { id }, select: { id: true } }));
    case "PERSON": return Boolean(await db.person.findUnique({ where: { id }, select: { id: true } }));
    case "SCHOOL": return Boolean(await db.school.findUnique({ where: { id }, select: { id: true } }));
    case "TECHNIQUE": return Boolean(await db.technique.findUnique({ where: { id }, select: { id: true } }));
    case "DYNASTY": return Boolean(await db.dynasty.findUnique({ where: { id }, select: { id: true } }));
  }
}

export async function validateRelations(db: EntityReader, relations: RelationEndpoint[]) {
  for (const relation of relations) {
    const [sourceExists, targetExists] = await Promise.all([
      exists(db, relation.sourceType, relation.sourceId),
      exists(db, relation.targetType, relation.targetId),
    ]);
    if (!sourceExists || !targetExists) {
      throw new Error(`Invalid relation endpoint: ${relation.sourceType}:${relation.sourceId} -> ${relation.targetType}:${relation.targetId}`);
    }
  }
}
