import type { KnowledgeEntityType } from "@prisma/client";

interface Model { findUnique(args: { where: { id: string }; select: { id: true } }): Promise<{ id: string } | null> }
interface Reader { concept: Model; classic: Model; person: Model; school: Model; technique: Model; textPassage: Model }
export interface PassageLinkEndpoint { passageId: string; entityType: KnowledgeEntityType; entityId: string }

export async function validatePassageEntityLinks(db: Reader, links: PassageLinkEndpoint[]) {
  for (const link of links) {
    const model = link.entityType === "CONCEPT" ? db.concept : link.entityType === "CLASSIC" ? db.classic : link.entityType === "PERSON" ? db.person : link.entityType === "SCHOOL" ? db.school : db.technique;
    const [passage, entity] = await Promise.all([db.textPassage.findUnique({ where: { id: link.passageId }, select: { id: true } }), model.findUnique({ where: { id: link.entityId }, select: { id: true } })]);
    if (!passage || !entity) throw new Error(`Invalid passage link: ${link.passageId} -> ${link.entityType}:${link.entityId}`);
  }
}
