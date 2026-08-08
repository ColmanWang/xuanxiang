import type { Classic } from "@/types/content";
const rows = [
 ["《周易》","zhouyi","先秦","佚名","易学","由卦爻符号、卦爻辞及传文构成的经典。"],
 ["《老子》","laozi","春秋战国","老子（传统归属）","道家","以道、德、自然与无为为核心的思想经典。"],
 ["《庄子》","zhuangzi","战国","庄周及后学","道家","以寓言与论辩探讨自由、齐物与生命境界。"],
 ["《抱朴子》","baopuzi","东晋","葛洪","道教","兼论神仙方术、炼养与社会政治。"],
 ["《渊海子平》","yuanhai-ziping","宋","徐大升编","命理","现存较早系统论述子平命理的著作。"],
 ["《三命通会》","sanming-tonghui","明","万民英","命理","汇集明以前命理材料的重要总集。"],
 ["《滴天髓》","ditiansui","明清","作者有争议","命理","以简约歌诀阐发命理气势与格局。"],
 ["《子平真诠》","ziping-zhenquan","清","沈孝瞻","命理","以月令、格局为中心论述子平法。"],
 ["《葬书》","zangshu","晋（传统归属）","郭璞（传统归属）","堪舆","讨论生气与葬地选择的代表性文献。"],
] as const;
export const classics: Classic[] = rows.map(([title,slug,dynasty,author,category,summary]) => ({ title,slug,dynasty,author,category,summary,status:`${title}在${category}传统中具有重要的文献与思想史价值。`,contents:["基本理论","核心范畴","后世注解与流传"],people:[author],concepts:["阴阳","五行","天人关系"],techniques:[category] }));
