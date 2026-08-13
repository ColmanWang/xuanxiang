import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";
import { entityTypeLabels } from "@/components/graph/graph-config";
import { GraphLineage } from "@/components/graph/graph-lineage";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import type { GraphEdge, GraphNode } from "@/lib/graph/types";
import { evidenceLabels, getRelationsForNode, groupRelatedNodes, relationLabels } from "@/lib/graph/relations";
import { useResearchMode } from "@/components/research/research-mode-provider";

interface GraphInspectorProps {
  node?: GraphNode;
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  onSelectNode: (nodeId: string) => void;
  onClose?: () => void;
  mobile?: boolean;
}

const relationGroupLabels = {
  classic: "相关经典",
  person: "相关人物",
  concept: "相关概念",
  technique: "相关术数",
  school: "相关学派",
  dynasty: "相关时代",
} as const;

export function GraphInspector({ node, edges, nodeMap, onSelectNode, onClose, mobile = false }: GraphInspectorProps) {
  const [mode, setMode] = useState<"relations" | "lineage">("relations");
  const { mode: researchMode } = useResearchMode();

  if (!node) {
    return (
      <aside className="hidden min-h-[36rem] place-items-center border bg-card/35 p-8 text-center lg:grid lg:min-h-[42rem]">
        <div>
          <p className="font-serif text-2xl">选择一个知识节点</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">查看它的直接关系、历史语境与上下游脉络。</p>
        </div>
      </aside>
    );
  }

  const relations = getRelationsForNode(node.id, edges);
  const groups = groupRelatedNodes(node.id, edges, nodeMap);

  return (
    <aside className={mobile ? "graph-mobile-inspector fixed inset-x-0 bottom-0 z-40 max-h-[78svh] overflow-y-auto border-t bg-background p-5 shadow-2xl lg:hidden" : "hidden max-h-[42rem] overflow-y-auto border bg-card/35 p-6 lg:block"} aria-label={`${node.title}详情`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{entityTypeLabels[node.entityType]}</Badge>
            {node.dynasty ? <span className="text-xs text-muted-foreground">{node.dynasty}</span> : null}
          </div>
          <h2 className="mt-4 font-serif text-3xl">{node.title}</h2>
        </div>
        {onClose ? <button type="button" className="grid size-9 shrink-0 place-items-center border hover:bg-muted" onClick={onClose} aria-label="关闭节点详情"><X className="size-4" aria-hidden="true" /></button> : null}
      </div>
      {node.summary ? <p className="mt-5 text-sm leading-7 text-muted-foreground">{node.summary}</p> : null}
      <dl className="mt-6 grid grid-cols-2 gap-4 border-y py-5 text-xs">
        <div><dt className="text-muted-foreground">所属体系</dt><dd className="mt-1.5">{node.system ?? node.category ?? "待整理"}</dd></div>
        <div><dt className="text-muted-foreground">直接关系</dt><dd className="mt-1.5 tabular-nums">{relations.length} 条</dd></div>
      </dl>

      <div className="mt-6 flex gap-1.5" role="group" aria-label="详情模式">
        <Button type="button" size="sm" variant={mode === "relations" ? "default" : "outline"} onClick={() => setMode("relations")}>普通关系</Button>
        <Button type="button" size="sm" variant={mode === "lineage" ? "default" : "outline"} onClick={() => setMode("lineage")}>查看脉络</Button>
      </div>

      {mode === "lineage" ? (
        <div className="mt-7"><GraphLineage node={node} edges={edges} nodeMap={nodeMap} onSelectNode={onSelectNode} /></div>
      ) : (
        <div className="mt-7 flex flex-col gap-6">
          {Array.from(groups.entries()).map(([type, relatedNodes]) => (
            <section key={type}>
              <h3 className="text-xs tracking-[0.12em] text-muted-foreground">{relationGroupLabels[type]}</h3>
              <ul className="mt-2 border-y">
                {relatedNodes.map((related) => (
                  <li key={related.id} className="border-b last:border-b-0">
                    <button type="button" className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm hover:text-primary" onClick={() => onSelectNode(related.id)}>
                      {related.title}<ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {researchMode === "research" ? (
            <section>
              <h3 className="text-xs tracking-[0.12em] text-muted-foreground">关系证据</h3>
              <ul className="mt-2 border-y text-xs">
                {relations.map((relation) => (
                  <li key={relation.id} className="border-b py-3 last:border-b-0">
                    <p>{relationLabels[relation.type]} · {evidenceLabels[relation.evidenceStatus]}</p>
                    {relation.sourceNote ? <p className="mt-1.5 leading-5 text-muted-foreground">{relation.sourceNote}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <div className="mt-8 border-t pt-5">
        {node.href ? (
          <ButtonLink href={node.href} variant="outline" className="w-full">查看完整条目 <ArrowUpRight aria-hidden="true" /></ButtonLink>
        ) : (
          <Button type="button" variant="outline" className="w-full" disabled>详情建设中</Button>
        )}
        <Link href={`/graph?node=${node.id}`} className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">复制当前图谱入口</Link>
      </div>
    </aside>
  );
}
