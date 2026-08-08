import type { GraphEdge, GraphNode } from "@/types/graph";
import { relationTypeLabels } from "./graph-config";

export function RelationList({ edges, nodeMap, onSelectNode }: { edges: GraphEdge[]; nodeMap: Map<string, GraphNode>; onSelectNode: (nodeId: string) => void }) {
  return (
    <section className="pt-10" aria-labelledby="relationship-list-title">
      <div className="grid gap-5 lg:grid-cols-[21rem_minmax(0,1fr)]">
        <div><h2 id="relationship-list-title" className="font-serif text-2xl">文字关系表</h2><p id="relationship-list-description" className="mt-3 text-sm leading-7 text-muted-foreground">以文字复述当前图中的每条连线。“→”与图中箭头方向一致，便于屏幕阅读器和小屏设备查阅。</p></div>
        {edges.length > 0 ? (
          <ol className="divide-y border-y" aria-describedby="relationship-list-description">
            {edges.map((edge) => {
              const source = nodeMap.get(edge.sourceId);
              const target = nodeMap.get(edge.targetId);
              if (!source || !target) return null;
              return (
                <li key={edge.id} className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(7rem,1fr)_auto_minmax(7rem,1fr)] sm:items-center">
                  <button type="button" onClick={() => onSelectNode(source.id)} className="min-h-10 justify-self-start text-left font-medium underline-offset-4 hover:text-primary hover:underline">{source.name}</button>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground"><span aria-hidden="true">→</span><span>{edge.label}</span><span className="hidden sm:inline">· {relationTypeLabels[edge.type]}</span></span>
                  <button type="button" onClick={() => onSelectNode(target.id)} className="min-h-10 justify-self-start text-left font-medium underline-offset-4 hover:text-primary hover:underline sm:justify-self-end sm:text-right">{target.name}</button>
                </li>
              );
            })}
          </ol>
        ) : <p className="border-y py-7 text-sm text-muted-foreground">当前筛选没有同时保留一条关系的两个端点。请增加实体类型，或选择“全部”。</p>}
      </div>
    </section>
  );
}
