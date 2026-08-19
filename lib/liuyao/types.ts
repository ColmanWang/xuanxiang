import type { EarthlyBranch, HeavenlyStem, Pillar } from "@/lib/calendar/ganzhi";
import type { TimeDisambiguation, VerificationLevel } from "@/lib/calendar/types";

export type YinYang="YIN"|"YANG";
export type LiuyaoLineValue=6|7|8|9;
export type LiuyaoLineState="OLD_YIN"|"YOUNG_YANG"|"YOUNG_YIN"|"OLD_YANG";
export type FiveElement="WOOD"|"FIRE"|"EARTH"|"METAL"|"WATER";
export type TrigramId="QIAN"|"DUI"|"LI"|"ZHEN"|"XUN"|"KAN"|"GEN"|"KUN";
export type PalacePosition="PURE"|"FIRST"|"SECOND"|"THIRD"|"FOURTH"|"FIFTH"|"WANDERING_SOUL"|"RETURNING_SOUL";
export type SixRelative="SIBLING"|"PARENT"|"OFFSPRING"|"WEALTH"|"OFFICIAL_GHOST";
export type SixSpirit="AZURE_DRAGON"|"VERMILION_BIRD"|"HOOK_SNAKE"|"SOARING_SERPENT"|"WHITE_TIGER"|"BLACK_TORTOISE";
export type LiuyaoRuleSetStatus="EXPERIMENTAL"|"STABLE"|"RESEARCH_ONLY"|"TEST_ONLY";
export type LiuyaoTraceKind="INPUT_FACT"|"CALENDAR_FACT"|"TRADITIONAL_RULE"|"RULESET_CHOICE"|"DERIVED_CALCULATION";

export interface LiuyaoInput {method:"MANUAL_LINE_VALUES"|"THREE_COINS";lineOrder?:"BOTTOM_TO_TOP";lines:readonly LiuyaoLineValue[];divinationTime:{localDateTime:string;timezone:string;timeDisambiguation?:TimeDisambiguation};question?:string;ruleSetId?:string}
export interface NormalizedLiuyaoInput {method:LiuyaoInput["method"];lines:readonly LiuyaoLineValue[];localDateTime:string;timezone:string;utcInstant:string;utcOffset:string;timeDisambiguation?:TimeDisambiguation}
export interface Trigram {id:TrigramId;name:string;bits:readonly [YinYang,YinYang,YinYang];element:FiveElement}
export interface Hexagram {id:string;number:number;name:string;lowerTrigram:Trigram;upperTrigram:Trigram;lines:readonly [YinYang,YinYang,YinYang,YinYang,YinYang,YinYang]}
export interface MovingLine {lineIndex:number;originalState:LiuyaoLineState;changedState:LiuyaoLineState}
export interface Najia {stem:HeavenlyStem;branch:EarthlyBranch}
export interface LiuyaoLine {index:number;positionName:string;originalValue:LiuyaoLineValue;state:LiuyaoLineState;yinYang:YinYang;moving:boolean;changedYinYang:YinYang;najia:Najia;element:FiveElement;relative:SixRelative;spirit:SixSpirit;isShi:boolean;isYing:boolean;hiddenSpirit:null}
export interface LiuyaoCalendarContext {localDateTime:string;timezone:string;dayGanzhi:Pillar;dayStem:HeavenlyStem;dayBranch:EarthlyBranch;monthBranch:EarthlyBranch;monthBoundaryTerm:string;monthBoundaryTime:string}
export interface LiuyaoPolicy {id:string;version:string;displayName:string;description:string;verificationLevel:VerificationLevel}
export interface LiuyaoRuleSet {id:string;version:string;displayName:string;description:string;status:LiuyaoRuleSetStatus;verificationLevel:VerificationLevel;policies:{construction:LiuyaoPolicy;najia:LiuyaoPolicy;palace:LiuyaoPolicy;shiYing:LiuyaoPolicy;sixRelative:LiuyaoPolicy;sixSpirit:LiuyaoPolicy;hiddenSpirit:LiuyaoPolicy;calendarContext:LiuyaoPolicy}}
export interface LiuyaoTraceStep {id:string;label:string;description:string;kind:LiuyaoTraceKind;rule:string;input?:Record<string,unknown>;output?:Record<string,unknown>}
export interface LiuyaoProviderMetadata {timezone:{provider:string;version:string};solarTerms:{provider:string;version:string};dayGanzhi:{provider:string;version:string}}
export interface LiuyaoChart {input:NormalizedLiuyaoInput;ruleSet:{id:string;version:string;displayName:string;status:LiuyaoRuleSetStatus};providers:LiuyaoProviderMetadata;calendarContext:LiuyaoCalendarContext;primaryHexagram:Hexagram;changedHexagram:Hexagram|null;movingLines:MovingLine[];palace:{trigram:Trigram;position:PalacePosition};shiYing:{shiLine:number;yingLine:number};lines:LiuyaoLine[];voidBranches:{xunStartBranch:EarthlyBranch;branches:readonly [EarthlyBranch,EarthlyBranch]};trace:LiuyaoTraceStep[];fingerprint:string;engineVersion:string;hiddenSpiritsStatus:"NOT_IMPLEMENTED"}
