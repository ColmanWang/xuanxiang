import { graphEdges, graphNodes } from "@/data/graph";

const positions: Record<string, { x: number; y: number }> = {
  zhouyi: { x: 500, y: 250 },
  yinyang: { x: 225, y: 120 },
  wuxing: { x: 760, y: 105 },
  bagua: { x: 500, y: 70 },
  xiangshu: { x: 790, y: 250 },
  wangbi: { x: 230, y: 360 },
  yixue: { x: 500, y: 430 },
  liuyao: { x: 810, y: 390 },
  "sizhu-mingli": { x: 120, y: 245 },
};

export const graphPreviewNodes = graphNodes
  .filter((node) => node.id in positions)
  .map((node) => ({ ...node, position: positions[node.id] }));

const previewNodeIds = new Set(graphPreviewNodes.map((node) => node.id));
export const graphPreviewEdges = graphEdges.filter(
  (edge) => previewNodeIds.has(edge.source) && previewNodeIds.has(edge.target),
);
