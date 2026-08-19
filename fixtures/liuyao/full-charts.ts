import type {
  LiuyaoInput,
  LiuyaoLineValue,
  PalacePosition,
  SixRelative,
  SixSpirit,
} from "@/lib/liuyao/types";

export type LiuyaoFixtureTier = "A" | "B" | "C";

interface FullChartExpected {
  primary: { number: number; name: string };
  movingLineIndices: readonly number[];
  changed: { number: number; name: string } | null;
  palace: { name: string; position: PalacePosition };
  shiYing: { shiLine: number; yingLine: number };
  dayGanzhi: string;
  monthBranch: string;
  najia: readonly string[];
  relatives: readonly SixRelative[];
  spirits: readonly SixSpirit[];
}

export interface LiuyaoFullChartFixture {
  id: string;
  tier: LiuyaoFixtureTier;
  input: LiuyaoInput;
  expected: FullChartExpected;
  verification: {
    tier: LiuyaoFixtureTier;
    source: string;
    locator: string;
    retrievedAt: string;
    note: string;
  };
}

const input = (
  lines: readonly [LiuyaoLineValue, LiuyaoLineValue, LiuyaoLineValue, LiuyaoLineValue, LiuyaoLineValue, LiuyaoLineValue],
  localDateTime: string,
  timezone: string,
  timeDisambiguation?: "EARLIER" | "LATER",
): LiuyaoInput => ({
  method: "MANUAL_LINE_VALUES",
  lines,
  divinationTime: { localDateTime, timezone, timeDisambiguation },
  ruleSetId: "STANDARD_WENWANG_GUA",
});

const crossChecked = {
  tier: "B" as const,
  source: "玄象 Phase 8 独立八宫、世应与纳甲 Golden Dataset；Calendar Core 日柱回归集",
  locator: "fixtures/liuyao/palaces.ts; fixtures/liuyao/najia.ts; fixtures/calendar/day-pillars.ts",
  retrievedAt: "2026-08-19",
  note: "完整盘用于跨模块回归；基础规则分别与独立静态表格交叉检查，不声称为原典 Tier A。",
};

export const LIUYAO_FULL_CHART_FIXTURES: readonly LiuyaoFullChartFixture[] = [
  {
    id: "multi-moving-shanghai",
    tier: "B",
    input: input([7, 8, 9, 7, 6, 8], "2026-08-19T14:30", "Asia/Shanghai"),
    expected: {
      primary: { number: 55, name: "丰" }, movingLineIndices: [2, 4], changed: { number: 17, name: "随" },
      palace: { name: "坎", position: "FIFTH" }, shiYing: { shiLine: 4, yingLine: 1 }, dayGanzhi: "乙丑", monthBranch: "申",
      najia: ["己卯", "己丑", "己亥", "庚午", "庚申", "庚戌"],
      relatives: ["OFFSPRING", "OFFICIAL_GHOST", "SIBLING", "WEALTH", "PARENT", "OFFICIAL_GHOST"],
      spirits: ["AZURE_DRAGON", "VERMILION_BIRD", "HOOK_SNAKE", "SOARING_SERPENT", "WHITE_TIGER", "BLACK_TORTOISE"],
    }, verification: crossChecked,
  },
  {
    id: "qian-no-moving-shanghai",
    tier: "B",
    input: input([7, 7, 7, 7, 7, 7], "2024-02-10T08:30", "Asia/Shanghai"),
    expected: {
      primary: { number: 1, name: "乾" }, movingLineIndices: [], changed: null,
      palace: { name: "乾", position: "PURE" }, shiYing: { shiLine: 5, yingLine: 2 }, dayGanzhi: "甲辰", monthBranch: "寅",
      najia: ["甲子", "甲寅", "甲辰", "壬午", "壬申", "壬戌"],
      relatives: ["OFFSPRING", "WEALTH", "PARENT", "OFFICIAL_GHOST", "SIBLING", "PARENT"],
      spirits: ["AZURE_DRAGON", "VERMILION_BIRD", "HOOK_SNAKE", "SOARING_SERPENT", "WHITE_TIGER", "BLACK_TORTOISE"],
    }, verification: crossChecked,
  },
  {
    id: "bottom-moving-utc",
    tier: "B",
    input: input([9, 8, 8, 8, 8, 8], "2025-01-01T00:00", "UTC"),
    expected: {
      primary: { number: 24, name: "复" }, movingLineIndices: [0], changed: { number: 2, name: "坤" },
      palace: { name: "坤", position: "FIRST" }, shiYing: { shiLine: 0, yingLine: 3 }, dayGanzhi: "庚午", monthBranch: "子",
      najia: ["庚子", "庚寅", "庚辰", "癸丑", "癸亥", "癸酉"],
      relatives: ["WEALTH", "OFFICIAL_GHOST", "SIBLING", "SIBLING", "WEALTH", "OFFSPRING"],
      spirits: ["WHITE_TIGER", "BLACK_TORTOISE", "AZURE_DRAGON", "VERMILION_BIRD", "HOOK_SNAKE", "SOARING_SERPENT"],
    }, verification: crossChecked,
  },
  {
    id: "kun-top-moving-new-york",
    tier: "B",
    input: input([8, 8, 8, 8, 8, 6], "2024-11-03T01:30", "America/New_York", "LATER"),
    expected: {
      primary: { number: 2, name: "坤" }, movingLineIndices: [5], changed: { number: 23, name: "剥" },
      palace: { name: "坤", position: "PURE" }, shiYing: { shiLine: 5, yingLine: 2 }, dayGanzhi: "辛未", monthBranch: "戌",
      najia: ["乙未", "乙巳", "乙卯", "癸丑", "癸亥", "癸酉"],
      relatives: ["SIBLING", "PARENT", "OFFICIAL_GHOST", "SIBLING", "WEALTH", "OFFSPRING"],
      spirits: ["WHITE_TIGER", "BLACK_TORTOISE", "AZURE_DRAGON", "VERMILION_BIRD", "HOOK_SNAKE", "SOARING_SERPENT"],
    }, verification: crossChecked,
  },
  {
    id: "kun-all-moving-london",
    tier: "B",
    input: input([6, 6, 6, 6, 6, 6], "2024-06-01T12:00", "Europe/London"),
    expected: {
      primary: { number: 2, name: "坤" }, movingLineIndices: [0, 1, 2, 3, 4, 5], changed: { number: 1, name: "乾" },
      palace: { name: "坤", position: "PURE" }, shiYing: { shiLine: 5, yingLine: 2 }, dayGanzhi: "丙申", monthBranch: "巳",
      najia: ["乙未", "乙巳", "乙卯", "癸丑", "癸亥", "癸酉"],
      relatives: ["SIBLING", "PARENT", "OFFICIAL_GHOST", "SIBLING", "WEALTH", "OFFSPRING"],
      spirits: ["VERMILION_BIRD", "HOOK_SNAKE", "SOARING_SERPENT", "WHITE_TIGER", "BLACK_TORTOISE", "AZURE_DRAGON"],
    }, verification: crossChecked,
  },
] as const;
