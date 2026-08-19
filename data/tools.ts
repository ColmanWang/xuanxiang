import type { DeductionSystem } from "@/types/content";

export const deductionSystems: DeductionSystem[] = [
  {
    name: "八字推演",
    slug: "bazi",
    description: "依据历法、节气与干支规则生成四柱结构。",
    basis: "干支历法 · 五行关系",
    status: "available",
  },
  {
    name: "六爻推演",
    slug: "liuyao",
    description: "依据六个爻值生成本卦、动爻、变卦、纳甲、世应、六亲与六神结构。",
    basis: "六十四卦 · 纳甲 · 世应",
    status: "available",
  },
  {
    name: "紫微推演",
    slug: "ziwei",
    description: "以历法、宫位与星曜规则构建结构化命盘。",
    basis: "十二宫 · 星曜系统",
    status: "planned",
  },
  {
    name: "奇门推演",
    slug: "qimen",
    description: "按时空规则排列九宫、三奇六仪与八门九星。",
    basis: "九宫 · 干支 · 节气",
    status: "planned",
  },
  {
    name: "风水分析",
    slug: "fengshui",
    description: "记录形势、方位与环境要素，为后续规则模型预留。",
    basis: "方位 · 形势 · 环境",
    status: "planned",
  },
];

export const tools = deductionSystems;
