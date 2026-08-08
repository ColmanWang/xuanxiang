import { graphEdges, graphNodeMap, graphNodes } from "@/data/graph";

const typeLabel = {
  CONCEPT: "概念",
  PERSON: "人物",
  BOOK: "典籍",
  SCHOOL: "学派",
  TECHNIQUE: "术数",
} as const;

export function KnowledgeNetworkPreview() {
  return (
    <figure className="overflow-hidden border border-ink-rule bg-ink" aria-labelledby="network-preview-title">
      <svg
        className="h-auto min-h-[30rem] w-full"
        viewBox="0 0 1000 520"
        role="img"
        aria-labelledby="network-preview-title network-preview-description"
      >
        <title id="network-preview-title">象之网络知识图谱预览</title>
        <desc id="network-preview-description">
          典籍、概念、人物、学派与术数节点之间通过注释、影响、归属和计算基础等关系相连。
        </desc>
        <defs>
          <pattern id="network-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--ink-rule)" strokeOpacity=".35" />
          </pattern>
          <marker id="network-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-muted)" opacity=".72" />
          </marker>
        </defs>
        <rect width="1000" height="520" fill="url(#network-grid)" />

        {graphEdges.map((edge) => {
          const source = graphNodeMap.get(edge.sourceId);
          const target = graphNodeMap.get(edge.targetId);
          if (!source || !target) return null;
          const labelX = (source.x + target.x) / 2;
          const labelY = (source.y + target.y) / 2;

          return (
            <g key={edge.id}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="var(--ink-muted)"
                strokeOpacity=".42"
                markerEnd="url(#network-arrow)"
              />
              <rect x={labelX - 26} y={labelY - 9} width="52" height="16" fill="var(--ink)" opacity=".92" />
              <text x={labelX} y={labelY + 3} textAnchor="middle" fill="var(--ink-muted)" fontSize="9">
                {edge.label}
              </text>
            </g>
          );
        })}

        {graphNodes.map((node) => {
          const width = node.name.length > 3 ? 96 : 72;
          const featured = node.id === "zhouyi";
          return (
            <g key={node.id} transform={`translate(${node.x - width / 2} ${node.y - 24})`}>
              <rect
                width={width}
                height="48"
                fill={featured ? "var(--accent)" : "var(--ink)"}
                stroke={featured ? "var(--accent)" : "var(--ink-muted)"}
                strokeOpacity={featured ? 1 : 0.7}
              />
              <text x={width / 2} y="22" textAnchor="middle" fill="var(--ink-foreground)" fontFamily="var(--font-serif)" fontSize="14">
                {node.name}
              </text>
              <text x={width / 2} y="37" textAnchor="middle" fill="var(--ink-muted)" fontSize="8" letterSpacing="1">
                {typeLabel[node.type]}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-rule px-5 py-4 text-xs text-ink-muted">
        <span>节点：典籍 / 概念 / 人物 / 学派 / 术数</span>
        <span className="tabular">10 nodes · 11 relations</span>
      </figcaption>
    </figure>
  );
}
