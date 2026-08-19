import { Temporal } from "@js-temporal/polyfill";
import { EARTHLY_BRANCHES,ganzhiAt } from "@/lib/calendar/ganzhi";
import { daysSinceJiaziEpoch } from "@/lib/calendar/julian-day";
import { getSolarTermsAround } from "@/lib/calendar/lunar-adapter";
import { MONTH_BOUNDARY_TERMS } from "@/lib/calendar/solar-terms";
import { getUtcOffset,instantToLocal,localDateTimeToInstant } from "@/lib/calendar/timezone";
import type { LiuyaoCalendarContext,LiuyaoInput,NormalizedLiuyaoInput } from "./types";

export function normalizeLiuyaoInput(input:LiuyaoInput):NormalizedLiuyaoInput{const instant=localDateTimeToInstant(input.divinationTime.localDateTime,input.divinationTime.timezone,input.divinationTime.timeDisambiguation);return{method:input.method,lines:[...input.lines],localDateTime:instantToLocal(instant,input.divinationTime.timezone),timezone:input.divinationTime.timezone,utcInstant:instant.toString(),utcOffset:getUtcOffset(instant,input.divinationTime.timezone),timeDisambiguation:input.divinationTime.timeDisambiguation}}
export function buildLiuyaoCalendarContext(input:NormalizedLiuyaoInput):LiuyaoCalendarContext{const local=Temporal.PlainDateTime.from(input.localDateTime);const day=ganzhiAt(daysSinceJiaziEpoch(local.toPlainDate().toString()));const terms=getSolarTermsAround(local.year,input.timezone).filter(term=>MONTH_BOUNDARY_TERMS.includes(term.name as typeof MONTH_BOUNDARY_TERMS[number])&&Temporal.Instant.compare(term.utcInstant,input.utcInstant)<=0);const boundary=terms.at(-1);if(!boundary)throw new Error("无法确定月建边界");const monthIndex=MONTH_BOUNDARY_TERMS.indexOf(boundary.name as typeof MONTH_BOUNDARY_TERMS[number]);return{localDateTime:input.localDateTime,timezone:input.timezone,dayGanzhi:{...day,display:`${day.stem}${day.branch}`},dayStem:day.stem,dayBranch:day.branch,monthBranch:EARTHLY_BRANCHES[(2+monthIndex)%12],monthBoundaryTerm:boundary.name,monthBoundaryTime:boundary.localDateTime}}
