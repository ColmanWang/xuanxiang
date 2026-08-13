export type GraphEntityType =
  | "concept"
  | "classic"
  | "person"
  | "school"
  | "technique"
  | "dynasty";

export type RelationType =
  | "RELATED_TO"
  | "BELONGS_TO"
  | "DERIVED_FROM"
  | "INFLUENCED_BY"
  | "WRITTEN_BY"
  | "APPEARS_IN"
  | "DEVELOPED_DURING"
  | "USES"
  | "INTERPRETS";

export type EvidenceStatus =
  | "DOCUMENTED"
  | "TRADITIONAL"
  | "INFERRED"
  | "CONTESTED";

export type GraphViewMode = "graph" | "list";

export interface GraphEntityRecord {
  entityType: GraphEntityType;
  entityId: string;
  slug: string;
  title: string;
  aliases?: string[];
  subtitle?: string;
  summary?: string;
  dynasty?: string;
  category?: string;
  system?: string;
  href?: string;
  position: { x: number; y: number };
}

export interface GraphNode {
  id: string;
  entityType: GraphEntityType;
  entityId: string;
  slug: string;
  title: string;
  aliases: string[];
  subtitle?: string;
  summary?: string;
  dynasty?: string;
  category?: string;
  system?: string;
  href?: string;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label: string;
  note?: string;
  evidenceStatus: EvidenceStatus;
  sourceNote?: string;
}

export interface GraphFilterState {
  query: string;
  entityTypes: GraphEntityType[];
  dynasty: string;
  presetId?: string;
}

export interface GraphPreset {
  id: string;
  title: string;
  description: string;
  nodeIds: string[];
  edgeIds?: string[];
  focusNodeId: string;
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphLineage {
  upstream: GraphEdge[];
  parallel: GraphEdge[];
  downstream: GraphEdge[];
}
