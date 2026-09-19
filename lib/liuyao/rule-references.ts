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
  traditionalDescription: string;
  formalization: string;
  scopeNote: string;
  knownVariants?: readonly string[];
}

export const LIUYAO_RULE_REFERENCES: LiuyaoRuleReference[] = [
  {
    policyId: "HEXAGRAM_BOTTOM_TO_TOP_V1",
    referenceRole: "DIRECT_RULE",
    evidenceStatus: "DOCUMENTED",
    citationIds: [],
    traditionalDescription: "爻位由初爻向上成卦。",
    formalization: "玄象内部固定 index 0 = 初爻，index 5 = 上爻；UI 视觉层可以自上而下显示，但进入引擎前必须为 bottom-to-top。",
    scopeNote: "此处只定义输入与数组方向，不涉及卦义或断卦。",
  },
  {
    policyId: "NAJIA_JINGFANG_COMMON_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: ["citation-liuyao-najia"],
    traditionalDescription: "南宋文献已逐爻列出八纯卦纳干支，属于后世对京氏易法的明确记载。",
    formalization: "玄象将表格形式化为下卦三爻用内卦、上卦三爻用外卦，并完整返回天干与地支。",
    scopeNote: "Citation 支持八纯卦逐爻表，不证明该排法由《周易》经文直接规定，也不解决最早来源问题。",
    knownVariants: ["纳甲来源与京房易的具体历史关系存在文献层累，当前不宣称最早出处。"],
  },
  {
    policyId: "EIGHT_PALACES_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: ["citation-liuyao-palaces"],
    traditionalDescription: "《事林广记》续集卷十一列出八宫各宫的一至五世、游魂与归魂卦序。",
    formalization: "玄象以八纯卦为本宫，将一至五世、游魂、归魂序列编码为 PalacePosition，并映射全部六十四卦。",
    scopeNote: "原文支持后世八宫定式；位掩码、枚举与0-based索引属于玄象工程定义。",
  },
  {
    policyId: "SHI_YING_EIGHT_PALACES_V1",
    referenceRole: "DIRECT_RULE",
    evidenceStatus: "TRADITIONAL",
    citationIds: ["citation-liuyao-shi-ying"],
    traditionalDescription: "《项氏家说》记本宫上爻为世、归魂三爻为世，其余以所变之爻为世，所对者为应。",
    formalization: "玄象将世位映射为 0–5 line index，应位按对爻关系计算，避免从展示文字反向解析。",
    scopeNote: "Citation 支持世应位置原则；内部索引与函数返回结构是玄象形式化。",
  },
  {
    policyId: "SIX_RELATIVES_PALACE_ELEMENT_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "TRADITIONAL",
    citationIds: ["citation-liuyao-six-relatives"],
    traditionalDescription: "后世文献以生我、我生、克我、我克、比和配置父母、子孙、官鬼、妻财、兄弟。",
    formalization: "玄象以卦宫五行为“我”，与爻支五行作五种关系映射。",
    scopeNote: "六亲是传统排盘标签，不等于现实家庭成员或性别判断。",
  },
  {
    policyId: "SIX_SPIRITS_DAY_STEM_V1",
    referenceRole: "LATER_FORMULATION",
    evidenceStatus: "TRADITIONAL",
    citationIds: ["citation-liuyao-six-spirits"],
    traditionalDescription: "《增删卜易》卷首起例列出甲乙、丙丁、戊、己、庚辛、壬癸各自起六神的后世定式。",
    formalization: "玄象用日干确定初爻六神，并按稳定枚举自下而上轮转六爻。",
    scopeNote: "只生成结构标签；不使用文献中的吉凶断语。螣蛇/腾蛇、玄武/元武作为知识层异体，算法枚举保持稳定。",
    knownVariants: ["《事林广记》续集卷十一所见十干起六神表与本规则在戊己起例上存在差异，已作为来源差异登记，不作为当前算法 Citation。"],
  },
  {
    policyId: "LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "INFERRED",
    citationIds: ["citation-liuyao-month-jian-zengshan", "citation-liuyao-day-context-zengshan"],
    traditionalDescription: "后世六爻体系使用月建、日辰；以十二节分月的完整 Passage 典据仍待影像校订。",
    formalization: "玄象复用 Calendar Core 的天文节气 Instant，按立春起寅月、惊蛰起卯月等十二节切换月建；日辰按起卦地 IANA 时区民用日计算。",
    scopeNote: "天文节气时刻属于 Calendar Fact；选择这些节作为月建边界属于六爻规则。当前 Citation 缺口保持可见。",
    knownVariants: ["月建是否按节气或朔望月切换，在资料与实践中存在不同说法，本阶段不做断卦层判断。"],
  },
  {
    policyId: "HIDDEN_SPIRITS_NOT_IMPLEMENTED_V1",
    referenceRole: "EDITORIAL_CONTEXT",
    evidenceStatus: "CONTESTED",
    citationIds: ["citation-liuyao-hidden-context"],
    traditionalDescription: "《项氏家说》保存飞伏规则说明，但现有材料尚不足以覆盖伏神装配的全部适用条件与异说。",
    formalization: "玄象仅保留 hiddenSpirit 字段并返回 null 与 NOT_IMPLEMENTED；未执行伏神排布。",
    scopeNote: "已有历史线索不等于算法已验证；缺少独立 Golden Dataset 与至少20条可靠 fixtures。",
  },
];
