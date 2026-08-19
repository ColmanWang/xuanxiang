import { EarthlyBranch } from "@/lib/calendar/ganzhi";
import type { FiveElement } from "./types";
export const BRANCH_ELEMENT:Record<EarthlyBranch,FiveElement>={子:"WATER",亥:"WATER",寅:"WOOD",卯:"WOOD",巳:"FIRE",午:"FIRE",申:"METAL",酉:"METAL",辰:"EARTH",戌:"EARTH",丑:"EARTH",未:"EARTH"};
const PRODUCES:Record<FiveElement,FiveElement>={WOOD:"FIRE",FIRE:"EARTH",EARTH:"METAL",METAL:"WATER",WATER:"WOOD"};
const CONTROLS:Record<FiveElement,FiveElement>={WOOD:"EARTH",EARTH:"WATER",WATER:"FIRE",FIRE:"METAL",METAL:"WOOD"};
export const produces=(from:FiveElement,to:FiveElement)=>PRODUCES[from]===to;
export const controls=(from:FiveElement,to:FiveElement)=>CONTROLS[from]===to;
