import type { GraphPreset } from "@/lib/graph/types";

export const graphPresets: GraphPreset[] = [
  {
    id: "two-roads-of-yi",
    title: "易学的两条道路",
    description: "从《周易》进入象数与义理两种解释取向。",
    nodeIds: ["zhouyi", "yizhuan", "yixue", "xiangshu", "yili", "xiangshu-yixue", "yili-yixue", "jingfang", "wangbi", "shaoyong"],
    focusNodeId: "zhouyi",
  },
  {
    id: "yinyang-to-mingli",
    title: "从阴阳五行到命理",
    description: "沿着阴阳、五行与干支，观察四柱命理的知识基础。",
    nodeIds: ["yinyang", "wuxing", "tiangan", "dizhi", "lixuzhong", "xuziping", "sizhu-mingli", "yuanhai-ziping", "sanming-tonghui"],
    focusNodeId: "sizhu-mingli",
  },
  {
    id: "weijin-network",
    title: "魏晋玄学思想网络",
    description: "以老庄、《周易》与正始以来的诠释者理解玄学论题。",
    nodeIds: ["laozi", "zhuangzi", "zhouyi", "daoism-thought", "weijin-xuanxue", "wangbi", "heyan", "guoxiang", "you-wu", "mingjiao-ziran", "yili-yixue"],
    focusNodeId: "weijin-xuanxue",
  },
  {
    id: "zhouyi-to-techniques",
    title: "从《周易》走向术数",
    description: "查看卦爻、象数、纳甲与后世占筮方法之间的层次。",
    nodeIds: ["zhouyi", "yizhuan", "bagua", "xiangshu", "xiangshu-yixue", "jingfang", "najia", "liuyao", "meihua-yishu", "qimen-dunjia"],
    focusNodeId: "zhouyi",
  },
  {
    id: "daoism-and-taoism",
    title: "道家与道教的历史关系",
    description: "区分先秦思想传统与后起宗教体系，同时保留影响与吸收关系。",
    nodeIds: ["laozi", "zhuangzi", "daoism-thought", "taoism", "yinyang", "wuxing", "gehong", "baopuzi", "weijin-xuanxue"],
    focusNodeId: "daoism-thought",
  },
];
