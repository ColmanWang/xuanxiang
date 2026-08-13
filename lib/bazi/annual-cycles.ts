import { ganzhiAt, type Pillar } from "../calendar/ganzhi";
export function calculateAnnualCycles(startYear:number,count=10):Array<{year:number;pillar:Pillar}>{return Array.from({length:count},(_,i)=>{const year=startYear+i;const g=ganzhiAt(year-1984);return{year,pillar:{...g,display:`${g.stem}${g.branch}`}};});}
