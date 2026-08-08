import type { GraphEntityType, GraphRelationType } from "@/types/graph";

export const entityTypes: GraphEntityType[] = [
  "CONCEPT",
  "BOOK",
  "PERSON",
  "SCHOOL",
  "TECHNIQUE",
];

export const entityTypeLabels: Record<GraphEntityType, string> = {
  CONCEPT: "概念",
  PERSON: "人物",
  BOOK: "经典",
  SCHOOL: "学派",
  TECHNIQUE: "术数",
};

export const relationTypeLabels: Record<GraphRelationType, string> = {
  INFLUENCED: "影响",
  DERIVED_FROM: "源自",
  BELONGS_TO: "归属",
  RELATED_TO: "关联",
  WRITTEN_BY: "作者",
};

export const relationDash: Record<GraphRelationType, string | undefined> = {
  INFLUENCED: undefined,
  DERIVED_FROM: "8 7",
  BELONGS_TO: "3 6",
  RELATED_TO: "2 5",
  WRITTEN_BY: "12 5 2 5",
};
