export type Gender="male"|"female"; export type CalendarType="solar"|"lunar";
export interface BirthInput{date:string;time:string;location:string;gender:Gender;calendar:CalendarType}
export interface BaziPillar{label:"年柱"|"月柱"|"日柱"|"时柱";stem:string;branch:string;tenGod:string;hiddenStems:string[];nayin:string;element:string;growthStage:string}
export interface BaziChart{pillars:BaziPillar[];luckCycles:string[];annualCycles:string[]}
export interface BaziEngine{calculate(input:BirthInput):Promise<BaziChart>}
