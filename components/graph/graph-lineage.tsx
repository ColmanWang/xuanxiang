import type { GraphEdge, GraphNode } from "@/lib/graph/types";
import { evidenceLabels, getLineage, getOtherNodeId } from "@/lib/graph/relations";
import { useResearchMode } from "@/components/research/research-mode-provider";

interface GraphLineageProps {
  node: GraphNode;
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  onSelectNode: (nodeId: string) => void;
}

export function GraphLineage({ node, edges, nodeMap, onSelectNode }: GraphLineageProps) {
  const { mode } = useResearchMode();
  const lineage = getLineage(node.id, edges);
  const sections = [
    ["溯源", "它从哪里发展而来", lineage.upstream],
    ["并行", "同一语境中的关联思想", lineage.parallel],
    ["流变", "它后来影响或发展出的对象", lineage.downstream],
  ] as const;

  return (
    <div className="flex flex-col gap-7">
      {sections.map(([title, description, relations]) => (
        <section key={title}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-xl">{title}</h3>
            <span className="text-[10px] text-muted-foreground">{description}</span>
          </div>
          {relations.length > 0 ? (
            <ul className="mt-3 border-y">
              {relations.map((relation) => {
                const related = nodeMap.get(getOtherNodeId(relation, node.id));
                if (!related) return null;
                return (
                  <li key={relation.id} className="border-b py-3 last:border-b-0">
                    <button type="button" className="flex w-full items-center justify-between gap-4 text-left text-sm hover:text-primary" onClick={() => onSelectNode(related.id)}>
                      <span>{related.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{relation.label}</span>
                    </button>
                    {mode === "research" ? (
                      <div className="mt-2 flex flex-col gap-1 text-[11px] leading-5 text-muted-foreground">
                        <span>{relation.type} · {evidenceLabels[relation.evidenceStatus]}</span>
                        {relation.sourceNote ? <span>来源说明：{relation.sourceNote}</span> : null}
                        {relation.note ? <span>{relation.note}</span> : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : <p className="mt-3 border-y py-4 text-xs text-muted-foreground">当前数据尚无此类关系。</p>}
        </section>
      ))}
    </div>
  );
}
