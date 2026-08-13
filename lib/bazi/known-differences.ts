export type KnownDifferenceClassification="PROVIDER_ROUNDING"|"POLICY_DIFFERENCE"|"ENGINE_BUG"|"UNRESOLVED";

export interface KnownCalculationDifference {
  fixtureId:string;
  xuanxiang:string;
  provider:string;
  classification:KnownDifferenceClassification;
  explanation:string;
  resolved:boolean;
}

export const KNOWN_LUCK_DIFFERENCES:readonly KnownCalculationDifference[]=[
  {fixtureId:"luck-02",xuanxiang:"1年9月15日（余23小时）",provider:"1年9月16日",classification:"PROVIDER_ROUNDING",explanation:"两者使用同一目标节与三日折一年；玄象保留连续时长后逐级截断，Provider 将不足一日余数并入日字段。顺逆、目标节与大运序列无差异。",resolved:true},
  {fixtureId:"luck-05",xuanxiang:"0年2月14日（余23小时）",provider:"0年2月15日",classification:"PROVIDER_ROUNDING",explanation:"差异同样发生在余小时转换为日的表示层，而非节气选择或大运序列。现有资料不足以把 Provider 取整方式提升为传统 Policy。",resolved:true},
] as const;

export function validateKnownDifferences(items:readonly KnownCalculationDifference[]=KNOWN_LUCK_DIFFERENCES){
  const unresolved=items.filter((item)=>!item.resolved||item.classification==="UNRESOLVED");
  return {valid:unresolved.length===0,unresolved};
}
