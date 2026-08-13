import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  type OnNodesChange,
} from "@xyflow/react";
import { GraphRelationEdge, type KnowledgeFlowEdge } from "@/components/graph/graph-edge";
import { GraphNodeCard, type KnowledgeFlowNode } from "@/components/graph/graph-node";

const nodeTypes = { knowledge: GraphNodeCard };
const edgeTypes = { knowledge: GraphRelationEdge };

interface GraphCanvasProps {
  nodes: KnowledgeFlowNode[];
  edges: KnowledgeFlowEdge[];
  onNodesChange: OnNodesChange<KnowledgeFlowNode>;
  onSelectNode: (nodeId: string) => void;
  empty: boolean;
}

export function GraphCanvas({ nodes, edges, onNodesChange, onSelectNode, empty }: GraphCanvasProps) {
  return (
    <div className="relative h-[36rem] overflow-hidden border bg-card/45 lg:h-[42rem]">
      <ReactFlow<KnowledgeFlowNode, KnowledgeFlowEdge>
        nodes={nodes}
        edges={edges.map((edge) => ({ ...edge, markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "var(--muted-foreground)" } }))}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        nodesConnectable={false}
        nodesFocusable
        edgesFocusable={false}
        fitView
        fitViewOptions={{ padding: 0.16, maxZoom: 1.15 }}
        minZoom={0.25}
        maxZoom={1.6}
        panOnScroll
        selectionOnDrag={false}
        proOptions={{ hideAttribution: true }}
        aria-label="玄象知识关系图。节点可拖动，画布可缩放和平移。"
      >
        <Background variant={BackgroundVariant.Lines} gap={28} size={0.7} color="var(--border)" />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
      {empty ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/80 px-6 text-center">
          <div>
            <p className="font-serif text-2xl">没有找到匹配的知识节点</p>
            <p className="mt-3 text-sm text-muted-foreground">请调整关键词、类型或时代筛选。</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
