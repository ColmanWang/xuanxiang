import type { GraphEdge, GraphNode } from "@/types/graph";

export const graphNodes: GraphNode[] = [
  { id: "zhouyi", name: "周易", type: "BOOK", summary: "易学象数与义理传统的核心经典。", x: 490, y: 260 },
  { id: "yinyang", name: "阴阳", type: "CONCEPT", summary: "描述相反相成与消长变化的基本范畴。", x: 260, y: 150 },
  { id: "wuxing", name: "五行", type: "CONCEPT", summary: "以木火土金水表达关系与变化的模型。", x: 735, y: 150 },
  { id: "ganzhi", name: "天干地支", type: "CONCEPT", summary: "传统纪时、方位和分类系统。", x: 760, y: 365 },
  { id: "bazi", name: "八字", type: "TECHNIQUE", summary: "以出生时刻四柱为基础的干支推演体系。", x: 540, y: 445 },
  { id: "qimen", name: "奇门", type: "TECHNIQUE", summary: "基于节气、干支与九宫关系的传统术数。", x: 885, y: 275 },
  { id: "laozi", name: "老子", type: "BOOK", summary: "道家思想的重要经典。", x: 120, y: 300 },
  { id: "zhuangzi", name: "庄子", type: "BOOK", summary: "讨论齐物、自然与生命境界的经典。", x: 235, y: 410 },
  { id: "wangbi", name: "王弼", type: "PERSON", summary: "魏晋玄学的重要思想家与注家。", x: 360, y: 350 },
  { id: "xuanxue", name: "魏晋玄学", type: "SCHOOL", summary: "以三玄重释本体、自然与名教的思想运动。", x: 365, y: 70 },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", sourceId: "zhouyi", targetId: "yinyang", type: "RELATED_TO", label: "阐释" },
  { id: "e2", sourceId: "zhouyi", targetId: "wuxing", type: "RELATED_TO", label: "汇合" },
  { id: "e3", sourceId: "wuxing", targetId: "ganzhi", type: "RELATED_TO", label: "配属" },
  { id: "e4", sourceId: "bazi", targetId: "ganzhi", type: "DERIVED_FROM", label: "计算基础" },
  { id: "e5", sourceId: "qimen", targetId: "ganzhi", type: "DERIVED_FROM", label: "时空基础" },
  { id: "e6", sourceId: "wangbi", targetId: "zhouyi", type: "RELATED_TO", label: "注释" },
  { id: "e7", sourceId: "wangbi", targetId: "laozi", type: "RELATED_TO", label: "注释" },
  { id: "e8", sourceId: "laozi", targetId: "xuanxue", type: "INFLUENCED", label: "思想资源" },
  { id: "e9", sourceId: "zhuangzi", targetId: "xuanxue", type: "INFLUENCED", label: "思想资源" },
  { id: "e10", sourceId: "wangbi", targetId: "xuanxue", type: "BELONGS_TO", label: "代表人物" },
  { id: "e11", sourceId: "yinyang", targetId: "wuxing", type: "RELATED_TO", label: "体系汇合" },
];

export const graphNodeMap = new Map(graphNodes.map((node) => [node.id, node]));
