import type { CalculationStep, CalculationStepKind } from "./types";
export function step(id:string,label:string,description:string,rule:string,input?:CalculationStep["input"],output?:CalculationStep["output"],source?:string,stepKind:CalculationStepKind="DERIVED_CALCULATION"):CalculationStep{return{id,label,description,rule,input,output,source,stepKind};}
