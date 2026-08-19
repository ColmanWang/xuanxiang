import { hexagramFromLines } from "./hexagrams";
import { TRIGRAM_LIST } from "./trigrams";
import type { Hexagram,PalacePosition,Trigram,YinYang } from "./types";
const POSITIONS:PalacePosition[]=["PURE","FIRST","SECOND","THIRD","FOURTH","FIFTH","WANDERING_SOUL","RETURNING_SOUL"];
const MASKS=[[],[0],[0,1],[0,1,2],[0,1,2,3],[0,1,2,3,4],[0,1,2,4],[4]] as const;
const flip=(bits:readonly YinYang[],indices:readonly number[])=>bits.map((bit,index)=>indices.includes(index)?(bit==="YANG"?"YIN":"YANG"):bit) as unknown as Hexagram["lines"];
const assignments=new Map<string,{trigram:Trigram;position:PalacePosition}>();
for(const trigram of TRIGRAM_LIST){const pure=[...trigram.bits,...trigram.bits] as Hexagram["lines"];MASKS.forEach((mask,index)=>assignments.set(hexagramFromLines(flip(pure,mask)).id,{trigram,position:POSITIONS[index]}));}
export function palaceFor(hexagram:Hexagram){const item=assignments.get(hexagram.id);if(!item)throw new Error(`无法确定八宫：${hexagram.name}`);return item}
export const PALACE_ASSIGNMENTS=assignments;
