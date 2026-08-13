"use client";

import { ReactFlowProvider, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import type { KnowledgeFlowEdge } from "@/components/graph/graph-edge";
import { GraphInspector } from "@/components/graph/graph-inspector";
import { GraphLegend } from "@/components/graph/graph-legend";
import { GraphListView } from "@/components/graph/graph-list-view";
import type { KnowledgeFlowNode } from "@/components/graph/graph-node";
import { GraphPresetList } from "@/components/graph/graph-preset-list";
import { GraphToolbar } from "@/components/graph/graph-toolbar";
import { DEFAULT_GRAPH_FILTERS, filterGraph, matchesGraphQuery } from "@/lib/graph/filters";
import { getRelationsForNode } from "@/lib/graph/relations";
import type { GraphEdge, GraphFilterState, GraphNode, GraphPreset, GraphViewMode } from "@/lib/graph/types";

interface KnowledgeGraphExplorerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  presets: GraphPreset[];
  initialNodeId?: string;
  initialPresetId?: string;
}

function GraphWorkspace({ nodes, edges, presets, initialNodeId, initialPresetId }: KnowledgeGraphExplorerProps) {
  const { fitView, setCenter } = useReactFlow<KnowledgeFlowNode, KnowledgeFlowEdge>();
  const [filters, setFilters] = useState<GraphFilterState>(() => ({ ...DEFAULT_GRAPH_FILTERS, presetId: initialPresetId }));
  const [viewMode, setViewMode] = useState<GraphViewMode>("graph");
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodeId && nodes.some((node) => node.id === initialNodeId) ? initialNodeId : "");
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(Boolean(initialNodeId));
  const pendingFocusNodeId = useRef(initialNodeId);
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const filtered = useMemo(() => filterGraph(nodes, edges, filters, presets), [nodes, edges, filters, presets]);
  const visibleNodeIds = useMemo(() => new Set(filtered.nodes.map((node) => node.id)), [filtered.nodes]);
  const selectedNode = selectedNodeId && visibleNodeIds.has(selectedNodeId) ? nodeMap.get(selectedNodeId) : undefined;
  const selectedRelations = useMemo(() => selectedNode ? getRelationsForNode(selectedNode.id, filtered.edges) : [], [selectedNode, filtered.edges]);
  const relatedNodeIds = useMemo(() => {
    const result = new Set<string>();
    for (const relation of selectedRelations) result.add(relation.source === selectedNodeId ? relation.target : relation.source);
    return result;
  }, [selectedNodeId, selectedRelations]);
  const searchResults = useMemo(() => filters.query ? nodes.filter((node) => matchesGraphQuery(node, filters.query)) : [], [filters.query, nodes]);

  const flowNodes = useMemo<KnowledgeFlowNode[]>(() => filtered.nodes.map((node) => ({
    id: node.id,
    type: "knowledge",
    position: node.position,
    data: {
      graphNode: node,
      selected: node.id === selectedNodeId,
      related: relatedNodeIds.has(node.id),
      subdued: Boolean(selectedNodeId) && node.id !== selectedNodeId && !relatedNodeIds.has(node.id),
    },
  })), [filtered.nodes, relatedNodeIds, selectedNodeId]);
  const flowEdges = useMemo<KnowledgeFlowEdge[]>(() => filtered.edges.map((edge) => {
    const highlighted = edge.source === selectedNodeId || edge.target === selectedNodeId;
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "knowledge",
      data: { graphEdge: edge, highlighted, subdued: Boolean(selectedNodeId) && !highlighted },
    };
  }), [filtered.edges, selectedNodeId]);
  const [renderedNodes, setRenderedNodes, onNodesChange] = useNodesState<KnowledgeFlowNode>(flowNodes);

  useEffect(() => {
    setRenderedNodes(flowNodes);
    const frame = requestAnimationFrame(() => {
      if (pendingFocusNodeId.current) {
        const node = nodeMap.get(pendingFocusNodeId.current);
        if (node) requestAnimationFrame(() => setCenter(node.position.x + 72, node.position.y + 28, { zoom: 1.15, duration: 420 }));
        pendingFocusNodeId.current = undefined;
      } else {
        void fitView({ padding: 0.16, maxZoom: 1.15, duration: 360 });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [fitView, flowNodes, nodeMap, setCenter, setRenderedNodes]);

  const selectNode = useCallback((nodeId: string, openMobile = true) => {
    setSelectedNodeId(nodeId);
    pendingFocusNodeId.current = nodeId;
    if (openMobile) setMobileInspectorOpen(true);
    window.history.replaceState(null, "", `/graph?node=${nodeId}`);
  }, []);

  function selectSearchResult(nodeId: string) {
    setFilters(DEFAULT_GRAPH_FILTERS);
    selectNode(nodeId);
  }

  function selectPreset(preset: GraphPreset) {
    setFilters({ ...DEFAULT_GRAPH_FILTERS, presetId: preset.id });
    selectNode(preset.focusNodeId, false);
  }

  return (
    <section className="mt-8" aria-labelledby="graph-workspace-title">
      <h2 id="graph-workspace-title" className="sr-only">玄象图谱探索工作区</h2>
      <GraphPresetList presets={presets} activePresetId={filters.presetId} onSelect={selectPreset} />
      <div className="pt-7">
        <GraphToolbar filters={filters} searchResults={searchResults} viewMode={viewMode} onFiltersChange={setFilters} onSelectSearchResult={selectSearchResult} onViewModeChange={setViewMode} />
        <div className="flex items-center justify-between gap-4 px-1 py-3 text-xs text-muted-foreground" aria-live="polite">
          <span>显示 <b className="font-medium text-foreground">{filtered.nodes.length}</b> 个节点 · <b className="font-medium text-foreground">{filtered.edges.length}</b> 条关系</span>
          {viewMode === "graph" ? <span className="hidden sm:inline">拖动节点整理局部视图；滚轮平移，控制器缩放</span> : <span>图谱的无障碍列表视图</span>}
        </div>
        {viewMode === "graph" ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]">
            <div className="min-w-0"><GraphCanvas nodes={renderedNodes} edges={flowEdges} onNodesChange={onNodesChange} onSelectNode={selectNode} empty={filtered.nodes.length === 0} /><GraphLegend /></div>
            <GraphInspector node={selectedNode} edges={edges} nodeMap={nodeMap} onSelectNode={selectNode} />
          </div>
        ) : (
          <GraphListView nodes={filtered.nodes} onSelectNode={selectNode} />
        )}
      </div>
      {mobileInspectorOpen && selectedNode ? <GraphInspector mobile node={selectedNode} edges={edges} nodeMap={nodeMap} onSelectNode={selectNode} onClose={() => setMobileInspectorOpen(false)} /> : null}
      {mobileInspectorOpen && selectedNode ? <button type="button" className="fixed inset-0 z-30 bg-foreground/25 lg:hidden" onClick={() => setMobileInspectorOpen(false)} aria-label="关闭节点详情遮罩" /> : null}
    </section>
  );
}

export function KnowledgeGraphExplorer(props: KnowledgeGraphExplorerProps) {
  return <ReactFlowProvider><GraphWorkspace {...props} /></ReactFlowProvider>;
}
