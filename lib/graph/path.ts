import type { GraphEdge, GraphNode, GraphPath } from "@/lib/graph/types";

export function findPath(
  startNodeId: string,
  endNodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
): GraphPath | null {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  if (!nodeMap.has(startNodeId) || !nodeMap.has(endNodeId)) return null;
  if (startNodeId === endNodeId) return { nodes: [nodeMap.get(startNodeId)!], edges: [] };

  const adjacency = new Map<string, Array<{ nodeId: string; edge: GraphEdge }>>();
  for (const edge of edges) {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), { nodeId: edge.target, edge }]);
    adjacency.set(edge.target, [...(adjacency.get(edge.target) ?? []), { nodeId: edge.source, edge }]);
  }

  const queue = [startNodeId];
  const visited = new Set(queue);
  const previous = new Map<string, { nodeId: string; edge: GraphEdge }>();

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next.nodeId)) continue;
      visited.add(next.nodeId);
      previous.set(next.nodeId, { nodeId: current, edge: next.edge });
      if (next.nodeId === endNodeId) {
        const pathNodeIds = [endNodeId];
        const pathEdges: GraphEdge[] = [];
        let cursor = endNodeId;
        while (cursor !== startNodeId) {
          const step = previous.get(cursor);
          if (!step) return null;
          pathEdges.unshift(step.edge);
          cursor = step.nodeId;
          pathNodeIds.unshift(cursor);
        }
        return { nodes: pathNodeIds.map((id) => nodeMap.get(id)!), edges: pathEdges };
      }
      queue.push(next.nodeId);
    }
  }

  return null;
}
