import { describe,expect,it } from "vitest";
import { EARTHLY_BRANCHES,ganzhiAt,HEAVENLY_STEMS,nextGanzhi } from "./ganzhi";
import { getSolarTerms } from "./lunar-adapter";
import { localDateTimeToInstant } from "./timezone";
describe("Calendar Core",()=>{
 it("六十甲子循环保持不变量",()=>{for(let i=-120;i<180;i++)expect(ganzhiAt(i).index).toBeGreaterThanOrEqual(0);let current=ganzhiAt(0);for(let i=0;i<60;i++)current=nextGanzhi(current);expect(current).toEqual(ganzhiAt(0));expect(HEAVENLY_STEMS).toHaveLength(10);expect(EARTHLY_BRANCHES).toHaveLength(12);});
 it("一年节气顺序稳定",()=>{const terms=getSolarTerms(2026,"Asia/Shanghai");expect(terms).toHaveLength(24);for(let i=1;i<terms.length;i++)expect(Date.parse(terms[i].utcInstant)).toBeGreaterThan(Date.parse(terms[i-1].utcInstant));});
 it("拒绝 DST 不存在和重复的本地时间",()=>{expect(()=>localDateTimeToInstant("2024-03-10T02:30:00","America/New_York")).toThrow(/夏令时/);expect(()=>localDateTimeToInstant("2024-11-03T01:30:00","America/New_York")).toThrow(/夏令时/);});
});
