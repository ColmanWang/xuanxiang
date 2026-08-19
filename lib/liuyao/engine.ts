import { BRANCH_ELEMENT } from "./five-elements";
import { hexagramFromLines } from "./hexagrams";
import { PALACE_POSITION_LABEL } from "./labels";
import { changedState,changedYinYang,isMovingLine,lineState,lineYinYang } from "./lines";
import { assignNajia } from "./najia";
import { palaceFor } from "./palaces";
import { LIUYAO_CALENDAR_PROVIDERS, liuyaoFingerprint } from "./fingerprint";
import { liuyaoRuleSetRegistry } from "./rule-registry";
import { calculateShiYing } from "./shi-ying";
import { calculateSixRelative } from "./six-relatives";
import { calculateSixSpirits } from "./six-spirits";
import { buildLiuyaoCalendarContext,normalizeLiuyaoInput } from "./calendar-context";
import { liuyaoStep } from "./trace";
import { LiuyaoCalculationError } from "./errors";
import { calculateVoidBranches } from "./void-branches";
import type { Hexagram,LiuyaoChart,LiuyaoInput,LiuyaoLineValue } from "./types";

export const LIUYAO_ENGINE_VERSION="1.0.0";
const POSITION_NAMES=["初爻","二爻","三爻","四爻","五爻","上爻"];
export class DeterministicLiuyaoEngine{
 calculate(input:LiuyaoInput):LiuyaoChart{
  if(input.lineOrder && input.lineOrder!=="BOTTOM_TO_TOP")throw new LiuyaoCalculationError("INVALID_LINE_ORDER","六爻输入必须按初爻到上爻提交。","lineOrder");
  if(input.lines.length!==6)throw new LiuyaoCalculationError("INVALID_LINE_COUNT","需要正好六个爻值。","lines");
  if(input.lines.some(value=>![6,7,8,9].includes(value)))throw new LiuyaoCalculationError("INVALID_LINE_VALUE","爻值只能是 6、7、8、9。","lines");
  const rules=liuyaoRuleSetRegistry.get(input.ruleSetId??"STANDARD_WENWANG_GUA");
  const normalized=normalizeLiuyaoInput(input);
  const yinYang=input.lines.map(lineYinYang) as unknown as Hexagram["lines"];
  const primary=hexagramFromLines(yinYang);
  const movingLines=input.lines.flatMap((value,index)=>isMovingLine(value)?[{lineIndex:index,originalState:lineState(value),changedState:changedState(value)}]:[]);
  const changed= movingLines.length?hexagramFromLines(input.lines.map(changedYinYang) as unknown as Hexagram["lines"]):null;
  const palace=palaceFor(primary),shiYing=calculateShiYing(palace.position),calendar=buildLiuyaoCalendarContext(normalized),najia=assignNajia(primary.lowerTrigram.id,primary.upperTrigram.id),spirits=calculateSixSpirits(calendar.dayStem),voidBranches=calculateVoidBranches(calendar.dayGanzhi);
  const lines=input.lines.map((value,index)=>{const assignment=najia[index],element=BRANCH_ELEMENT[assignment.branch];return{index,positionName:POSITION_NAMES[index],originalValue:value as LiuyaoLineValue,state:lineState(value),yinYang:lineYinYang(value),moving:isMovingLine(value),changedYinYang:changedYinYang(value),najia:assignment,element,relative:calculateSixRelative(palace.trigram.element,element),spirit:spirits[index],isShi:index===shiYing.shiLine,isYing:index===shiYing.yingLine,hiddenSpirit:null}});
  const trace=[liuyaoStep("input-lines","标准化六爻输入","六个爻值按初爻至上爻读取。","INPUT_FACT",rules.policies.construction.id,{lines:[...input.lines]},{order:"BOTTOM_TO_TOP"}),liuyaoStep("primary","生成本卦",`由六爻阴阳结构确定为第 ${primary.number} 卦 ${primary.name}。`,"DERIVED_CALCULATION",rules.policies.construction.id,undefined,{hexagram:primary.name}),liuyaoStep("moving","识别动爻",movingLines.length?`动爻位于 ${movingLines.map(item=>POSITION_NAMES[item.lineIndex]).join("、")}。`:"本卦无动爻。","DERIVED_CALCULATION",rules.policies.construction.id,undefined,{indices:movingLines.map(item=>item.lineIndex)}),liuyaoStep("changed","生成变卦",changed?`老阴老阳翻转后为第 ${changed.number} 卦 ${changed.name}。`:"无动爻，不生成变卦。","DERIVED_CALCULATION",rules.policies.construction.id),liuyaoStep("palace","确定八宫",`${primary.name} 属${palace.trigram.name}宫，宫位为 ${PALACE_POSITION_LABEL[palace.position]}。`,"TRADITIONAL_RULE",rules.policies.palace.id),liuyaoStep("shi-ying","确定世应",`世在${POSITION_NAMES[shiYing.shiLine]}，应在${POSITION_NAMES[shiYing.yingLine]}。`,"TRADITIONAL_RULE",rules.policies.shiYing.id),liuyaoStep("najia","装纳甲",`下卦${primary.lowerTrigram.name}装内卦，上卦${primary.upperTrigram.name}装外卦；均按初爻至上爻排列。`,"TRADITIONAL_RULE",rules.policies.najia.id,undefined,{lines:najia.map(item=>`${item.stem}${item.branch}`)}),liuyaoStep("relatives","确定六亲","以卦宫五行为基准，比较各爻纳甲地支五行。","TRADITIONAL_RULE",rules.policies.sixRelative.id),liuyaoStep("calendar","计算月建与日辰",`${calendar.monthBoundaryTerm}后为${calendar.monthBranch}月建；当地民用日为${calendar.dayGanzhi.display}日。`,"CALENDAR_FACT",rules.policies.calendarContext.id),liuyaoStep("spirits","确定六神",`按日干${calendar.dayStem}起六神，并从初爻向上顺排。`,"TRADITIONAL_RULE",rules.policies.sixSpirit.id),liuyaoStep("void-branches","计算旬空",`${calendar.dayGanzhi.display}日所在旬从${voidBranches.xunStartBranch}起，空亡为${voidBranches.branches.join("、")}。`,"DERIVED_CALCULATION",rules.policies.calendarContext.id)];
  return{input:normalized,ruleSet:{id:rules.id,version:rules.version,displayName:rules.displayName,status:rules.status},providers:LIUYAO_CALENDAR_PROVIDERS,calendarContext:calendar,primaryHexagram:primary,changedHexagram:changed,movingLines,palace,shiYing,lines,voidBranches,trace,fingerprint:liuyaoFingerprint(LIUYAO_ENGINE_VERSION,rules),engineVersion:LIUYAO_ENGINE_VERSION,hiddenSpiritsStatus:"NOT_IMPLEMENTED"};
 }
}
