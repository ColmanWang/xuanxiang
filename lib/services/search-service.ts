import { searchRepository } from "@/lib/repositories/search-repository";
import { getGraph } from "@/lib/services/graph-service";
import { searchClassicPassages } from "@/lib/services/classic-text-service";

export interface SearchResult { id: string; type: "concept" | "classic" | "person" | "school" | "technique" | "passage"; title: string; summary: string; href: string; match: "direct" | "related" | "passage"; sectionTitle?:string }
export async function searchKnowledge(query: string): Promise<SearchResult[]> {
  const [data,passages] = await Promise.all([searchRepository(query),searchClassicPassages(query)]);
  const direct: SearchResult[] = [
    ...data.concepts.map((item) => ({ id: item.id, type: "concept" as const, title: item.name, summary: item.summary, href: `/knowledge/${item.slug}`, match:"direct" as const })),
    ...data.classics.map((item) => ({ id: item.id, type: "classic" as const, title: item.title, summary: item.summary, href: `/classics/${item.slug}`, match:"direct" as const })),
    ...data.people.map((item) => ({ id: item.id, type: "person" as const, title: item.name, summary: item.summary, href: `/people/${item.slug}`, match:"direct" as const })),
    ...data.schools.map((item) => ({ id: item.id, type: "school" as const, title: item.name, summary: item.summary, href: `/schools/${item.slug}`, match:"direct" as const })),
    ...data.techniques.map((item) => ({ id: item.id, type: "technique" as const, title: item.name, summary: item.summary, href: `/techniques/${item.slug}`, match:"direct" as const })),
  ];
  const passageResults:SearchResult[]=passages.map(item=>({id:item.id,type:"passage",title:item.classicTitle,summary:item.text,href:item.href,match:"passage",sectionTitle:item.sectionTitle}));
  if (!direct.length) return passageResults;
  const graph = await getGraph();
  const directIds = new Set(direct.map((item) => item.id));
  const relatedIds = new Set<string>();
  graph.edges.forEach((edge) => { if (directIds.has(edge.source) && !directIds.has(edge.target)) relatedIds.add(edge.target); if (directIds.has(edge.target) && !directIds.has(edge.source)) relatedIds.add(edge.source); });
  const related: SearchResult[] = graph.nodes.filter((node) => relatedIds.has(node.id) && node.href && node.entityType !== "dynasty").slice(0,12).map((node) => ({ id:node.id, type:node.entityType as SearchResult["type"], title:node.title, summary:node.summary ?? "条目正在整理。", href:node.href!, match:"related" }));
  return [...direct, ...related, ...passageResults];
}
