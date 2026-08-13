import type { CalendarDateInput } from "@/lib/calendar/types";
export interface LunarConversionFixture{lunar:CalendarDateInput;gregorian:CalendarDateInput;note:string}
function fixture(lunar:[number,number,number,boolean?],gregorian:[number,number,number]):LunarConversionFixture{return{lunar:{year:lunar[0],month:lunar[1],day:lunar[2],isLeapMonth:Boolean(lunar[3])},gregorian:{year:gregorian[0],month:gregorian[1],day:gregorian[2]},note:"与香港天文台公历与农历日期对照表抽样核对；2033 闰月案例另列为争议年回归。"};}
export const lunarConversionFixtures:LunarConversionFixture[]=[
 fixture([1901,1,1],[1901,2,19]),fixture([1950,1,1],[1950,2,17]),fixture([2000,1,1],[2000,2,5]),fixture([2024,1,1],[2024,2,10]),fixture([2025,1,1],[2025,1,29]),fixture([2033,1,1],[2033,1,31]),fixture([2025,6,1,true],[2025,7,25]),fixture([2023,2,1,true],[2023,3,22]),fixture([2012,4,1,true],[2012,5,21]),fixture([2024,12,29],[2025,1,28]),fixture([2033,11,1,true],[2033,12,22]),fixture([2024,1,15],[2024,2,24]),
];
