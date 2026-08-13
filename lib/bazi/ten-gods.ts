import { HEAVENLY_STEMS, type HeavenlyStem } from "../calendar/ganzhi";
import type { FiveElement, TenGod } from "./types";
const ELEMENTS:FiveElement[]=["木","木","火","火","土","土","金","金","水","水"];
const GENERATES:Record<FiveElement,FiveElement>={木:"火",火:"土",土:"金",金:"水",水:"木"};
const CONTROLS:Record<FiveElement,FiveElement>={木:"土",土:"水",水:"火",火:"金",金:"木"};
export function stemElement(stem:HeavenlyStem):FiveElement{return ELEMENTS[HEAVENLY_STEMS.indexOf(stem)];}
export function tenGod(day:HeavenlyStem,other:HeavenlyStem):TenGod{
  if(day===other)return"比肩"; const de=stemElement(day),oe=stemElement(other),samePolarity=HEAVENLY_STEMS.indexOf(day)%2===HEAVENLY_STEMS.indexOf(other)%2;
  if(de===oe)return samePolarity?"比肩":"劫财"; if(GENERATES[de]===oe)return samePolarity?"食神":"伤官"; if(CONTROLS[de]===oe)return samePolarity?"偏财":"正财"; if(CONTROLS[oe]===de)return samePolarity?"七杀":"正官"; return samePolarity?"偏印":"正印";
}
