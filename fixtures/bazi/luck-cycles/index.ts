import type { BirthInput, LuckDirection } from "@/lib/bazi/types";

export type LuckFixture = Readonly<{
  id: string;
  input: BirthInput;
  expectedDirection: LuckDirection;
  expectedStartAge: Readonly<{ years: number; months: number; days: number }>;
  expectedFirstCycles: readonly [string, string, string];
  tier: "A" | "B" | "C";
  verificationMethod: string;
  source: Readonly<{ title: string; version: string; locator: string }>;
  retrievedAt: string;
  inputPrecision: "EXACT_MINUTE" | "DOUBLE_HOUR" | "DATE_ONLY" | "HISTORICAL_RECORDED_TIME";
  ruleCompatibility: string;
  verificationNote: string;
}>;

const cases = [
  [1984,2,10,8,30,"MALE","FORWARD",8,1,14,"丁卯","戊辰","己巳"],
  [1984,2,10,8,30,"FEMALE","BACKWARD",1,9,15,"乙丑","甲子","癸亥"],
  [1990,6,15,12,0,"MALE","FORWARD",7,4,25,"癸未","甲申","乙酉"],
  [1990,6,15,12,0,"FEMALE","BACKWARD",3,0,26,"辛巳","庚辰","己卯"],
  [2000,1,7,0,0,"MALE","BACKWARD",0,2,14,"丙子","乙亥","甲戌"],
  [2000,1,7,0,0,"FEMALE","FORWARD",9,7,13,"戊寅","己卯","庚辰"],
  [2008,8,8,8,8,"MALE","FORWARD",10,1,0,"辛酉","壬戌","癸亥"],
  [2008,8,8,8,8,"FEMALE","BACKWARD",0,3,14,"己未","戊午","丁巳"],
  [2024,2,4,17,0,"MALE","FORWARD",9,10,26,"丁卯","戊辰","己巳"],
  [2024,2,4,17,0,"FEMALE","BACKWARD",0,0,2,"乙丑","甲子","癸亥"],
  [1978,12,22,6,30,"MALE","FORWARD",5,0,0,"乙丑","丙寅","丁卯"],
  [1978,12,22,6,30,"FEMALE","BACKWARD",4,9,25,"癸亥","壬戌","辛酉"],
  [1969,7,20,20,17,"MALE","BACKWARD",4,4,23,"庚午","己巳","戊辰"],
  [1969,7,20,20,17,"FEMALE","FORWARD",6,0,24,"壬申","癸酉","甲戌"],
  [1997,3,5,22,0,"MALE","BACKWARD",0,0,4,"壬寅","辛丑","庚子"],
  [1997,3,5,22,0,"FEMALE","FORWARD",10,0,19,"甲辰","乙巳","丙午"],
  [2012,11,7,9,15,"MALE","FORWARD",9,10,20,"壬子","癸丑","甲寅"],
  [2012,11,7,9,15,"FEMALE","BACKWARD",0,0,4,"庚戌","己酉","戊申"],
  [1950,10,1,15,0,"MALE","FORWARD",2,6,9,"丙戌","丁亥","戊子"],
  [1950,10,1,15,0,"FEMALE","BACKWARD",7,8,7,"甲申","癸未","壬午"],
] as const;

export const luckCycleFixtures: readonly LuckFixture[] = cases.map((item, index) => ({
  id: `luck-${String(index + 1).padStart(2, "0")}`,
  input: {
    calendarType: "GREGORIAN",
    date: { year: item[0], month: item[1], day: item[2] },
    time: { hour: item[3], minute: item[4] },
    timezone: "Asia/Shanghai",
    timePrecision: "MINUTE",
    sex: item[5],
    includeLuckCycles: true,
    ruleSetId: "STANDARD_ZIPING",
  },
  expectedDirection: item[6],
  expectedStartAge: { years: item[7], months: item[8], days: item[9] },
  expectedFirstCycles: [item[10], item[11], item[12]],
  tier: "B",
  verificationMethod: "与 lunar-typescript 1.8.6 Yun sect=2 独立实现交叉核对；并固定为回归向量。",
  source: { title: "lunar-typescript Yun 独立排运实现", version: "1.8.6", locator: "Yun.getStartYear/getStartMonth/getStartDay 与 getDaYun" },
  retrievedAt: "2026-08-13",
  inputPrecision: "EXACT_MINUTE",
  ruleCompatibility: "STANDARD_ZIPING@1.1.0 · sect=2",
  verificationNote: index===1||index===4?"顺逆与序列一致；余数日比 Provider 少一日，已分类为 Provider rounding/decomposition difference。":"顺逆、起运年/月/日与前三步大运交叉一致。",
}));

export function validateLuckFixtureProvenance(fixtures: readonly LuckFixture[] = luckCycleFixtures) {
  const errors = fixtures.flatMap((fixture) => {
    const missing = [fixture.source.title,fixture.source.version,fixture.source.locator,fixture.retrievedAt,fixture.ruleCompatibility,fixture.verificationNote].some((value)=>!value.trim());
    const invalidTierA = fixture.tier==="A" && (!fixture.source.locator || fixture.inputPrecision!=="EXACT_MINUTE");
    return missing||invalidTierA?[`${fixture.id}: provenance 不完整或不满足 Tier A 输入精度`]:[];
  });
  return { valid: errors.length===0, errors };
}
