import type { Concept } from "@/types/content";

const base = [
  ["阴阳","yinyang","阴阳五行","先秦","描述相反相成、消长转化的基本范畴。"],
  ["五行","wuxing","阴阳五行","战国秦汉","木火土金水构成的关系与变化模型。"],
  ["天干","tiangan","阴阳五行","商周","甲至癸十种用于纪时与分类的符号。"],
  ["地支","dizhi","阴阳五行","商周","子至亥十二种纪时、方位与周期符号。"],
  ["八卦","bagua","易学","商周","乾坤震巽坎离艮兑八种基本卦象。"],
  ["河图","hetu","易学","宋代图式定型","传统易学中的数理图式。"],
  ["洛书","luoshu","易学","汉宋演变","以九宫数序表达秩序的图式。"],
  ["四象","sixiang","易学","先秦","由阴阳进一步分化的四种状态。"],
  ["十二长生","twelve-stages","命理学","唐宋以后","描述五行气势循环阶段的体系。"],
  ["十神","ten-gods","命理学","宋代以后","依据日干与其他干支生克关系建立的十类角色。"],
  ["纳音","nayin","命理学","汉代","六十甲子配属五行音律的分类体系。"],
  ["六十四卦","sixty-four-hexagrams","易学","商周","由八卦两两相重形成的六十四种卦象。"],
] as const;

export const concepts: Concept[] = base.map(([name, slug, system, era, summary]) => ({
  name, slug, system, era, summary, aliases: [], core: ["结构与符号", "关系与变化", "后世应用"],
  history: `${name}的含义并非一成不变，而是在经典诠释、思想争鸣与术数实践中逐步扩展。`,
  people: ["孔子（传统归属）", "京房", "邵雍"], classics: ["《周易》", "《汉书·艺文志》"], techniques: ["易占", "命理"],
  related: base.filter(([n]) => n !== name).slice(0, 4).map(([n]) => n), references: ["《周易》", "中国思想史相关研究"],
}));
