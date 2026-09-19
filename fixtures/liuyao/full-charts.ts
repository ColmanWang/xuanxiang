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
    sourceType: "EXTERNAL" | "CROSS_CHECK" | "SYNTHETIC";
    ruleSet: string;
    verificationMethod: string;
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
  sourceType: "CROSS_CHECK" as const,
  ruleSet: "STANDARD_WENWANG_GUA@1.0.0",
  verificationMethod: "独立静态八宫、世应、纳甲表与 Calendar Core fixture 组合核对",
};

const synthetic = {
  tier: "C" as const,
  source: "玄象人工设计结构性回归输入",
  locator: "fixtures/liuyao/full-charts.ts",
  retrievedAt: "2026-08-29",
  note: "合成盘用于跨宫、动爻、多时区与节月结构回归，不声称为外部盘例。",
  sourceType: "SYNTHETIC" as const,
  ruleSet: "STANDARD_WENWANG_GUA@1.0.0",
  verificationMethod: "固定输出回归；基础字段由独立 Golden Dataset 分层验证",
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
  {id:"synthetic-6",tier:"C",input:input([7,8,7,8,7,8],"2026-02-04T04:00","Asia/Shanghai"),expected:{primary:{number:63,name:"既济"},movingLineIndices:[],changed:null,palace:{name:"坎",position:"THIRD"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"己酉",monthBranch:"丑",najia:["己卯","己丑","己亥","戊申","戊戌","戊子"],relatives:["OFFSPRING","OFFICIAL_GHOST","SIBLING","PARENT","OFFICIAL_GHOST","SIBLING"],spirits:["SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE"]},verification:synthetic},
  {id:"synthetic-7",tier:"C",input:input([8,7,8,7,8,7],"2026-03-05T22:00","UTC"),expected:{primary:{number:64,name:"未济"},movingLineIndices:[],changed:null,palace:{name:"离",position:"THIRD"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"戊寅",monthBranch:"卯",najia:["戊寅","戊辰","戊午","己酉","己未","己巳"],relatives:["PARENT","OFFSPRING","SIBLING","WEALTH","OFFSPRING","SIBLING"],spirits:["HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD"]},verification:synthetic},
  {id:"synthetic-8",tier:"C",input:input([9,7,8,8,7,8],"2026-04-05T10:00","Asia/Tokyo"),expected:{primary:{number:60,name:"节"},movingLineIndices:[0],changed:{number:29,name:"坎"},palace:{name:"坎",position:"FIRST"},shiYing:{shiLine:0,yingLine:3},dayGanzhi:"己酉",monthBranch:"辰",najia:["丁巳","丁卯","丁丑","戊申","戊戌","戊子"],relatives:["WEALTH","OFFSPRING","OFFICIAL_GHOST","PARENT","OFFICIAL_GHOST","SIBLING"],spirits:["SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE"]},verification:synthetic},
  {id:"synthetic-9",tier:"C",input:input([8,9,7,8,8,7],"2026-05-05T08:30","Asia/Hong_Kong"),expected:{primary:{number:18,name:"蛊"},movingLineIndices:[1],changed:{number:52,name:"艮"},palace:{name:"巽",position:"RETURNING_SOUL"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"己卯",monthBranch:"辰",najia:["辛丑","辛亥","辛酉","丙戌","丙子","丙寅"],relatives:["WEALTH","PARENT","OFFICIAL_GHOST","WEALTH","PARENT","SIBLING"],spirits:["SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE"]},verification:synthetic},
  {id:"synthetic-10",tier:"C",input:input([7,8,6,9,7,8],"2026-06-05T12:00","Europe/London"),expected:{primary:{number:17,name:"随"},movingLineIndices:[2,3],changed:{number:63,name:"既济"},palace:{name:"震",position:"RETURNING_SOUL"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"庚戌",monthBranch:"巳",najia:["庚子","庚寅","庚辰","丁亥","丁酉","丁未"],relatives:["PARENT","SIBLING","WEALTH","PARENT","OFFICIAL_GHOST","WEALTH"],spirits:["WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT"]},verification:synthetic},
  {id:"synthetic-11",tier:"C",input:input([8,7,9,6,8,7],"2026-07-07T01:00","America/Los_Angeles"),expected:{primary:{number:18,name:"蛊"},movingLineIndices:[2,3],changed:{number:64,name:"未济"},palace:{name:"巽",position:"RETURNING_SOUL"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"壬午",monthBranch:"未",najia:["辛丑","辛亥","辛酉","丙戌","丙子","丙寅"],relatives:["WEALTH","PARENT","OFFICIAL_GHOST","WEALTH","PARENT","SIBLING"],spirits:["BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER"]},verification:synthetic},
  {id:"synthetic-12",tier:"C",input:input([7,9,8,7,6,9],"2026-08-07T15:00","Australia/Sydney"),expected:{primary:{number:38,name:"睽"},movingLineIndices:[1,4,5],changed:{number:17,name:"随"},palace:{name:"艮",position:"FOURTH"},shiYing:{shiLine:3,yingLine:0},dayGanzhi:"癸丑",monthBranch:"未",najia:["丁巳","丁卯","丁丑","己酉","己未","己巳"],relatives:["PARENT","OFFICIAL_GHOST","SIBLING","OFFSPRING","SIBLING","PARENT"],spirits:["BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER"]},verification:synthetic},
  {id:"synthetic-13",tier:"C",input:input([6,8,7,9,8,7],"2026-09-07T09:00","America/New_York"),expected:{primary:{number:56,name:"旅"},movingLineIndices:[0,3],changed:{number:22,name:"贲"},palace:{name:"离",position:"FIRST"},shiYing:{shiLine:0,yingLine:3},dayGanzhi:"甲申",monthBranch:"申",najia:["丙辰","丙午","丙申","己酉","己未","己巳"],relatives:["OFFSPRING","SIBLING","WEALTH","WEALTH","OFFSPRING","SIBLING"],spirits:["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"]},verification:synthetic},
  {id:"synthetic-14",tier:"C",input:input([7,7,8,8,9,6],"2026-10-08T03:00","UTC"),expected:{primary:{number:60,name:"节"},movingLineIndices:[4,5],changed:{number:41,name:"损"},palace:{name:"坎",position:"FIRST"},shiYing:{shiLine:0,yingLine:3},dayGanzhi:"乙卯",monthBranch:"酉",najia:["丁巳","丁卯","丁丑","戊申","戊戌","戊子"],relatives:["WEALTH","OFFSPRING","OFFICIAL_GHOST","PARENT","OFFICIAL_GHOST","SIBLING"],spirits:["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"]},verification:synthetic},
  {id:"synthetic-15",tier:"C",input:input([8,8,7,7,6,9],"2026-11-07T11:00","Asia/Shanghai"),expected:{primary:{number:56,name:"旅"},movingLineIndices:[4,5],changed:{number:31,name:"咸"},palace:{name:"离",position:"FIRST"},shiYing:{shiLine:0,yingLine:3},dayGanzhi:"乙酉",monthBranch:"戌",najia:["丙辰","丙午","丙申","己酉","己未","己巳"],relatives:["OFFSPRING","SIBLING","WEALTH","WEALTH","OFFSPRING","SIBLING"],spirits:["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"]},verification:synthetic},
  {id:"synthetic-16",tier:"C",input:input([9,8,8,7,7,6],"2026-12-07T18:00","Asia/Tokyo"),expected:{primary:{number:17,name:"随"},movingLineIndices:[0,5],changed:{number:12,name:"否"},palace:{name:"震",position:"RETURNING_SOUL"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"乙卯",monthBranch:"子",najia:["庚子","庚寅","庚辰","丁亥","丁酉","丁未"],relatives:["PARENT","SIBLING","WEALTH","PARENT","OFFICIAL_GHOST","WEALTH"],spirits:["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"]},verification:synthetic},
  {id:"synthetic-17",tier:"C",input:input([6,7,7,8,8,9],"2027-01-05T10:00","Europe/London"),expected:{primary:{number:18,name:"蛊"},movingLineIndices:[0,5],changed:{number:11,name:"泰"},palace:{name:"巽",position:"RETURNING_SOUL"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"甲申",monthBranch:"子",najia:["辛丑","辛亥","辛酉","丙戌","丙子","丙寅"],relatives:["WEALTH","PARENT","OFFICIAL_GHOST","WEALTH","PARENT","SIBLING"],spirits:["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"]},verification:synthetic},
  {id:"synthetic-18",tier:"C",input:input([7,6,9,8,7,8],"2024-02-29T12:30","Asia/Hong_Kong"),expected:{primary:{number:63,name:"既济"},movingLineIndices:[1,2],changed:{number:60,name:"节"},palace:{name:"坎",position:"THIRD"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"癸亥",monthBranch:"寅",najia:["己卯","己丑","己亥","戊申","戊戌","戊子"],relatives:["OFFSPRING","OFFICIAL_GHOST","SIBLING","PARENT","OFFICIAL_GHOST","SIBLING"],spirits:["BLACK_TORTOISE","AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER"]},verification:synthetic},
  {id:"synthetic-19",tier:"C",input:input([8,9,6,7,8,9],"2025-03-09T01:30","America/New_York"),expected:{primary:{number:64,name:"未济"},movingLineIndices:[1,2,5],changed:{number:62,name:"小过"},palace:{name:"离",position:"THIRD"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"丁丑",monthBranch:"卯",najia:["戊寅","戊辰","戊午","己酉","己未","己巳"],relatives:["PARENT","OFFSPRING","SIBLING","WEALTH","OFFSPRING","SIBLING"],spirits:["VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON"]},verification:synthetic},
  {id:"synthetic-20",tier:"C",input:input([9,6,7,8,9,6],"2025-10-05T03:30","Australia/Sydney"),expected:{primary:{number:63,name:"既济"},movingLineIndices:[0,1,4,5],changed:{number:18,name:"蛊"},palace:{name:"坎",position:"THIRD"},shiYing:{shiLine:2,yingLine:5},dayGanzhi:"丁未",monthBranch:"酉",najia:["己卯","己丑","己亥","戊申","戊戌","戊子"],relatives:["OFFSPRING","OFFICIAL_GHOST","SIBLING","PARENT","OFFICIAL_GHOST","SIBLING"],spirits:["VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE","AZURE_DRAGON"]},verification:synthetic},
] as const;
