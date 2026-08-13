import type { GraphEdge, GraphEntityRecord, GraphNode } from "@/lib/graph/types";

export function adaptGraphEntity(record: GraphEntityRecord): GraphNode {
  return {
    id: record.entityId,
    entityType: record.entityType,
    entityId: record.entityId,
    slug: record.slug,
    title: record.title,
    aliases: record.aliases ?? [],
    subtitle: record.subtitle,
    summary: record.summary,
    dynasty: record.dynasty,
    category: record.category,
    system: record.system,
    href: record.href,
    position: record.position,
  };
}

export function adaptGraphEntities(records: GraphEntityRecord[]): GraphNode[] {
  const seenIds = new Set<string>();

  return records.map((record) => {
    if (seenIds.has(record.entityId)) {
      throw new Error(`Duplicate graph entity id: ${record.entityId}`);
    }
    seenIds.add(record.entityId);
    return adaptGraphEntity(record);
  });
}

export function projectGraph(
  records: GraphEntityRecord[],
  edges: GraphEdge[],
  requestedNodeIds?: Iterable<string>,
) {
  const requested = requestedNodeIds ? new Set(requestedNodeIds) : undefined;
  const nodes = adaptGraphEntities(
    requested ? records.filter((record) => requested.has(record.entityId)) : records,
  );
  const nodeIds = new Set(nodes.map((node) => node.id));
  return {
    nodes,
    edges: edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)),
  };
}
