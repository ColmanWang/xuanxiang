import type { EditorialStatus } from "@prisma/client";
import type { EditorialEntity, EditorialEntityType } from "./types";

interface EditorialRecord {
  id: string;
  slug: string;
  aliases: readonly string[];
  summary: string;
  editorialStatus: EditorialStatus;
  updatedAt: Date;
  name?: string;
  title?: string;
}

export function adaptEditorialEntity(type: EditorialEntityType, record: EditorialRecord): EditorialEntity {
  const title = record.name ?? record.title;
  if (!title) throw new TypeError(`Missing display title for ${type}:${record.id}`);
  return {
    id: record.id,
    type,
    slug: record.slug,
    title,
    aliases: [...record.aliases],
    summary: record.summary,
    editorialStatus: record.editorialStatus,
    revision: record.updatedAt.toISOString(),
  };
}
