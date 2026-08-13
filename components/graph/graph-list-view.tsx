import { entityTypeLabels } from "@/components/graph/graph-config";
import type { GraphNode } from "@/lib/graph/types";

export function GraphListView({ nodes, onSelectNode }: { nodes: GraphNode[]; onSelectNode: (nodeId: string) => void }) {
  if (nodes.length === 0) {
    return <div className="grid min-h-80 place-items-center border bg-card/45 px-6 text-center"><p className="text-sm text-muted-foreground">没有找到匹配的知识条目，请调整筛选。</p></div>;
  }

  return (
    <div className="overflow-x-auto border">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <thead className="bg-muted/65 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-normal">名称</th><th className="px-4 py-3 font-normal">类型</th><th className="px-4 py-3 font-normal">时代</th><th className="px-4 py-3 font-normal">简介</th></tr></thead>
        <tbody>
          {nodes.map((node) => (
            <tr key={node.id} className="border-t hover:bg-card">
              <td className="px-4 py-4"><button type="button" className="font-serif text-base hover:text-primary" onClick={() => onSelectNode(node.id)}>{node.title}</button></td>
              <td className="px-4 py-4 text-xs text-muted-foreground">{entityTypeLabels[node.entityType]}</td>
              <td className="px-4 py-4 text-xs text-muted-foreground">{node.dynasty ?? "—"}</td>
              <td className="max-w-xl px-4 py-4 leading-6 text-muted-foreground">{node.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
