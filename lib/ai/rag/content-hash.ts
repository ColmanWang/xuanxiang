import { createHash } from "node:crypto";
import type { RagDocument } from "../types";

export function computeRagContentHash(document: RagDocument): string {
  const semantic = { entityType: document.entityType, entityId: document.entityId, section: document.section, text: document.text.normalize("NFC"), sourceType: document.sourceType, citationIds: [...document.citationIds].sort(), passageId: document.passageId ?? null, classicId: document.classicId ?? null, editorialStatus: document.editorialStatus, publicationStatus: document.publicationStatus, evidenceStatus: document.evidenceStatus ?? null };
  return createHash("sha256").update(JSON.stringify(semantic)).digest("hex");
}
