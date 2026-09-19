import type { TrigramId, YinYang } from "@/lib/liuyao/types";

export interface NonSymmetricHexagramFixture {
  readonly name: string;
  readonly number: number;
  readonly lower: TrigramId;
  readonly upper: TrigramId;
  readonly lines: readonly [YinYang, YinYang, YinYang, YinYang, YinYang, YinYang];
}

const Y = "YANG" as const;
const N = "YIN" as const;

/**
 * A deliberately static, bottom-first reference suite. It does not import the
 * production hexagram matrix and is intended to catch upper/lower transposition.
 */
export const NON_SYMMETRIC_HEXAGRAM_FIXTURES: readonly NonSymmetricHexagramFixture[] = [
  { name: "履", number: 10, lower: "DUI", upper: "QIAN", lines: [Y, Y, N, Y, Y, Y] },
  { name: "夬", number: 43, lower: "QIAN", upper: "DUI", lines: [Y, Y, Y, Y, Y, N] },
  { name: "同人", number: 13, lower: "LI", upper: "QIAN", lines: [Y, N, Y, Y, Y, Y] },
  { name: "大有", number: 14, lower: "QIAN", upper: "LI", lines: [Y, Y, Y, Y, N, Y] },
  { name: "无妄", number: 25, lower: "ZHEN", upper: "QIAN", lines: [Y, N, N, Y, Y, Y] },
  { name: "大壮", number: 34, lower: "QIAN", upper: "ZHEN", lines: [Y, Y, Y, Y, N, N] },
  { name: "姤", number: 44, lower: "XUN", upper: "QIAN", lines: [N, Y, Y, Y, Y, Y] },
  { name: "小畜", number: 9, lower: "QIAN", upper: "XUN", lines: [Y, Y, Y, N, Y, Y] },
  { name: "讼", number: 6, lower: "KAN", upper: "QIAN", lines: [N, Y, N, Y, Y, Y] },
  { name: "需", number: 5, lower: "QIAN", upper: "KAN", lines: [Y, Y, Y, N, Y, N] },
  { name: "遁", number: 33, lower: "GEN", upper: "QIAN", lines: [N, N, Y, Y, Y, Y] },
  { name: "大畜", number: 26, lower: "QIAN", upper: "GEN", lines: [Y, Y, Y, N, N, Y] },
  { name: "否", number: 12, lower: "KUN", upper: "QIAN", lines: [N, N, N, Y, Y, Y] },
  { name: "泰", number: 11, lower: "QIAN", upper: "KUN", lines: [Y, Y, Y, N, N, N] },
  { name: "革", number: 49, lower: "LI", upper: "DUI", lines: [Y, N, Y, Y, Y, N] },
  { name: "睽", number: 38, lower: "DUI", upper: "LI", lines: [Y, Y, N, Y, N, Y] },
  { name: "随", number: 17, lower: "ZHEN", upper: "DUI", lines: [Y, N, N, Y, Y, N] },
  { name: "归妹", number: 54, lower: "DUI", upper: "ZHEN", lines: [Y, Y, N, Y, N, N] },
  { name: "困", number: 47, lower: "KAN", upper: "DUI", lines: [N, Y, N, Y, Y, N] },
  { name: "节", number: 60, lower: "DUI", upper: "KAN", lines: [Y, Y, N, N, Y, N] },
] as const;
