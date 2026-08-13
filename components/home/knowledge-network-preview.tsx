import { entityTypeLabels } from "@/components/graph/graph-config";
import type { GraphEdge, GraphNode } from "@/lib/graph/types";

const positions: Record<string, { x: number; y: number }> = { zhouyi:{x:500,y:250},yinyang:{x:225,y:120},wuxing:{x:760,y:105},bagua:{x:500,y:70},xiangshu:{x:790,y:250},wangbi:{x:230,y:360},yixue:{x:500,y:430},liuyao:{x:810,y:390},"sizhu-mingli":{x:120,y:245} };

export function KnowledgeNetworkPreview({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const graphPreviewNodes = nodes.map((node) => ({ ...node, position: positions[node.id] ?? node.position }));
  const previewNodeMap = new Map(graphPreviewNodes.map((node) => [node.id, node]));
  return (
    <figure className="overflow-hidden border border-ink-rule bg-ink" aria-labelledby="network-preview-title">
      <svg className="h-auto min-h-[30rem] w-full" viewBox="0 0 1000 520" role="img" aria-labelledby="network-preview-title network-preview-description">
        <title id="network-preview-title">象之网络知识图谱预览</title>
        <desc id="network-preview-description">以周易为中心，连接阴阳、八卦、象数、五行、王弼、易学、六爻与四柱命理。</desc>
        <defs><pattern id="network-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--ink-rule)" strokeOpacity=".35" /></pattern><marker id="network-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-muted)" opacity=".72" /></marker></defs>
        <rect width="1000" height="520" fill="url(#network-grid)" />
        {edges.map((edge) => {
          const source = previewNodeMap.get(edge.source);
          const target = previewNodeMap.get(edge.target);
          if (!source || !target) return null;
          return <line key={edge.id} x1={source.position.x} y1={source.position.y} x2={target.position.x} y2={target.position.y} stroke="var(--ink-muted)" strokeOpacity=".44" strokeDasharray={edge.type === "RELATED_TO" ? "5 5" : undefined} markerEnd="url(#network-arrow)" />;
        })}
        {graphPreviewNodes.map((node) => {
          const width = node.title.length > 4 ? 112 : 82;
          const featured = node.id === "zhouyi";
          return <g key={node.id} transform={`translate(${node.position.x - width / 2} ${node.position.y - 27})`}><rect width={width} height="54" fill={featured ? "var(--accent)" : "var(--ink)"} stroke={featured ? "var(--accent)" : "var(--ink-muted)"} strokeOpacity={featured ? 1 : 0.68} /><text x={width / 2} y="24" textAnchor="middle" fill="var(--ink-foreground)" fontFamily="var(--font-serif)" fontSize="15">{node.title}</text><text x={width / 2} y="41" textAnchor="middle" fill="var(--ink-muted)" fontSize="8" letterSpacing="1">{entityTypeLabels[node.entityType]}</text></g>;
        })}
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-rule px-5 py-4 text-xs text-ink-muted"><span>思想不是孤立的条目，而是在时代中彼此连接、解释与演化。</span><span className="tabular">{graphPreviewNodes.length} nodes · {edges.length} relations</span></figcaption>
    </figure>
  );
}
