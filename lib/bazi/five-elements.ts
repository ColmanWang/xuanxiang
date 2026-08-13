import { EarthlyBranch as B, type Pillar } from "../calendar/ganzhi";
import type { FiveElement } from "./types";
import { stemElement } from "./ten-gods";
const BRANCH_ELEMENT:Record<B,FiveElement>={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
export function branchElement(branch:B):FiveElement{return BRANCH_ELEMENT[branch];}
export function countFiveElements(pillars:Array<Pillar|null>):Record<FiveElement,number>{const result:Record<FiveElement,number>={木:0,火:0,土:0,金:0,水:0};for(const p of pillars){if(!p)continue;result[stemElement(p.stem)]++;result[branchElement(p.branch)]++;}return result;}
