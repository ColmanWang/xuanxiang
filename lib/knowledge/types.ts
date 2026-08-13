import type { EditorialStatus, EvidenceStatus, RelationType } from "@prisma/client";

export type KnowledgeEntityType = "concept" | "classic" | "person" | "school" | "technique";

export interface KnowledgeDevelopmentSection { period: string; summary: string }
export interface KnowledgePoint { title: string; description?: string }
export interface ReferenceView { id: string; sourceTitle: string; sourceType: string; author?: string; period?: string; locator?: string; note?: string; evidenceStatus: EvidenceStatus; passageId?:string; readerHref?:string; classicTitle?:string; sectionTitle?:string }
export interface KnowledgeRelationView { id: string; type: RelationType; label: string; direction: "outgoing" | "incoming"; entityType: string; entityId: string; title: string; href?: string; evidenceStatus: EvidenceStatus; note?: string; sourceNote?: string; references: ReferenceView[] }
export interface ResearchNote { title: string; summary: string }
export interface InterpretationView { id: string; title: string; summary: string; attribution?: string; period?: string; evidenceStatus: EvidenceStatus; references: ReferenceView[] }

export interface KnowledgeEntry {
  id: string;
  entityType: KnowledgeEntityType;
  slug: string;
  title: string;
  aliases: string[];
  summary: string;
  period?: string;
  dynasty?: string;
  categories: string[];
  definition?: string;
  historicalContext?: string;
  development: KnowledgeDevelopmentSection[];
  keyIdeas: KnowledgePoint[];
  relatedEntities: KnowledgeRelationView[];
  references: ReferenceView[];
  interpretations: InterpretationView[];
  researchNotes: ResearchNote[];
  graphNodeId: string;
  editorialStatus: EditorialStatus;
  lastReviewedAt?: Date;
  authorDisplay?: string;
  attributionStatus?: string;
  role?: string;
  influence?: string;
  coreQuestions?: string[];
  editorialNote?: string;
  toolPath?: string;
}
