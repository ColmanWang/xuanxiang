import type { PalacePosition } from "./types";
const SHI:Record<PalacePosition,number>={PURE:5,FIRST:0,SECOND:1,THIRD:2,FOURTH:3,FIFTH:4,WANDERING_SOUL:3,RETURNING_SOUL:2};
export function calculateShiYing(position:PalacePosition){const shiLine=SHI[position];return{shiLine,yingLine:(shiLine+3)%6}}
