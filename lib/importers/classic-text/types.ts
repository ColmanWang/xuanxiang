import type { EditorialStatus, EditionType, EvidenceStatus, KnowledgeEntityType, PassageContentType, PassageLinkType } from "@prisma/client";

export interface PassageLinkImport {
  id: string;
  entityType: KnowledgeEntityType;
  entityId: string;
  linkType: PassageLinkType;
  note?: string;
  evidenceStatus: EvidenceStatus;
}

export interface PassageImport {
  id: string;
  ordinal: number;
  text: string;
  normalizedText?: string;
  contentType?: PassageContentType;
  editorialStatus?: EditorialStatus;
  links?: PassageLinkImport[];
}

export interface SectionImport {
  id: string;
  slug: string;
  title: string;
  ordinal: number;
  sectionType: string;
  parentId?: string;
  passages?: PassageImport[];
  children?: SectionImport[];
}

export interface ClassicTextImportPayload {
  classicSlug: string;
  witness: {
    id: string;
    title: string;
    shortTitle?: string;
    sourceId?: string;
    editionType: EditionType;
    editor?: string;
    publisher?: string;
    publicationYear?: number;
    description?: string;
    isPrimary?: boolean;
    editorialStatus?: EditorialStatus;
  };
  sections: SectionImport[];
}

export interface FlattenedSection extends Omit<SectionImport, "children"> {
  depth: number;
}
