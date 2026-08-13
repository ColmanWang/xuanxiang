export enum HeavenlyStem { JIA="甲", YI="乙", BING="丙", DING="丁", WU="戊", JI="己", GENG="庚", XIN="辛", REN="壬", GUI="癸" }
export enum EarthlyBranch { ZI="子", CHOU="丑", YIN="寅", MAO="卯", CHEN="辰", SI="巳", WU="午", WEI="未", SHEN="申", YOU="酉", XU="戌", HAI="亥" }
export const HEAVENLY_STEMS = Object.values(HeavenlyStem);
export const EARTHLY_BRANCHES = Object.values(EarthlyBranch);
export interface Ganzhi { stem: HeavenlyStem; branch: EarthlyBranch; index: number }
export interface Pillar { stem: HeavenlyStem; branch: EarthlyBranch; index: number; display: string }

export function ganzhiAt(index: number): Ganzhi {
  const safe = ((index % 60) + 60) % 60;
  return { stem: HEAVENLY_STEMS[safe % 10], branch: EARTHLY_BRANCHES[safe % 12], index: safe };
}
export function nextGanzhi(value: Ganzhi, steps = 1): Ganzhi { return ganzhiAt(value.index + steps); }
export function ganzhiFromParts(stem: HeavenlyStem, branch: EarthlyBranch): Pillar {
  const index = Array.from({ length: 60 }, (_, i) => i).find((i) => HEAVENLY_STEMS[i % 10] === stem && EARTHLY_BRANCHES[i % 12] === branch);
  if (index === undefined) throw new Error(`无效干支组合：${stem}${branch}`);
  return { stem, branch, index, display: `${stem}${branch}` };
}
export function parseGanzhi(value: string): Pillar {
  const stem = HEAVENLY_STEMS.find((item) => item === value[0]);
  const branch = EARTHLY_BRANCHES.find((item) => item === value[1]);
  if (!stem || !branch) throw new Error(`无法解析干支：${value}`);
  return ganzhiFromParts(stem, branch);
}
