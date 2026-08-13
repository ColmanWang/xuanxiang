const STEMS=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
function julianDayNumber(year:number,month:number,day:number):number{const a=Math.floor((14-month)/12);const y=year+4800-a;const m=month+12*a-3;return day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;}
/** Test-only implementation from the published JD_noon formula; shares no production epoch/helper. */
export function referenceDayPillar(date:string):string{const [year,month,day]=date.split("-").map(Number);const index=((julianDayNumber(year,month,day)-11)%60+60)%60;return `${STEMS[index%10]}${BRANCHES[index%12]}`;}
