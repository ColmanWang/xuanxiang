import type {
  CitationSubjectType, CitationType, DataCategory, EditorialStatus, EditionType, EvidenceStatus,
  GraphEntityType, KnowledgeEntityType, PassageContentType, PassageLinkType,
  PublicationStatus, RelationType, SourceType,
} from "@prisma/client";
import type { ContentDataCategory, EditorialEntityType } from "@/lib/editorial/types";

export const CONTENT_SCHEMA_VERSION = "1.0.0";
export type ContentEntityType = EditorialEntityType | "DYNASTY";

export interface ContentEntityRecord {
  id: string; type: ContentEntityType; slug: string; title: string; aliases: string[];
  summary: string; editorialStatus: EditorialStatus; updatedAt?: string;
  dataCategory?: ContentDataCategory; publicationStatus?: PublicationStatus; fields?: Readonly<Record<string, unknown>>;
}
export interface ContentRelationRecord { id: string; sourceType: GraphEntityType; sourceId: string; targetType: GraphEntityType; targetId: string; relationType: RelationType; evidenceStatus: EvidenceStatus; dataCategory?: DataCategory; note?: string | null; sourceNote?: string | null; }
export interface ContentSourceRecord { id: string; type: SourceType; title: string; dataCategory?: DataCategory; author?: string | null; dynastyOrYear?: string | null; publisher?: string | null; edition?: string | null; isbn?: string | null; url?: string | null; note?: string | null; }
export interface ContentCitationRecord { id: string; sourceId: string; subjectType: CitationSubjectType; subjectId: string; locator?: string | null; note?: string | null; citationType: CitationType; evidenceStatus: EvidenceStatus; dataCategory?: DataCategory; relationId?: string | null; interpretationId?: string | null; passageId?: string | null; }
export interface ContentInterpretationRecord { id: string; subjectType: KnowledgeEntityType; subjectId: string; title: string; summary: string; attributedToPersonId?: string | null; attributedToSchoolId?: string | null; period?: string | null; evidenceStatus: EvidenceStatus; editorialStatus: EditorialStatus; dataCategory?: DataCategory; }
export interface ContentWitnessRecord { id: string; classicId: string; sourceId?: string | null; title: string; shortTitle?: string | null; editionType: EditionType; isPrimary: boolean; editorialStatus: EditorialStatus; dataCategory?: DataCategory; fields?: Readonly<Record<string, unknown>>; }
export interface ContentSectionRecord { id: string; witnessId: string; parentId?: string; slug: string; title: string; ordinal: number; sectionType: string; depth: number; dataCategory?: DataCategory; }
export interface ContentPassageRecord { id: string; sectionId: string; ordinal: number; text: string; normalizedText?: string; contentType: PassageContentType; editorialStatus: EditorialStatus; dataCategory?: DataCategory; }
export interface ContentPassageEntityLinkRecord { id: string; passageId: string; entityType: KnowledgeEntityType; entityId: string; linkType: PassageLinkType; note?: string; evidenceStatus: EvidenceStatus; dataCategory?: DataCategory; }
export interface ContentRuleProvenanceRecord { system: "BAZI" | "LIUYAO"; policyId: string; status: "SOURCED" | "UNSOURCED_WITH_EDITORIAL_NOTE"; citationIds: string[]; editorialNote?: string; stable: boolean; }

export interface ContentExport {
  schemaVersion: string;
  entities: ContentEntityRecord[];
  relations: ContentRelationRecord[];
  sources: ContentSourceRecord[];
  citations: ContentCitationRecord[];
  interpretations: ContentInterpretationRecord[];
  witnesses: ContentWitnessRecord[];
  sections: ContentSectionRecord[];
  passages: ContentPassageRecord[];
  passageEntityLinks: ContentPassageEntityLinkRecord[];
  ruleProvenance?: ContentRuleProvenanceRecord[];
}

export interface ContentSnapshotManifest {
  schemaVersion: string; generatedAt: string; checksum: string;
  counts: { entities: number; relations: number; sources: number; citations: number; interpretations: number; witnesses: number; sections: number; passages: number; passageEntityLinks: number; };
}
