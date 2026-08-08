"use client";

import { useMemo, useState } from "react";
import type { GraphEdge, GraphEntityType, GraphNode } from "@/types/graph";
import { EntityInspector } from "./entity-inspector";
import { GraphCanvas } from "./graph-canvas";
import { entityTypeLabels, entityTypes } from "./graph-config";
import { GraphLegend } from "./graph-legend";
import { RelationList } from "./relation-list";

type KnowledgeGraphExplorerProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function KnowledgeGraphExplorer({ nodes, edges }: KnowledgeGraphExplorerProps) {
  const [activeTypes, setActiveTypes] = useState<GraphEntityType[]>(entityTypes);
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id ?? "");

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const visibleNodes = useMemo(
    () => nodes.filter((node) => activeTypes.includes(node.type)),
    [activeTypes, nodes],
  );
  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes],
  );
  const visibleEdges = useMemo(
    () => edges.filter((edge) => visibleNodeIds.has(edge.sourceId) && visibleNodeIds.has(edge.targetId)),
    [edges, visibleNodeIds],
  );
  const selectedNode = nodeMap.get(selectedNodeId) ?? visibleNodes[0];
  const selectedRelations = useMemo(
    () => selectedNode ? edges.filter((edge) => edge.sourceId === selectedNode.id || edge.targetId === selectedNode.id) : [],
    [edges, selectedNode],
  );
  const relatedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    if (!selectedNode) return ids;
    for (const edge of visibleEdges) {
      if (edge.sourceId === selectedNode.id) ids.add(edge.targetId);
      if (edge.targetId === selectedNode.id) ids.add(edge.sourceId);
    }
    return ids;
  }, [selectedNode, visibleEdges]);

  function setTypeVisible(type: GraphEntityType) {
    const nextTypes = activeTypes.includes(type)
      ? activeTypes.filter((activeType) => activeType !== type)
      : [...activeTypes, type];
    const selectedType = selectedNode?.type;

    setActiveTypes(nextTypes);
    if (!selectedType || !nextTypes.includes(selectedType)) {
      setSelectedNodeId(nodes.find((node) => nextTypes.includes(node.type))?.id ?? "");
    }
  }

  function showAllTypes() {
    setActiveTypes(entityTypes);
    if (!selectedNodeId) setSelectedNodeId(nodes[0]?.id ?? "");
  }

  return (
    <section
      className="mt-10 [--graph-book:var(--accent)] [--graph-concept:var(--primary)] [--graph-node-stroke:color-mix(in_srgb,var(--foreground)_72%,transparent)] [--graph-node-text:var(--primary-foreground)] [--graph-person:var(--card)] [--graph-school:var(--secondary)] [--graph-technique-detail:var(--ink-muted)] [--graph-technique:var(--ink)]"
      aria-labelledby="graph-explorer-title"
    >
      <div className="flex flex-col gap-6 border-b pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="graph-explorer-title" className="font-serif text-2xl sm:text-3xl">实体关系场</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">切换实体类型以收窄网络；图中节点可点击，也可使用 Tab 键定位后按回车选择。</p>
        </div>
        <div>
          <p className="mb-3 text-xs tracking-[0.16em] text-muted-foreground">实体筛选</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="按实体类型筛选">
            <button type="button" aria-pressed={activeTypes.length === entityTypes.length} onClick={showAllTypes} className={`min-h-10 border px-4 text-sm transition-colors ${activeTypes.length === entityTypes.length ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>全部</button>
            {entityTypes.map((type) => {
              const active = activeTypes.includes(type);
              const count = nodes.filter((node) => node.type === type).length;
              return <button key={type} type="button" aria-pressed={active} onClick={() => setTypeVisible(type)} className={`min-h-10 border px-4 text-sm transition-colors ${active ? "border-primary bg-secondary text-secondary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>{entityTypeLabels[type]} <span className="tabular opacity-65">{count}</span></button>;
            })}
          </div>
        </div>
      </div>

      <div className="grid border-b lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 py-6 lg:border-r lg:pr-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p aria-live="polite">显示 <span className="tabular text-foreground">{visibleNodes.length}</span> 个实体、<span className="tabular text-foreground">{visibleEdges.length}</span> 条关系</p>
            <p className="sm:hidden">向左滑动可查看完整图谱</p>
          </div>
          <GraphCanvas nodes={visibleNodes} edges={visibleEdges} nodeMap={nodeMap} selectedNode={selectedNode} relatedNodeIds={relatedNodeIds} onSelectNode={setSelectedNodeId} />
          <GraphLegend />
        </div>
        <EntityInspector selectedNode={selectedNode} relations={selectedRelations} nodeMap={nodeMap} visibleNodeIds={visibleNodeIds} onSelectNode={setSelectedNodeId} />
      </div>

      <RelationList edges={visibleEdges} nodeMap={nodeMap} onSelectNode={setSelectedNodeId} />
    </section>
  );
}
