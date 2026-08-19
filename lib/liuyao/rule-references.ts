import type { EvidenceStatus } from "@prisma/client";

export type LiuyaoRuleReferenceRole =
  | "DIRECT_RULE"
  | "HISTORICAL_PRECEDENT"
  | "LATER_FORMULATION"
  | "COMMENTARY"
  | "EDITORIAL_CONTEXT";

export interface LiuyaoRuleReference {
  policyId: string;
  referenceRole: LiuyaoRuleReferenceRole;
  evidenceStatus: EvidenceStatus;
  citationIds: readonly string[];
  sourceNote: string;
  formalizationNote: string;
  knownVariants?: readonly string[];
}

export const LIUYAO_RULE_REFERENCES: LiuyaoRuleReference[] = [
  {
    policyId: "HEXAGRAM_BOTTOM_TO_TOP_V1",
    referenceRole: "DIRECT_RULE",
    evidenceStatus: "DOCUMENTED",
    citationIds: [],
    sourceNote: "六爻起卦按初爻至上爻排列；项目内暂未建立 Passage 级六爻规则引用。",
    formalizationNote: "玄象内部固定 index 0 = 初爻，index 5 = 上爻；UI 视觉层可以自上而下显示，但进入引擎前必须为 bottom-to-top。",
  },
  {
    policyId: "NAJIA_JINGFANG_COMMON_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: [],
    sourceNote: "公开文本中可见纳甲装卦歌和纳甲表；正式 Passage 典据仍待人工校订后入库。",
    formalizationNote: "玄象将通行纳甲表形式化为下卦三爻用内卦、上卦三爻用外卦，并完整返回天干与地支。",
    knownVariants: ["纳甲来源与京房易的具体历史关系存在文献层累，当前不宣称最早出处。"],
  },
  {
    policyId: "EIGHT_PALACES_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: [],
    sourceNote: "八宫全图可在《增删卜易》等公开原文中核对；本阶段不批量导入整章。",
    formalizationNote: "玄象以八纯卦为本宫，通过一至五世、游魂、归魂序列确定每卦所属宫与宫位。",
  },
  {
    policyId: "SHI_YING_EIGHT_PALACES_V1",
    referenceRole: "DIRECT_RULE",
    evidenceStatus: "TRADITIONAL",
    citationIds: [],
    sourceNote: "安世应诀可在公开《卜筮正宗》文本中核对；正式 Passage 典据仍待校订。",
    formalizationNote: "玄象将世位映射为 0–5 line index，应位固定为世位相隔三爻，避免在 UI 字符串中反向解析。",
  },
  {
    policyId: "SIX_RELATIVES_PALACE_ELEMENT_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "TRADITIONAL",
    citationIds: [],
    sourceNote: "六亲装配与五行生克关系相关；具体原典链路待 Phase 8.5 hardening。",
    formalizationNote: "玄象以卦宫五行为“我”，比较爻支五行：同我为兄弟，生我为父母，我生为子孙，克我为官鬼，我克为妻财。",
  },
  {
    policyId: "SIX_SPIRITS_DAY_STEM_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: [],
    sourceNote: "日干起六神在公开《卜筮正宗》《增删卜易》相关章目中可见；本阶段不加入吉凶解释。",
    formalizationNote: "玄象使用日干确定初爻六神，并按青龙、朱雀、勾陈、螣蛇、白虎、玄武顺序自下而上轮转。",
  },
  {
    policyId: "LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "INFERRED",
    citationIds: [],
    sourceNote: "六爻文本明确使用月建、日辰；当前节气换月口径为玄象形式化选择，待后续规则硬化。",
    formalizationNote: "玄象复用 Calendar Core 的节气边界，按立春起寅月、惊蛰起卯月等十二节确定月建；日辰按起卦地 IANA 时区的民用日计算。",
    knownVariants: ["月建是否按节气或朔望月切换，在资料与实践中存在不同说法，本阶段不做断卦层判断。"],
  },
  {
    policyId: "HIDDEN_SPIRITS_NOT_IMPLEMENTED_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "CONTESTED",
    citationIds: [],
    sourceNote: "伏神/飞神规则牵涉用神、缺爻、卦宫等后续判断体系；当前未进入稳定计算。",
    formalizationNote: "玄象仅在数据结构中保留 hiddenSpirit 字段，返回 null 与 NOT_IMPLEMENTED 状态，不伪造伏神结果。",
  },
];
