import { DeterministicBaziEngine } from "../lib/bazi/engine";
import { compareBaziRules } from "../lib/bazi/rule-diff";
import { ruleSetRegistry } from "../lib/bazi/rule-registry";
import type { Sex } from "../lib/bazi/types";

function value(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
const date = value("--date");
const time = value("--time");
const timezone = value("--timezone") ?? "Asia/Shanghai";
const sexValue = value("--sex")?.toUpperCase();
const sex: Sex = sexValue === "MALE" || sexValue === "FEMALE" ? sexValue : "UNSPECIFIED";
const trace = process.argv.includes("--trace");
const unknown = process.argv.includes("--unknown-time");
const luck = process.argv.includes("--luck");
const compareRule = value("--compare-rule");

if (process.argv.includes("--rules")) {
  for (const rule of ruleSetRegistry.list({ includeNonProduction: true })) console.log(`${rule.id} ${rule.version} · ${rule.status} · ${rule.displayName}`);
  process.exit(0);
}
if (!date || (!time && !unknown)) {
  console.error("用法：pnpm bazi:calculate --date 1990-02-04 --time 11:32 --timezone Asia/Shanghai [--sex male] [--luck] [--trace]");
  process.exit(1);
}
const [year, month, day] = date.split("-").map(Number);
const [hour, minute] = (time ?? "12:00").split(":").map(Number);
const input = { calendarType: "GREGORIAN" as const, date: { year, month, day }, time: unknown ? undefined : { hour, minute }, timezone, timePrecision: unknown ? "UNKNOWN" as const : "MINUTE" as const, sex, includeLuckCycles: luck, ruleSetId: "STANDARD_ZIPING" };
const chart = new DeterministicBaziEngine().calculate(input);
console.log(`标准化：${chart.input.calculationLocalDateTime} ${chart.input.timezone}`);
console.log(`UTC：${chart.input.utcInstant}`);
console.log(`四柱：${chart.pillars.year.display} ${chart.pillars.month.display} ${chart.pillars.day.display} ${chart.pillars.hour?.display ?? "时辰未知"}`);
if (luck) console.log(chart.luck ? `大运：${chart.luck.direction === "FORWARD" ? "顺排" : "逆排"} · 约 ${chart.luck.start.startAge.years}年${chart.luck.start.startAge.months}个月起运 · ${chart.luck.cycles.slice(0, 3).map((item) => item.pillar.display).join(" ")}` : `大运：${chart.luckUnavailableReason}`);
console.log(`引擎：${chart.engineVersion} / 规则：${chart.ruleset.displayName} ${chart.ruleSetVersion}`);
console.log(`指纹：${chart.calculationFingerprint}`);
if (compareRule) {
  const diff = compareBaziRules(input, "STANDARD_ZIPING", compareRule);
  console.log(`规则比较：${diff.hasDifferences ? `首次差异 ${diff.firstDifference}` : "无差异"}`);
}
if (trace) for (const [index, item] of chart.trace.entries()) console.log(`${index + 1}. ${item.label} [${item.rule}]\n   ${item.description}`);
