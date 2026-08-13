import { describe,expect,it } from "vitest";
import { POST } from "./route";

const valid={calendarType:"GREGORIAN",date:{year:2024,month:2,day:10},time:{hour:8,minute:30},timezone:"Asia/Shanghai",timePrecision:"MINUTE",ruleSetId:"STANDARD_ZIPING"};
async function call(body:unknown){const response=await POST(new Request("http://localhost/api/tools/bazi/calculate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}));return{status:response.status,body:await response.json() as {chart?:{pillars:{hour:unknown};nearestBoundary:{term:string};calculationFingerprint:string};error?:{code:string}}};}

describe("POST /api/tools/bazi/calculate contract",()=>{
  it("returns deterministic chart",async()=>{const result=await call(valid);expect(result.status).toBe(200);expect(result.body.chart?.calculationFingerprint).toMatch(/^xx-bazi-/);});
  it("supports unknown time without hour pillar",async()=>{const result=await call({...valid,time:undefined,timePrecision:"UNKNOWN"});expect(result.status).toBe(200);expect(result.body.chart?.pillars.hour).toBeNull();});
  it("requires direction input when luck is explicitly requested",async()=>{const result=await call({...valid,includeLuckCycles:true});expect(result.status).toBe(422);expect(result.body.error?.code).toBe("MISSING_RULE_INPUT");});
  it("requires a precise time for the current luck-start policy",async()=>{const result=await call({...valid,time:undefined,timePrecision:"UNKNOWN",sex:"MALE",includeLuckCycles:true});expect(result.status).toBe(422);expect(result.body.error?.code).toBe("MISSING_RULE_INPUT");});
  it("rejects test-only policy overrides at the server boundary",async()=>{const result=await call({...valid,sex:"MALE",ruleOverrides:{luckDirectionPolicyId:"LUCK_DIRECTION_REVERSED_TEST_V1"}});expect(result.status).toBe(422);expect(result.body.error?.code).toBe("POLICY_NOT_AVAILABLE");});
  it("rejects unknown rule IDs",async()=>{const result=await call({...valid,ruleSetId:"UNKNOWN"});expect(result.status).toBe(422);expect(result.body.error?.code).toBe("UNSUPPORTED_POLICY");});
  it.each([
    [{...valid,date:{year:2024,month:2,day:30}},"INVALID_DATE"],
    [{...valid,timezone:"Mars/Olympus"},"INVALID_TIMEZONE"],
    [{...valid,date:{year:2024,month:3,day:10},time:{hour:2,minute:30},timezone:"America/New_York"},"NONEXISTENT_LOCAL_TIME"],
    [{...valid,date:{year:2024,month:11,day:3},time:{hour:1,minute:30},timezone:"America/New_York"},"AMBIGUOUS_LOCAL_TIME"],
    [{...valid,calendarType:"LUNAR",date:{year:2024,month:3,day:30,isLeapMonth:true}},"INVALID_LUNAR_DATE"],
  ])("returns stable error code",async(input,code)=>{const result=await call(input);expect(result.status).toBeGreaterThanOrEqual(400);expect(result.body.error?.code).toBe(code);});
  it("accepts explicit DST disambiguation",async()=>{const result=await call({...valid,date:{year:2024,month:11,day:3},time:{hour:1,minute:30},timezone:"America/New_York",timeDisambiguation:"LATER"});expect(result.status).toBe(200);});
  it("calculates at a second-resolved solar boundary",async()=>{const result=await call({...valid,date:{year:2024,month:2,day:4},time:{hour:16,minute:27,second:7}});expect(result.status).toBe(200);expect(result.body.chart?.nearestBoundary.term).toBe("立春");});
});
