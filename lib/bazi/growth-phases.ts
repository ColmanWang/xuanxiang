import { EarthlyBranch, EARTHLY_BRANCHES, HeavenlyStem, HEAVENLY_STEMS } from "../calendar/ganzhi";
import type { GrowthPhase } from "./types";
const PHASES:GrowthPhase[]=["长生","沐浴","冠带","临官","帝旺","衰","病","死","墓","绝","胎","养"];
const START:Record<HeavenlyStem,EarthlyBranch>={甲:EarthlyBranch.HAI,乙:EarthlyBranch.WU,丙:EarthlyBranch.YIN,丁:EarthlyBranch.YOU,戊:EarthlyBranch.YIN,己:EarthlyBranch.YOU,庚:EarthlyBranch.SI,辛:EarthlyBranch.ZI,壬:EarthlyBranch.SHEN,癸:EarthlyBranch.MAO};
export function growthPhase(dayStem:HeavenlyStem,branch:EarthlyBranch):GrowthPhase{const start=EARTHLY_BRANCHES.indexOf(START[dayStem]);const target=EARTHLY_BRANCHES.indexOf(branch);const yang=HEAVENLY_STEMS.indexOf(dayStem)%2===0;const offset=((yang?target-start:start-target)%12+12)%12;return PHASES[offset];}
