import type { GraphEdge, GraphLineage, GraphNode } from "@/lib/graph/types";

export const relationLabels = {
  RELATED_TO: "相关",
  BELONGS_TO: "属于",
  DERIVED_FROM: "来源于",
  INFLUENCED_BY: "受影响于",
  WRITTEN_BY: "作者",
  APPEARS_IN: "出现于",
  DEVELOPED_DURING: "发展于",
  USES: "运用",
  INTERPRETS: "解释",
} as const;

export const evidenceLabels = {
  DOCUMENTED: "有文献依据",
  TRADITIONAL: "传统归属",
  INFERRED: "关系推定",
  CONTESTED: "存在争议",
} as const;

export function getRelationsForNode(nodeId: string, edges: GraphEdge[]) {
  return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function getUpstreamRelations(nodeId: string, edges: GraphEdge[]) {
  return edges.filter((edge) => edge.source === nodeId && edge.type !== "RELATED_TO");
}

export function getParallelRelations(nodeId: string, edges: GraphEdge[]) {
  return edges.filter(
    (edge) => edge.type === "RELATED_TO" && (edge.source === nodeId || edge.target === nodeId),
  );
}

export function getDownstreamRelations(nodeId: string, edges: GraphEdge[]) {
  return edges.filter((edge) => edge.target === nodeId && edge.type !== "RELATED_TO");
}

export function getLineage(nodeId: string, edges: GraphEdge[]): GraphLineage {
  return {
    upstream: getUpstreamRelations(nodeId, edges),
    parallel: getParallelRelations(nodeId, edges),
    downstream: getDownstreamRelations(nodeId, edges),
  };
}

export function getOtherNodeId(edge: GraphEdge, nodeId: string) {
  return edge.source === nodeId ? edge.target : edge.source;
}

export function groupRelatedNodes(nodeId: string, edges: GraphEdge[], nodeMap: Map<string, GraphNode>) {
  const result = new Map<GraphNode["entityType"], GraphNode[]>();
  for (const edge of getRelationsForNode(nodeId, edges)) {
    const related = nodeMap.get(getOtherNodeId(edge, nodeId));
    if (!related) continue;
    const group = result.get(related.entityType) ?? [];
    if (!group.some((node) => node.id === related.id)) group.push(related);
    result.set(related.entityType, group);
  }
  return result;
}
