/** TODO: 实现公历/农历、节气、真太阳时等转换，并以权威历法测试用例校验。 */
export interface CalendarAdapter{toSolar(date:string):Promise<string>;getSolarTerm(date:string):Promise<string|null>}
