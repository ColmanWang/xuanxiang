import type { DayBoundaryPolicy,GrowthPhasePolicy,HourPolicy,LuckDirectionPolicy,LuckStartPolicy,MonthBoundaryPolicy,SolarTimeRulePolicy,TimezoneRulePolicy,YearBoundaryPolicy } from "./types";

export const YEAR_LI_CHUN:YearBoundaryPolicy={id:"YEAR_LI_CHUN_V1",version:"1.0.0",displayName:"立春换年",description:"以立春时刻作为四柱年柱边界。",verificationLevel:"CROSS_CHECKED"};
export const MONTH_JIE:MonthBoundaryPolicy={id:"MONTH_JIE_V1",version:"1.0.0",displayName:"十二节换月",description:"以立春、惊蛰等十二节作为月柱边界。",verificationLevel:"CROSS_CHECKED"};
export const DAY_LOCAL_MIDNIGHT:DayBoundaryPolicy={id:"DAY_LOCAL_MIDNIGHT_V1",version:"1.0.0",displayName:"当地午夜换日",description:"采用 IANA 当地民用时 00:00 换日。",verificationLevel:"CROSS_CHECKED",boundary:"LOCAL_MIDNIGHT"};
export const DAY_ZI_START_TEST:DayBoundaryPolicy={id:"DAY_ZI_START_TEST_V1",version:"test-1",displayName:"子初换日（架构测试）",description:"仅验证规则差分，不代表正式收录流派。",verificationLevel:"INTERNAL",boundary:"ZI_HOUR_START"};
export const HOUR_DOUBLE_HOURS:HourPolicy={id:"HOUR_DOUBLE_HOURS_V1",version:"1.0.0",displayName:"十二时辰",description:"23:00—00:59 同属子时。",verificationLevel:"CROSS_CHECKED"};
export const TIMEZONE_IANA:TimezoneRulePolicy={id:"TIMEZONE_IANA_CIVIL_V1",version:"1.0.0",displayName:"IANA 民用时",description:"使用出生地对应的 IANA 历史民用时区。",verificationLevel:"CROSS_CHECKED"};
export const SOLAR_TIME_DISABLED:SolarTimeRulePolicy={id:"SOLAR_TIME_DISABLED_V1",version:"1.0.0",displayName:"不启用真太阳时",description:"未经验证前拒绝真太阳时校正。",verificationLevel:"INTERNAL"};
export const GROWTH_STANDARD:GrowthPhasePolicy={id:"GROWTH_YANG_FORWARD_YIN_REVERSE_V1",version:"1.0.0",displayName:"阳顺阴逆十二长生",description:"作为派生约定单独标识。",verificationLevel:"INTERNAL"};
export const LUCK_DIRECTION_STANDARD:LuckDirectionPolicy={id:"LUCK_DIRECTION_YEAR_STEM_SEX_V1",version:"1.0.0",displayName:"年干阴阳与男女顺逆",description:"阳年男、阴年女顺行；阴年男、阳年女逆行。",verificationLevel:"CROSS_CHECKED"};
export const LUCK_DIRECTION_REVERSED_TEST:LuckDirectionPolicy={id:"LUCK_DIRECTION_REVERSED_TEST_V1",version:"test-1",displayName:"反向顺逆（测试）",description:"仅用于验证规则差分传播。",verificationLevel:"INTERNAL"};
export const LUCK_START_THREE_DAYS:LuckStartPolicy={id:"LUCK_START_JIE_3DAYS_V1",version:"1.0.0",displayName:"按节三日折一年",description:"顺行取下一节、逆行取上一节，三日折一年。属于传统近似换算。",verificationLevel:"CROSS_CHECKED",minutesPerYear:4320,boundaryType:"JIE"};
export const LUCK_START_ONE_DAY_TEST:LuckStartPolicy={id:"LUCK_START_JIE_1DAY_TEST_V1",version:"test-1",displayName:"一日折一年（测试）",description:"仅用于验证起运规则差分，不用于生产结果。",verificationLevel:"INTERNAL",minutesPerYear:1440,boundaryType:"JIE"};
