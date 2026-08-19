import { HeavenlyStem } from "@/lib/calendar/ganzhi";
import type { SixSpirit } from "./types";
const ORDER:SixSpirit[]=["AZURE_DRAGON","VERMILION_BIRD","HOOK_SNAKE","SOARING_SERPENT","WHITE_TIGER","BLACK_TORTOISE"];
const START:Record<HeavenlyStem,number>={甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5};
export function calculateSixSpirits(stem:HeavenlyStem):SixSpirit[]{return Array.from({length:6},(_,index)=>ORDER[(START[stem]+index)%6])}
