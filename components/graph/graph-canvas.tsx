import type { GraphEdge, GraphNode } from "@/types/graph";
import { entityTypeLabels, relationDash } from "./graph-config";

type GraphCanvasProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  selectedNode?: GraphNode;
  relatedNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
};

function nodeWidth(node: GraphNode) {
  return Math.max(90, Math.min(144, node.name.length * 25 + 36));
}

function edgeGeometry(source: GraphNode, target: GraphNode) {
  const deltaX = target.x - source.x;
  const deltaY = target.y - source.y;
  const distance = Math.hypot(deltaX, deltaY) || 1;
  const unitX = deltaX / distance;
  const unitY = deltaY / distance;

  return {
    x1: source.x + unitX * (nodeWidth(source) / 2 + 8),
    y1: source.y + unitY * (nodeWidth(source) / 2 + 8),
    x2: target.x - unitX * (nodeWidth(target) / 2 + 17),
    y2: target.y - unitY * (nodeWidth(target) / 2 + 17),
    labelX: (source.x + target.x) / 2,
    labelY: (source.y + target.y) / 2 - 10,
  };
}

function NodeShape({
  node,
  selected,
  related,
  onSelect,
}: {
  node: GraphNode;
  selected: boolean;
  related: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const width = nodeWidth(node);
  const halfWidth = width / 2;
  const shapeProps = {
    fill: node.type === "PERSON" ? "var(--card)" : `var(--graph-${node.type.toLowerCase()})`,
    stroke: selected ? "var(--accent)" : "var(--graph-node-stroke)",
    strokeWidth: selected ? 4 : 1.5,
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${node.name}，${entityTypeLabels[node.type]}。${node.summary}`}
      aria-pressed={selected}
      onClick={() => onSelect(node.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(node.id);
        }
      }}
      className="graph-node cursor-pointer"
      style={{ opacity: selected || related ? 1 : 0.82 }}
    >
      <title>{`${node.name}：${node.summary}`}</title>
      <ellipse
        className="graph-node-focus-ring"
        cx={node.x}
        cy={node.y}
        rx={halfWidth + 13}
        ry="46"
        fill="none"
        aria-hidden="true"
      />
      {selected ? (
        <ellipse cx={node.x} cy={node.y} rx={halfWidth + 9} ry="42" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 4" aria-hidden="true" />
      ) : null}
      {node.type === "CONCEPT" ? <ellipse cx={node.x} cy={node.y} rx={halfWidth} ry="30" {...shapeProps} /> : null}
      {node.type === "BOOK" ? <rect x={node.x - halfWidth} y={node.y - 30} width={width} height="60" {...shapeProps} /> : null}
      {node.type === "PERSON" ? (
        <path d={`M ${node.x} ${node.y - 38} L ${node.x + halfWidth} ${node.y} L ${node.x} ${node.y + 38} L ${node.x - halfWidth} ${node.y} Z`} {...shapeProps} />
      ) : null}
      {node.type === "SCHOOL" ? (
        <path d={`M ${node.x - halfWidth + 16} ${node.y - 31} H ${node.x + halfWidth - 16} L ${node.x + halfWidth} ${node.y} L ${node.x + halfWidth - 16} ${node.y + 31} H ${node.x - halfWidth + 16} L ${node.x - halfWidth} ${node.y} Z`} {...shapeProps} />
      ) : null}
      {node.type === "TECHNIQUE" ? (
        <>
          <rect x={node.x - halfWidth} y={node.y - 29} width={width} height="58" {...shapeProps} />
          <rect x={node.x - halfWidth + 6} y={node.y - 23} width={width - 12} height="46" fill="none" stroke="var(--graph-technique-detail)" strokeWidth="1" aria-hidden="true" />
        </>
      ) : null}
      <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none font-serif text-[17px] font-semibold" fill={node.type === "PERSON" || node.type === "SCHOOL" ? "var(--foreground)" : "var(--graph-node-text)"}>
        {node.name}
      </text>
    </g>
  );
}

export function GraphCanvas({ nodes, edges, nodeMap, selectedNode, relatedNodeIds, onSelectNode }: GraphCanvasProps) {
  return (
    <div className="overflow-x-auto border bg-card/55 [scrollbar-gutter:stable]">
      <svg viewBox="0 0 1000 540" className="block aspect-[1000/540] min-w-[760px] w-full" role="group" aria-label="中国传统思想与术数知识图谱。使用 Tab 键在节点间移动，回车键选择。">
        <defs>
          <pattern id="graph-small-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.55" /></pattern>
          <pattern id="graph-grid" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#graph-small-grid)" /><path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.8" opacity="0.48" /></pattern>
          <marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="context-stroke" /></marker>
        </defs>
        <rect width="1000" height="540" fill="url(#graph-grid)" />
        <path d="M 42 38 H 92 M 42 38 V 88 M 958 38 H 908 M 958 38 V 88 M 42 502 H 92 M 42 502 V 452 M 958 502 H 908 M 958 502 V 452" fill="none" stroke="var(--accent)" strokeWidth="2" aria-hidden="true" />
        {edges.map((edge) => {
          const source = nodeMap.get(edge.sourceId);
          const target = nodeMap.get(edge.targetId);
          if (!source || !target) return null;
          const geometry = edgeGeometry(source, target);
          const connected = selectedNode ? edge.sourceId === selectedNode.id || edge.targetId === selectedNode.id : false;
          const labelWidth = Math.max(50, edge.label.length * 15 + 20);
          return (
            <g key={edge.id} aria-hidden="true">
              <line x1={geometry.x1} y1={geometry.y1} x2={geometry.x2} y2={geometry.y2} stroke={connected ? "var(--accent)" : "var(--muted-foreground)"} strokeWidth={connected ? 2.4 : 1.35} strokeDasharray={relationDash[edge.type]} markerEnd="url(#graph-arrow)" opacity={connected ? 1 : 0.66} vectorEffect="non-scaling-stroke" />
              <rect x={geometry.labelX - labelWidth / 2} y={geometry.labelY - 11} width={labelWidth} height="22" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
              <text x={geometry.labelX} y={geometry.labelY + 1} textAnchor="middle" dominantBaseline="middle" fill={connected ? "var(--accent)" : "var(--foreground)"} className="text-[12px]">{edge.label}</text>
            </g>
          );
        })}
        {nodes.map((node) => <NodeShape key={node.id} node={node} selected={node.id === selectedNode?.id} related={relatedNodeIds.has(node.id)} onSelect={onSelectNode} />)}
        {nodes.length === 0 ? <text x="500" y="270" textAnchor="middle" fill="var(--muted-foreground)" className="text-[18px]">尚未选择实体类型</text> : null}
      </svg>
    </div>
  );
}
