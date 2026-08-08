export type GraphEntityType =
  | "CONCEPT"
  | "PERSON"
  | "BOOK"
  | "SCHOOL"
  | "TECHNIQUE";

export type GraphRelationType =
  | "INFLUENCED"
  | "DERIVED_FROM"
  | "BELONGS_TO"
  | "RELATED_TO"
  | "WRITTEN_BY";

export interface GraphNode {
  id: string;
  name: string;
  type: GraphEntityType;
  summary: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: GraphRelationType;
  label: string;
}
