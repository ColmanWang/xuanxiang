import { DeterministicLiuyaoEngine } from "../lib/liuyao/engine";
import { PALACE_POSITION_LABEL, SIX_RELATIVE_LABEL, SIX_SPIRIT_LABEL } from "../lib/liuyao/labels";
import { liuyaoInputSchema } from "../lib/liuyao/schema";
import type { LiuyaoLineValue } from "../lib/liuyao/types";

function value(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseLines(raw: string): LiuyaoLineValue[] {
  return raw.split(",").map((item) => Number(item.trim())) as LiuyaoLineValue[];
}

const rawLines = value("--lines");
const localDateTime = value("--datetime");
const timezone = value("--timezone") ?? "Asia/Shanghai";
const disambiguation = value("--disambiguation")?.toUpperCase();
const trace = process.argv.includes("--trace");

if (!rawLines || !localDateTime) {
  console.error("用法：pnpm liuyao:calculate --lines 7,8,9,7,6,8 --datetime 2026-08-19T14:30 --timezone Asia/Shanghai [--disambiguation earlier|later] [--trace]");
  process.exit(1);
}

try {
  const input = liuyaoInputSchema.parse({
    method: "MANUAL_LINE_VALUES",
    lineOrder: "BOTTOM_TO_TOP",
    lines: parseLines(rawLines),
    divinationTime: {
      localDateTime,
      timezone,
      timeDisambiguation: disambiguation === "EARLIER" || disambiguation === "LATER" ? disambiguation : undefined,
    },
    ruleSetId: "STANDARD_WENWANG_GUA",
  });
  const chart = new DeterministicLiuyaoEngine().calculate(input);
  console.log(`本卦：${chart.primaryHexagram.number} ${chart.primaryHexagram.name}`);
  console.log(`动爻：${chart.movingLines.length ? chart.movingLines.map((line) => line.lineIndex + 1).join("、") : "无"}`);
  console.log(`变卦：${chart.changedHexagram ? `${chart.changedHexagram.number} ${chart.changedHexagram.name}` : "无"}`);
  console.log(`八宫：${chart.palace.trigram.name}宫 · ${PALACE_POSITION_LABEL[chart.palace.position]}`);
  console.log(`世应：世 ${chart.shiYing.shiLine + 1} · 应 ${chart.shiYing.yingLine + 1}`);
  console.log(`日辰 / 月建：${chart.calendarContext.dayGanzhi.display} / ${chart.calendarContext.monthBranch}`);
  for (const line of [...chart.lines].reverse()) {
    console.log(`${line.positionName} ${line.najia.stem}${line.najia.branch} ${SIX_RELATIVE_LABEL[line.relative]} ${SIX_SPIRIT_LABEL[line.spirit]}${line.moving ? " · 动" : ""}`);
  }
  console.log(`引擎：${chart.engineVersion} / 规则：${chart.ruleSet.id} ${chart.ruleSet.version}`);
  console.log(`指纹：${chart.fingerprint}`);
  if (trace) for (const [index, step] of chart.trace.entries()) console.log(`${index + 1}. ${step.label} [${step.kind}]\n   ${step.description}`);
} catch (error) {
  const message = error instanceof Error ? error.message : "输入或计算失败";
  console.error(`六爻推演失败：${message}`);
  process.exitCode = 1;
}
