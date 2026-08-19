import type { Trigram,TrigramId,YinYang } from "./types";
const Y:YinYang="YANG",N:YinYang="YIN";
export const TRIGRAMS:Record<TrigramId,Trigram>={QIAN:{id:"QIAN",name:"乾",bits:[Y,Y,Y],element:"METAL"},DUI:{id:"DUI",name:"兑",bits:[Y,Y,N],element:"METAL"},LI:{id:"LI",name:"离",bits:[Y,N,Y],element:"FIRE"},ZHEN:{id:"ZHEN",name:"震",bits:[Y,N,N],element:"WOOD"},XUN:{id:"XUN",name:"巽",bits:[N,Y,Y],element:"WOOD"},KAN:{id:"KAN",name:"坎",bits:[N,Y,N],element:"WATER"},GEN:{id:"GEN",name:"艮",bits:[N,N,Y],element:"EARTH"},KUN:{id:"KUN",name:"坤",bits:[N,N,N],element:"EARTH"}};
export const TRIGRAM_LIST=Object.values(TRIGRAMS);
export function trigramFromLines(lines:readonly YinYang[]):Trigram{const item=TRIGRAM_LIST.find(t=>t.bits.every((bit,i)=>bit===lines[i]));if(!item)throw new Error("无效三爻结构");return item}
