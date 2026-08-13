import type { GraphEntityType } from "@prisma/client";
import { graphEntityRecords } from "@/data/graph/nodes";
import { graphRepository } from "@/lib/repositories/graph-repository";
import type { GraphEdge, GraphEntityRecord, GraphNode } from "@/lib/graph/types";
import { projectGraph } from "@/lib/graph/adapter";

const typeMap: Record<GraphEntityType, GraphEntityRecord["entityType"]> = { CONCEPT: "concept", CLASSIC: "classic", PERSON: "person", SCHOOL: "school", TECHNIQUE: "technique", DYNASTY: "dynasty" };
const pathFor = (type: GraphEntityRecord["entityType"], slug: string) => type === "concept" ? `/knowledge/${slug}` : type === "classic" ? `/classics/${slug}` : type === "person" ? `/people/${slug}` : type === "school" ? `/schools/${slug}` : type === "technique" ? `/techniques/${slug}` : undefined;
const positionById = new Map(graphEntityRecords.map((item) => [item.entityId, item.position]));
const relationLabels = new Map([
  ["RELATED_TO", "相关"], ["BELONGS_TO", "属于"], ["DERIVED_FROM", "来源"], ["INFLUENCED_BY", "受到影响"], ["WRITTEN_BY", "作者"], ["APPEARS_IN", "出现于"], ["DEVELOPED_DURING", "发展于"], ["USES", "使用"], ["INTERPRETS", "解释"],
]);

export async function getGraph(requestedNodeIds?: Iterable<string>): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const data = await graphRepository.getAll();
  const records: GraphEntityRecord[] = [
    ...data.concepts.map((item) => ({ entityType: "concept" as const, entityId: item.id, slug: item.slug, title: item.name, aliases: item.aliases, summary: item.summary, dynasty: item.historicalContext ?? undefined, category: item.categories[0], href: pathFor("concept", item.slug), position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
    ...data.classics.map((item) => ({ entityType: "classic" as const, entityId: item.id, slug: item.slug, title: item.title, aliases: item.aliases, summary: item.summary, dynasty: item.period ?? undefined, category: item.categories[0], href: pathFor("classic", item.slug), position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
    ...data.people.map((item) => ({ entityType: "person" as const, entityId: item.id, slug: item.slug, title: item.name, aliases: item.aliases, summary: item.summary, dynasty: item.period ?? undefined, category: item.categories[0], href: pathFor("person", item.slug), position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
    ...data.schools.map((item) => ({ entityType: "school" as const, entityId: item.id, slug: item.slug, title: item.name, aliases: item.aliases, summary: item.summary, dynasty: item.period ?? undefined, category: item.categories[0], href: pathFor("school", item.slug), position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
    ...data.techniques.map((item) => ({ entityType: "technique" as const, entityId: item.id, slug: item.slug, title: item.name, aliases: item.aliases, summary: item.summary, dynasty: item.period ?? undefined, category: item.category, href: pathFor("technique", item.slug), position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
    ...data.dynasties.map((item) => ({ entityType: "dynasty" as const, entityId: item.id, slug: item.slug, title: item.name, aliases: [], summary: item.summary ?? undefined, dynasty: item.name, category: "时代", position: positionById.get(item.id) ?? { x: 0, y: 0 } })),
  ];
  const edges: GraphEdge[] = data.relations.map((item) => ({ id: item.id, source: item.sourceId, target: item.targetId, type: item.relationType, label: relationLabels.get(item.relationType) ?? "相关", evidenceStatus: item.evidenceStatus, note: item.note ?? undefined, sourceNote: item.sourceNote ?? undefined }));
  return projectGraph(records, edges, requestedNodeIds);
}

export const previewNodeIds = ["zhouyi", "yinyang", "bagua", "xiangshu", "wuxing", "wangbi", "yixue", "liuyao", "sizhu-mingli"];
export const getPreviewGraph = () => getGraph(previewNodeIds);
export { typeMap, pathFor };
