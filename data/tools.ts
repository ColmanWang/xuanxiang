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
    description: "记录本卦、变爻与卦变关系，保留完整起卦依据。",
    basis: "六十四卦 · 爻变",
    status: "planned",
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
