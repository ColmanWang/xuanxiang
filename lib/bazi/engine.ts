import type { BaziChart,BaziEngine,BirthInput } from "./types";
/** TODO: 实现并测试确定性历法与四柱计算。禁止调用 LLM 计算四柱。 */
export class DeterministicBaziEngine implements BaziEngine{async calculate(input:BirthInput):Promise<BaziChart>{void input;throw new Error("Bazi engine is not implemented yet.")}}
