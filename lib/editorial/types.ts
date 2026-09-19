import type { DataCategory, EditorialStatus } from "@prisma/client";

export type EditorialEntityType = "CONCEPT" | "CLASSIC" | "PERSON" | "SCHOOL" | "TECHNIQUE";

export interface EditorialEntity {
  id: string;
  type: EditorialEntityType;
  slug: string;
  title: string;
  aliases: readonly string[];
  summary: string;
  editorialStatus: EditorialStatus;
  revision: string;
}

export type ContentDataCategory = DataCategory;
