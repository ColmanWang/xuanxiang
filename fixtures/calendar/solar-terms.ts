import type { VerificationLevel } from "@/lib/calendar/types";

export interface SolarTermFixture {
  year: number;
  term: string;
  expectedInstant: string;
  displayedTimezone: "Asia/Shanghai";
  source: { organization: string; title: string; url: string; retrievedAt: string; locator?: string };
  toleranceSeconds: number;
  verificationLevel: VerificationLevel;
}

const rows = `
1901|小寒|1901-01-05T23:53:00Z 1901|立春|1901-02-04T11:40:00Z 1901|惊蛰|1901-03-06T06:11:00Z 1901|清明|1901-04-05T11:44:00Z 1901|夏至|1901-06-22T03:28:00Z 1901|冬至|1901-12-22T12:37:00Z
1920|小寒|1920-01-06T14:41:00Z 1920|立春|1920-02-05T02:26:00Z 1920|惊蛰|1920-03-05T20:51:00Z 1920|清明|1920-04-05T02:15:00Z 1920|夏至|1920-06-21T17:40:00Z 1920|冬至|1920-12-22T03:17:00Z
1950|小寒|1950-01-05T21:39:00Z 1950|立春|1950-02-04T09:21:00Z 1950|惊蛰|1950-03-06T03:35:00Z 1950|清明|1950-04-05T08:44:00Z 1950|夏至|1950-06-21T23:36:00Z 1950|冬至|1950-12-22T10:13:00Z
1980|小寒|1980-01-06T04:29:00Z 1980|立春|1980-02-04T16:09:00Z 1980|惊蛰|1980-03-05T10:16:00Z 1980|清明|1980-04-04T15:15:00Z 1980|夏至|1980-06-21T05:47:00Z 1980|冬至|1980-12-21T16:56:00Z
2000|小寒|2000-01-06T01:01:00Z 2000|立春|2000-02-04T12:40:00Z 2000|惊蛰|2000-03-05T06:43:00Z 2000|清明|2000-04-04T11:32:00Z 2000|夏至|2000-06-21T01:48:00Z 2000|冬至|2000-12-21T13:37:00Z
2024|小寒|2024-01-05T20:49:00Z 2024|立春|2024-02-04T08:27:00Z 2024|惊蛰|2024-03-05T02:23:00Z 2024|清明|2024-04-04T07:02:00Z 2024|夏至|2024-06-20T20:51:00Z 2024|冬至|2024-12-21T09:21:00Z
2026|小寒|2026-01-05T08:23:00Z 2026|立春|2026-02-03T20:02:00Z 2026|惊蛰|2026-03-05T13:59:00Z 2026|清明|2026-04-04T18:40:00Z 2026|夏至|2026-06-21T08:25:00Z 2026|冬至|2026-12-21T20:50:00Z
2050|小寒|2050-01-05T04:08:00Z 2050|立春|2050-02-03T15:44:00Z 2050|惊蛰|2050-03-05T09:33:00Z 2050|清明|2050-04-04T14:03:00Z 2050|夏至|2050-06-21T03:33:00Z 2050|冬至|2050-12-21T16:39:00Z
2083|小寒|2083-01-05T04:26:00Z 2083|立春|2083-02-03T15:59:00Z 2083|惊蛰|2083-03-05T09:36:00Z 2083|清明|2083-04-04T13:50:00Z 2083|夏至|2083-06-21T02:44:00Z 2083|冬至|2083-12-21T16:53:00Z
2100|小寒|2100-01-05T07:29:00Z 2100|立春|2100-02-03T19:00:00Z 2100|惊蛰|2100-03-05T12:35:00Z 2100|清明|2100-04-04T16:44:00Z 2100|夏至|2100-06-21T05:32:00Z 2100|冬至|2100-12-21T19:51:00Z`;

const hkoYears = new Set([2024, 2026]);
export const solarTermFixtures: SolarTermFixture[] = rows.trim().split(/\s+/).map((row) => {
  const [yearText,term,expectedInstant]=row.split("|"); const year=Number(yearText); const hko=hkoYears.has(year);
  return { year,term,expectedInstant,displayedTimezone:"Asia/Shanghai",source:hko?{organization:"香港天文台",title:`${year} 年二十四节气`,url:`https://www.hko.gov.hk/en/gts/astronomy/data/files/24SolarTerms_${year}.xml`,retrievedAt:"2026-08-10",locator:"香港标准时间，公开表精确至分钟"}:{organization:"Y. T. Liu / JPL DE441",title:"Chinese Calendar solar-term computation dataset",url:"https://ytliu0.github.io/ChineseCalendar/computation.html",retrievedAt:"2026-08-10",locator:"DE441 计算公开数据，固定到分钟用于回归"},toleranceSeconds:hko?60:90,verificationLevel:hko?"AUTHORITATIVE_FIXTURE":"CROSS_CHECKED" };
});

export function absoluteTimeDifference(actual: string, expected: string): number {
  return Math.abs(Date.parse(actual)-Date.parse(expected))/1000;
}
