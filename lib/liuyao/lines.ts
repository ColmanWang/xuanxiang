import type { LiuyaoLineState,LiuyaoLineValue,YinYang } from "./types";
const STATES:Record<LiuyaoLineValue,LiuyaoLineState>={6:"OLD_YIN",7:"YOUNG_YANG",8:"YOUNG_YIN",9:"OLD_YANG"};
export const lineState=(value:LiuyaoLineValue)=>STATES[value];
export const lineYinYang=(value:LiuyaoLineValue):YinYang=>value===7||value===9?"YANG":"YIN";
export const isMovingLine=(value:LiuyaoLineValue)=>value===6||value===9;
export const changedYinYang=(value:LiuyaoLineValue):YinYang=>isMovingLine(value)?(lineYinYang(value)==="YANG"?"YIN":"YANG"):lineYinYang(value);
export const changedState=(value:LiuyaoLineValue):LiuyaoLineState=>value===6?"YOUNG_YANG":value===9?"YOUNG_YIN":lineState(value);
