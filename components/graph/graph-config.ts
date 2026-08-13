import type { GraphEntityType, RelationType } from "@/lib/graph/types";

export const entityTypes: GraphEntityType[] = [
  "concept",
  "classic",
  "person",
  "school",
  "technique",
  "dynasty",
];

export const entityTypeLabels: Record<GraphEntityType, string> = {
  concept: "概念",
  classic: "经典",
  person: "人物",
  school: "学派",
  technique: "术数",
  dynasty: "时代",
};

export const entityTypeMarks: Record<GraphEntityType, string> = {
  concept: "象",
  classic: "典",
  person: "人",
  school: "学",
  technique: "术",
  dynasty: "时",
};

export const relationDash: Record<RelationType, string | undefined> = {
  RELATED_TO: "5 5",
  BELONGS_TO: undefined,
  DERIVED_FROM: "10 4",
  INFLUENCED_BY: undefined,
  WRITTEN_BY: "2 4",
  APPEARS_IN: "2 4",
  DEVELOPED_DURING: "10 4 2 4",
  USES: undefined,
  INTERPRETS: "7 3",
};
