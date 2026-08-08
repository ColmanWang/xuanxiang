import type { GraphEdge, GraphNode } from "@/types/graph";
import { entityTypeLabels } from "./graph-config";

type EntityInspectorProps = {
  selectedNode?: GraphNode;
  relations: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  visibleNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
};

export function EntityInspector({ selectedNode, relations, nodeMap, visibleNodeIds, onSelectNode }: EntityInspectorProps) {
  return (
    <aside className="border-t py-7 lg:border-t-0 lg:pl-7" aria-labelledby="entity-inspector-title">
      <p className="text-xs tracking-[0.16em] text-accent">实体检查器</p>
      {selectedNode ? (
        <div aria-live="polite">
          <div className="mt-5 flex items-baseline justify-between gap-4 border-b pb-4">
            <h2 id="entity-inspector-title" className="font-serif text-3xl">{selectedNode.name}</h2>
            <span className="shrink-0 text-xs text-muted-foreground">{entityTypeLabels[selectedNode.type]}</span>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{selectedNode.summary}</p>
          <dl className="mt-7 grid grid-cols-2 border-y text-sm">
            <div className="py-4"><dt className="text-xs text-muted-foreground">坐标</dt><dd className="tabular mt-1">{selectedNode.x}, {selectedNode.y}</dd></div>
            <div className="border-l py-4 pl-4"><dt className="text-xs text-muted-foreground">直接关系</dt><dd className="tabular mt-1">{relations.length} 条</dd></div>
          </dl>
          <h3 className="mt-7 font-serif text-lg">关联实体</h3>
          {relations.length > 0 ? (
            <ul className="mt-2 divide-y border-y">
              {relations.map((edge) => {
                const outgoing = edge.sourceId === selectedNode.id;
                const otherNode = nodeMap.get(outgoing ? edge.targetId : edge.sourceId);
                if (!otherNode) return null;
                return (
                  <li key={edge.id}><button type="button" disabled={!visibleNodeIds.has(otherNode.id)} onClick={() => onSelectNode(otherNode.id)} className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm hover:text-primary disabled:cursor-not-allowed disabled:opacity-45">
                    <span><span className="font-medium">{otherNode.name}</span><span className="ml-2 text-xs text-muted-foreground">{edge.label}</span></span>
                    <span className="text-xs text-muted-foreground" aria-label={outgoing ? "向外指向" : "由外指入"}>{outgoing ? "向外" : "向内"}</span>
                  </button></li>
                );
              })}
            </ul>
          ) : <p className="mt-3 border-y py-5 text-sm text-muted-foreground">当前数据中尚无直接关系。</p>}
        </div>
      ) : (
        <div className="mt-5 border-y py-8"><h2 id="entity-inspector-title" className="font-serif text-xl">尚未选择实体</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">恢复任一类实体筛选后，即可继续查看节点信息。</p></div>
      )}
    </aside>
  );
}
