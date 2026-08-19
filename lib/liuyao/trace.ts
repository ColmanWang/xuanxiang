import type { LiuyaoTraceKind,LiuyaoTraceStep } from "./types";
export const liuyaoStep=(id:string,label:string,description:string,kind:LiuyaoTraceKind,rule:string,input?:Record<string,unknown>,output?:Record<string,unknown>):LiuyaoTraceStep=>({id,label,description,kind,rule,input,output});
