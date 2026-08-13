import type { GraphEdge, GraphFilterState, GraphNode, GraphPreset } from "@/lib/graph/types";

export const DEFAULT_GRAPH_FILTERS: GraphFilterState = {
  query: "",
  entityTypes: [],
  dynasty: "全部",
};

export function matchesGraphQuery(node: GraphNode, query: string) {
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  if (!normalized) return true;
  return [node.title, node.subtitle, node.summary, ...node.aliases]
    .filter(Boolean)
    .some((value) => value!.toLocaleLowerCase("zh-CN").includes(normalized));
}

export function filterGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  filters: GraphFilterState,
  presets: GraphPreset[] = [],
) {
  const preset = filters.presetId ? presets.find((item) => item.id === filters.presetId) : undefined;
  const presetNodeIds = preset ? new Set(preset.nodeIds) : undefined;
  const typeSet = new Set(filters.entityTypes);
  const visibleNodes = nodes.filter((node) => {
    if (presetNodeIds && !presetNodeIds.has(node.id)) return false;
    if (typeSet.size > 0 && !typeSet.has(node.entityType)) return false;
    if (filters.dynasty !== "全部" && !node.dynasty?.includes(filters.dynasty)) return false;
    return matchesGraphQuery(node, filters.query);
  });
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const presetEdgeIds = preset?.edgeIds ? new Set(preset.edgeIds) : undefined;
  const visibleEdges = edges.filter(
    (edge) =>
      visibleNodeIds.has(edge.source) &&
      visibleNodeIds.has(edge.target) &&
      (!presetEdgeIds || presetEdgeIds.has(edge.id)),
  );
  return { nodes: visibleNodes, edges: visibleEdges };
}
