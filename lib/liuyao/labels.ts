import type {
  FiveElement,
  LiuyaoLineState,
  LiuyaoRuleSetStatus,
  LiuyaoTraceKind,
  PalacePosition,
  SixRelative,
  SixSpirit,
  YinYang,
} from "./types";

export const YIN_YANG_LABEL: Record<YinYang, string> = { YIN: "阴", YANG: "阳" };
export const LINE_STATE_LABEL: Record<LiuyaoLineState, string> = {
  OLD_YIN: "老阴",
  YOUNG_YANG: "少阳",
  YOUNG_YIN: "少阴",
  OLD_YANG: "老阳",
};
export const PALACE_POSITION_LABEL: Record<PalacePosition, string> = {
  PURE: "本宫",
  FIRST: "一世",
  SECOND: "二世",
  THIRD: "三世",
  FOURTH: "四世",
  FIFTH: "五世",
  WANDERING_SOUL: "游魂",
  RETURNING_SOUL: "归魂",
};
export const FIVE_ELEMENT_LABEL: Record<FiveElement, string> = {
  WOOD: "木",
  FIRE: "火",
  EARTH: "土",
  METAL: "金",
  WATER: "水",
};
export const SIX_RELATIVE_LABEL: Record<SixRelative, string> = {
  SIBLING: "兄弟",
  PARENT: "父母",
  OFFSPRING: "子孙",
  WEALTH: "妻财",
  OFFICIAL_GHOST: "官鬼",
};
export const SIX_SPIRIT_LABEL: Record<SixSpirit, string> = {
  AZURE_DRAGON: "青龙",
  VERMILION_BIRD: "朱雀",
  HOOK_SNAKE: "勾陈",
  SOARING_SERPENT: "螣蛇",
  WHITE_TIGER: "白虎",
  BLACK_TORTOISE: "玄武",
};
export const LIUYAO_TRACE_KIND_LABEL: Record<LiuyaoTraceKind, string> = {
  INPUT_FACT: "起卦输入",
  CALENDAR_FACT: "历法事实",
  TRADITIONAL_RULE: "传统规则",
  RULESET_CHOICE: "规则选择",
  DERIVED_CALCULATION: "派生计算",
};
export const LIUYAO_RULE_STATUS_LABEL: Record<LiuyaoRuleSetStatus, string> = {
  EXPERIMENTAL: "实验规则",
  STABLE: "稳定规则",
  RESEARCH_ONLY: "研究规则",
  TEST_ONLY: "测试规则",
};
