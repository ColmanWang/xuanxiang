export const RAG_INDEX_VERSION = "1.0.0";

export type RagDocumentKind = "KNOWLEDGE_ENTRY" | "PASSAGE" | "INTERPRETATION" | "CLASSIC_SUMMARY" | "PERSON_SUMMARY" | "SCHOOL_SUMMARY" | "TECHNIQUE_SUMMARY";

export interface IndexableDocument {
  documentId: string;
  type: RagDocumentKind;
  entityType: string;
  entityId: string;
  section: string;
  text: string;
  sourceType: string;
  citationIds: string[];
  passageId?: string;
  classicId?: string;
  editorialStatus: string;
  publicationStatus: string;
  evidenceStatus?: string;
  contentHash: string;
}

export interface ExistingEmbeddingState { documentId: string; contentHash: string; provider: string; model: string }
export interface IndexPlan { create: string[]; update: string[]; unchanged: string[]; remove: string[] }
export interface EmbeddingClient {
  id: string;
  model: string;
  dimensions: number;
  embed(texts: readonly string[]): Promise<readonly number[][]>;
}

export interface IndexRunSummary extends Record<"created" | "updated" | "unchanged" | "removed" | "failed", number> {
  dryRun: boolean;
  snapshotChecksum: string;
}
