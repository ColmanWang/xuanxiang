import type { CalendarDateInput, NormalizedBirthTime, TimeDisambiguation, TimePrecision, VerificationLevel } from "../calendar/types";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "../calendar/ganzhi";

export type Sex = "MALE" | "FEMALE" | "UNSPECIFIED";
export interface BirthInput {
  calendarType: "GREGORIAN" | "LUNAR";
  date: CalendarDateInput;
  time?: { hour: number; minute: number; second?: number };
  timezone: string;
  location?: { name?: string; latitude?: number; longitude?: number };
  sex?: Sex;
  timePrecision: TimePrecision;
  trueSolarTime?: boolean;
  ruleSetId?: string;
  timeDisambiguation?: TimeDisambiguation;
  includeLuckCycles?: boolean;
  ruleOverrides?: BaziRuleOverrides;
}
export type YearBoundary = "LI_CHUN";
export type MonthBoundary = "JIE";
export type DayBoundary = "LOCAL_MIDNIGHT" | "ZI_HOUR_START";
export type TimezonePolicy = "IANA_STANDARD_TIME";
export type TrueSolarTimePolicy = "DISABLED" | "OPTIONAL_EXPERIMENTAL";
export type RuleSetStatus = "STABLE"|"EXPERIMENTAL"|"RESEARCH_ONLY"|"TEST_ONLY";
export type CalculationPrecision = "EXACT_INSTANT"|"DAY"|"MONTH"|"TRADITIONAL_APPROXIMATION";
export type LuckDirection = "FORWARD"|"BACKWARD";
export interface PolicyDescriptor<T extends string=string>{id:T;version:string;displayName:string;description:string;verificationLevel:VerificationLevel}
export type YearBoundaryPolicy=PolicyDescriptor<"YEAR_LI_CHUN_V1">;
export type MonthBoundaryPolicy=PolicyDescriptor<"MONTH_JIE_V1">;
export type DayBoundaryPolicy=PolicyDescriptor<"DAY_LOCAL_MIDNIGHT_V1"|"DAY_ZI_START_TEST_V1"> & {boundary:DayBoundary};
export type HourPolicy=PolicyDescriptor<"HOUR_DOUBLE_HOURS_V1">;
export type TimezoneRulePolicy=PolicyDescriptor<"TIMEZONE_IANA_CIVIL_V1">;
export type SolarTimeRulePolicy=PolicyDescriptor<"SOLAR_TIME_DISABLED_V1">;
export type GrowthPhasePolicy=PolicyDescriptor<"GROWTH_YANG_FORWARD_YIN_REVERSE_V1">;
export type LuckDirectionPolicy=PolicyDescriptor<"LUCK_DIRECTION_YEAR_STEM_SEX_V1"|"LUCK_DIRECTION_REVERSED_TEST_V1">;
export type LuckStartPolicy=PolicyDescriptor<"LUCK_START_JIE_3DAYS_V1"|"LUCK_START_JIE_1DAY_TEST_V1"> & {minutesPerYear:number;boundaryType:"JIE"};
export interface RulePolicies{yearBoundary:YearBoundaryPolicy;monthBoundary:MonthBoundaryPolicy;dayBoundary:DayBoundaryPolicy;hour:HourPolicy;timezone:TimezoneRulePolicy;solarTime:SolarTimeRulePolicy;growthPhase:GrowthPhasePolicy;luckDirection:LuckDirectionPolicy;luckStart:LuckStartPolicy}
export type RuleReferenceRole="DIRECT_RULE"|"HISTORICAL_PRECEDENT"|"LATER_FORMULATION"|"COMMENTARY"|"EDITORIAL_CONTEXT";
export interface RuleReference{policyId:string;citationIds:string[];note?:string;evidenceStatus:"DOCUMENTED"|"TRADITIONAL"|"INFERRED"|"CONTESTED";referenceRole:RuleReferenceRole;traditionalDescription:string;formalization:string;scopeNote?:string;knownVariants?:string[]}
export interface BaziRuleOverrides{dayBoundaryPolicyId?:DayBoundaryPolicy["id"];luckDirectionPolicyId?:LuckDirectionPolicy["id"];luckStartPolicyId?:LuckStartPolicy["id"]}
export interface BaziRuleSet {
  id: string; name: string; displayName:string; description: string; version: string;status:RuleSetStatus;
  policies:RulePolicies;references:RuleReference[];verificationLevel:VerificationLevel;
  yearBoundary: YearBoundary; monthBoundary: MonthBoundary; dayBoundary: DayBoundary;
  timezonePolicy: TimezonePolicy; trueSolarTimePolicy: TrueSolarTimePolicy;
  luckCyclePolicy: { enabled: boolean; method: string;maxCycles:number };
}
export type CalculationStepKind = "ASTRONOMICAL_FACT" | "CALENDAR_CONVERSION" | "BAZI_CONVENTION" | "RULESET_CHOICE" | "DERIVED_CALCULATION";
export interface CalculationStep { id: string; label: string; description: string; stepKind: CalculationStepKind; input?: Record<string,string|number|boolean|null>; output?: Record<string,string|number|boolean|null>; rule: string; source?: string }
export interface CalculationResult<T> { value: T; trace: CalculationStep[] }
export interface FourPillars { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null }
export type TenGod = "比肩"|"劫财"|"食神"|"伤官"|"偏财"|"正财"|"七杀"|"正官"|"偏印"|"正印"|"日主";
export type HiddenStemRole = "主气"|"中气"|"余气";
export interface HiddenStem { stem: HeavenlyStem; role: HiddenStemRole; tenGod: TenGod }
export type FiveElement = "木"|"火"|"土"|"金"|"水";
export type GrowthPhase = "长生"|"沐浴"|"冠带"|"临官"|"帝旺"|"衰"|"病"|"死"|"墓"|"绝"|"胎"|"养";
export interface PillarDerived { tenGod: TenGod; hiddenStems: HiddenStem[]; nayin: string; growthPhase: GrowthPhase; elements: { stem: FiveElement; branch: FiveElement } }
export interface AgeDuration{years:number;months:number;days:number;hours?:number;decimalYears:number}
export interface LuckStartResult{startAge:AgeDuration;sourceBoundary:{term:string;instant:string;localDateTime:string};durationToBoundary:{seconds:number};conversionRule:string;precision:CalculationPrecision;policyId:string}
export interface LuckCycle{index:number;pillar:Pillar;startAge:AgeDuration;endAge:AgeDuration;startYear?:number;endYear?:number;startInstant?:string;endInstant?:string}
export interface LuckResult{direction:LuckDirection;directionPolicyId:string;start:LuckStartResult;cycles:LuckCycle[];precision:CalculationPrecision;temporalConfidence:NormalizedBirthTime["temporalConfidence"]}
export interface BaziChart {
  input: NormalizedBirthTime;
  ruleset: Pick<BaziRuleSet,"id"|"name"|"displayName"|"version"|"status"|"verificationLevel"|"policies"|"references"|"yearBoundary"|"monthBoundary"|"dayBoundary"|"timezonePolicy"|"trueSolarTimePolicy"|"luckCyclePolicy">;
  pillars: FourPillars;
  derived: { pillars: Record<"year"|"month"|"day"|"hour",PillarDerived|null>; fiveElements: Record<FiveElement,number> };
  luck:LuckResult|null;
  luckUnavailableReason?:string;
  annualCycles: Array<{ year:number; pillar:Pillar;luckCycleIndex?:number;luckPillar?:Pillar }>;
  trace: CalculationStep[];
  engineVersion: string;
  ruleSetVersion: string;
  calculationFingerprint: string;
  providers: Record<"timezone"|"solarTerms"|"lunarCalendar", { provider: string; version: string; verificationLevel: VerificationLevel }>;
  nearestBoundary: { term: string; instant: string; localDateTime: string; deltaSeconds: number; affectedPillars: Array<"year"|"month"> };
  derivedConventions: Array<{ ruleId: string; label: string; verificationLevel: VerificationLevel }>;
}
export interface BaziEngine { calculate(input: BirthInput, ruleset?: BaziRuleSet): BaziChart }
export interface BranchStemDefinition { branch: EarthlyBranch; stems: Array<{ stem: HeavenlyStem; role: HiddenStemRole }> }
