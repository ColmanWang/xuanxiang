"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, CheckCircle2, Coins, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FIVE_ELEMENT_LABEL as elementLabels,
  LIUYAO_TRACE_KIND_LABEL as traceKindLabels,
  LINE_STATE_LABEL as stateLabels,
  SIX_RELATIVE_LABEL as relativeLabels,
  SIX_SPIRIT_LABEL as spiritLabels,
  YIN_YANG_LABEL as yinYangLabels,
} from "@/lib/liuyao/labels";
import type {
  LiuyaoChart,
  LiuyaoLine,
  LiuyaoLineValue,
  YinYang,
} from "@/lib/liuyao/types";

type ResultTab = "卦盘" | "结构" | "依据";
type CoinSide = "HEAD" | "TAIL";
type CoinTossLine = { coins: readonly [CoinSide, CoinSide, CoinSide]; value: LiuyaoLineValue };

const TABS: ResultTab[] = ["卦盘", "结构", "依据"];
const TIMEZONES = ["Asia/Shanghai", "Asia/Hong_Kong", "Asia/Tokyo", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles", "Australia/Sydney"];
const POSITION_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;
const DEFAULT_LINES: LiuyaoLineValue[] = [7, 8, 9, 7, 6, 8];

const lineValueLabels: Record<LiuyaoLineValue, string> = {
  6: "老阴 6",
  7: "少阳 7",
  8: "少阴 8",
  9: "老阳 9",
};

function toLocalDateInput(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function tossCoins(): CoinTossLine {
  const randomBytes = crypto.getRandomValues(new Uint8Array(3));
  const coins = Array.from(randomBytes, (value) => (value < 128 ? "HEAD" : "TAIL")) as [CoinSide, CoinSide, CoinSide];
  const sum = coins.reduce((total, coin) => total + (coin === "HEAD" ? 3 : 2), 0);
  return { coins, value: sum as LiuyaoLineValue };
}

function lineMark(yinYang: YinYang) {
  if (yinYang === "YANG") return <span aria-hidden="true" className="block h-px w-24 bg-foreground sm:w-32" />;
  return (
    <span aria-hidden="true" className="flex w-24 items-center justify-between sm:w-32">
      <span className="block h-px w-10 bg-foreground sm:w-14" />
      <span className="block h-px w-10 bg-foreground sm:w-14" />
    </span>
  );
}

function lineValueFromForm(value: FormDataEntryValue | null): LiuyaoLineValue {
  const numeric = Number(value);
  return numeric === 6 || numeric === 7 || numeric === 8 || numeric === 9 ? numeric : 7;
}

function LineVisual({ line, changed }: { line: LiuyaoLine; changed?: YinYang }) {
  return (
    <div className="grid gap-3 border-b py-4 last:border-b-0 md:grid-cols-[5.5rem_4.5rem_5rem_minmax(9rem,1fr)_5rem_5rem] md:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{line.positionName}</span>
        {line.isShi ? <Badge>世</Badge> : null}
        {line.isYing ? <Badge>应</Badge> : null}
      </div>
      <span className="text-sm text-muted-foreground">{spiritLabels[line.spirit]}</span>
      <span className="text-sm">{relativeLabels[line.relative]}</span>
      <div className="flex items-center gap-4">
        {lineMark(line.yinYang)}
        {line.moving ? <span className="text-xs text-accent">动</span> : null}
      </div>
      <span className="text-sm text-muted-foreground">{line.najia.stem}{line.najia.branch} · {elementLabels[line.element]}</span>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {changed ? lineMark(changed) : <span>—</span>}
        <span className="sr-only">本爻为{yinYangLabels[line.yinYang]}爻{line.moving ? "，动爻" : ""}</span>
      </div>
    </div>
  );
}

export function LiuyaoWorkbench() {
  const [chart, setChart] = useState<LiuyaoChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<ResultTab>("卦盘");
  const [lines, setLines] = useState<readonly LiuyaoLineValue[]>(DEFAULT_LINES);
  const [coinLines, setCoinLines] = useState<CoinTossLine[]>([]);
  const [inputMode, setInputMode] = useState<"manual" | "coins">("manual");
  const [divinationTime] = useState(() => toLocalDateInput());
  const canSubmit = inputMode === "manual" || coinLines.length === 6;
  const effectiveLines = useMemo(() => (inputMode === "coins" ? coinLines.map((line) => line.value) : lines), [coinLines, inputMode, lines]);

  async function submit(formData: FormData) {
    if (!canSubmit) {
      setError("三枚钱币模式需要逐爻完成六次记录。");
      return;
    }
    setPending(true);
    setError(null);
    const input = {
      method: inputMode === "coins" ? "THREE_COINS" : "MANUAL_LINE_VALUES",
      lineOrder: "BOTTOM_TO_TOP",
      lines: effectiveLines,
      divinationTime: {
        localDateTime: String(formData.get("divinationTime")),
        timezone: String(formData.get("timezone")),
      },
      question: String(formData.get("question") || "") || undefined,
      ruleSetId: "STANDARD_WENWANG_GUA",
    };
    try {
      const response = await fetch("/api/tools/liuyao/calculate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await response.json() as { chart?: LiuyaoChart; error?: { code?: string; message?: string; issues?: Array<{ message: string }> } };
      if (!response.ok || !payload.chart) {
        throw new Error(payload.error?.issues?.[0]?.message ?? payload.error?.message ?? "六爻推演失败，请检查输入。");
      }
      setChart(payload.chart);
      setTab("卦盘");
    } catch (caught) {
      setChart(null);
      setError(caught instanceof Error ? caught.message : "六爻推演失败，请稍后重试。");
    } finally {
      setPending(false);
    }
  }

  function updateLine(index: number, value: LiuyaoLineValue) {
    setLines((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function recordCoinLine() {
    setCoinLines((current) => current.length >= 6 ? current : [...current, tossCoins()]);
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <form className="h-fit border-t-2 border-primary bg-card p-6" onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">起卦输入</h2>
          <span className="tabular text-xs text-muted-foreground">INPUT / 02</span>
        </div>
        <div className="mt-7 flex flex-col gap-6">
          <fieldset>
            <legend className="mb-2 text-sm">起卦方式</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="border bg-background p-3 text-sm">
                <input type="radio" name="inputMode" checked={inputMode === "manual"} onChange={() => setInputMode("manual")} className="mr-2" />
                手动录入
              </label>
              <label className="border bg-background p-3 text-sm">
                <input type="radio" name="inputMode" checked={inputMode === "coins"} onChange={() => setInputMode("coins")} className="mr-2" />
                三钱逐爻
              </label>
            </div>
          </fieldset>

          {inputMode === "manual" ? (
            <fieldset>
              <legend className="mb-3 text-sm">六爻值（内部顺序：初爻 → 上爻）</legend>
              <div className="grid gap-3">
                {[5, 4, 3, 2, 1, 0].map((visualIndex) => (
                  <label key={visualIndex} className="grid grid-cols-[4rem_1fr] items-center gap-3 text-sm">
                    <span>{POSITION_NAMES[visualIndex]}</span>
                    <select value={lines[visualIndex]} onChange={(event) => updateLine(visualIndex, lineValueFromForm(event.target.value))} className="h-10 rounded-sm border bg-background px-3">
                      {[6, 7, 8, 9].map((value) => <option key={value} value={value}>{lineValueLabels[value as LiuyaoLineValue]}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">页面按上爻到初爻显示；提交给引擎时始终保持初爻到上爻。</p>
            </fieldset>
          ) : (
            <section className="border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium">三枚钱币</h3>
                  <p className="mt-1 text-xs text-muted-foreground">每次只生成一爻，完成六爻后再推演。</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={recordCoinLine} disabled={coinLines.length >= 6}>
                  <Coins className="size-4" />
                  记录第 {Math.min(coinLines.length + 1, 6)} 爻
                </Button>
              </div>
              <ol className="mt-4 grid gap-2">
                {coinLines.map((line, index) => (
                  <li key={`${index}-${line.coins.join("")}`} className="flex items-center justify-between border bg-background px-3 py-2 text-sm">
                    <span>{POSITION_NAMES[index]}</span>
                    <span className="text-muted-foreground">{line.coins.map((coin) => coin === "HEAD" ? "正" : "背").join(" · ")}</span>
                    <strong className="font-normal">{lineValueLabels[line.value]}</strong>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setCoinLines((current) => current.slice(0, -1))} disabled={!coinLines.length}>撤回一爻</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setCoinLines([])} disabled={!coinLines.length}>清空</Button>
              </div>
            </section>
          )}

          <label className="flex flex-col gap-2 text-sm">
            起卦时间
            <Input name="divinationTime" type="datetime-local" required defaultValue={divinationTime} />
            <span className="text-xs text-muted-foreground">“使用当前时间”会在页面生成明确时间；引擎不会隐式读取当前时间。</span>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            IANA 时区
            <select name="timezone" defaultValue="Asia/Shanghai" className="h-11 rounded-sm border bg-background px-3">
              {TIMEZONES.map((zone) => <option key={zone}>{zone}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            所问之事（可选备注）
            <textarea name="question" maxLength={500} rows={3} className="resize-none rounded-sm border bg-background px-3 py-2" placeholder="仅作为本次页面备注，不参与计算。" />
          </label>
          <Button type="submit" className="w-full" disabled={pending || !canSubmit}>
            {pending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
            {pending ? "正在推演" : "开始推演"}
          </Button>
          <p className="flex gap-2 text-xs leading-5 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            当前推演即时计算，不保存所问内容或卦盘。
          </p>
          <p className="text-xs leading-5 text-muted-foreground">推演结果用于传统术数研究与文化参考，不应作为医疗、法律、投资或其他重大人生决策依据。</p>
          {error ? <p role="alert" className="flex gap-2 border-l-2 border-destructive bg-background p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</p> : null}
        </div>
      </form>

      <section className="min-w-0" aria-live="polite">
        {!chart ? (
          <div className="grid min-h-[30rem] place-items-center border bg-card/30 p-8 text-center">
            <div>
              <p className="text-xs tracking-[0.2em] text-muted-foreground">DETERMINISTIC LIUYAO</p>
              <h2 className="mt-4 font-serif text-3xl">等待推演</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">六个爻值是起卦输入事实；本卦、动爻、变卦、纳甲、六亲与六神由程序确定性派生。</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-xs text-muted-foreground">确定性输出 · ENGINE {chart.engineVersion}</p>
                <h2 className="mt-3 font-serif text-3xl">六爻卦盘</h2>
              </div>
              <Badge>{chart.ruleSet.displayName} · v{chart.ruleSet.version}</Badge>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="border bg-card p-4">
                <p className="text-xs text-muted-foreground">本卦</p>
                <p className="mt-2 font-serif text-2xl">{chart.primaryHexagram.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">第 {chart.primaryHexagram.number} 卦 · {chart.primaryHexagram.lowerTrigram.name}下{chart.primaryHexagram.upperTrigram.name}上</p>
              </article>
              <article className="border bg-card p-4">
                <p className="text-xs text-muted-foreground">变卦</p>
                <p className="mt-2 font-serif text-2xl">{chart.changedHexagram?.name ?? "无动爻"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{chart.movingLines.length ? `${chart.movingLines.length} 个动爻` : "不生成变卦"}</p>
              </article>
              <article className="border bg-card p-4">
                <p className="text-xs text-muted-foreground">日辰 / 月建</p>
                <p className="mt-2 font-serif text-2xl">{chart.calendarContext.dayGanzhi.display}日</p>
                <p className="mt-1 text-xs text-muted-foreground">{chart.calendarContext.monthBranch}月建 · {chart.calendarContext.timezone}</p>
              </article>
            </div>
            <div className="mt-7 flex gap-1 overflow-x-auto border-b" role="tablist">
              {TABS.map((item) => <button type="button" role="tab" aria-selected={tab === item} key={item} onClick={() => setTab(item)} className={`min-w-20 border-b-2 px-4 py-3 text-sm ${tab === item ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{item}</button>)}
            </div>
            <div className="py-7">
              {tab === "卦盘" ? <ChartLines chart={chart} /> : tab === "结构" ? <Structure chart={chart} /> : <Trace chart={chart} />}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ChartLines({ chart }: { chart: LiuyaoChart }) {
  return (
    <div className="border bg-card px-4 sm:px-6">
      <div className="hidden border-b py-3 text-xs text-muted-foreground md:grid md:grid-cols-[5.5rem_4.5rem_5rem_minmax(9rem,1fr)_5rem_5rem]">
        <span>爻位</span><span>六神</span><span>六亲</span><span>本卦</span><span>纳甲</span><span>变卦</span>
      </div>
      {[...chart.lines].reverse().map((line) => <LineVisual key={line.index} line={line} changed={line.moving ? line.changedYinYang : undefined} />)}
      <p className="py-4 text-xs leading-6 text-muted-foreground">六亲为传统六爻术语标签，不代表现实家庭或性别判断。六神仅作为排盘结构展示，不作吉凶解释。</p>
    </div>
  );
}

function Structure({ chart }: { chart: LiuyaoChart }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="border bg-card p-5">
        <h3 className="font-serif text-xl">八宫与世应</h3>
        <dl className="mt-5 grid grid-cols-[6rem_1fr] gap-y-3 text-sm">
          <dt className="text-muted-foreground">所属宫</dt><dd>{chart.palace.trigram.name}宫</dd>
          <dt className="text-muted-foreground">宫位</dt><dd>{chart.palace.position}</dd>
          <dt className="text-muted-foreground">世爻</dt><dd>{POSITION_NAMES[chart.shiYing.shiLine]}</dd>
          <dt className="text-muted-foreground">应爻</dt><dd>{POSITION_NAMES[chart.shiYing.yingLine]}</dd>
        </dl>
      </article>
      <article className="border bg-card p-5">
        <h3 className="font-serif text-xl">动变</h3>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {chart.movingLines.length ? chart.movingLines.map((line) => `${POSITION_NAMES[line.lineIndex]}：${stateLabels[line.originalState]} → ${stateLabels[line.changedState]}`).join("；") : "本卦无动爻。"}
        </p>
      </article>
      <article className="border bg-card p-5 md:col-span-2">
        <h3 className="font-serif text-xl">知识联动</h3>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary">
          <Link href="/techniques/liuyao">了解六爻</Link>
          <Link href="/techniques/najia">纳甲</Link>
          <Link href="/knowledge/bagua">八卦</Link>
          <Link href="/classics/zhouyi">查看《周易》相关典籍</Link>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">六十四卦经典文本传统与后世纳甲六爻排盘规则不是同一层次；本页只展示排盘结构。</p>
      </article>
    </div>
  );
}

function Trace({ chart }: { chart: LiuyaoChart }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl">推演依据</h3>
          <p className="mt-2 text-sm text-muted-foreground">{chart.ruleSet.displayName} · 引擎 {chart.engineVersion} · 规则 {chart.ruleSet.version}</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{chart.fingerprint}</p>
        </div>
        <Link href="/techniques/liuyao" className="inline-flex items-center gap-2 text-sm text-primary">
          <BookOpen className="size-4" />
          六爻知识档案
        </Link>
      </div>
      <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">六爻起卦值属于输入事实；本卦、变卦、纳甲、世应、六亲、六神和月建日辰属于确定性派生。</p>
      <ol className="mt-6 border-l">
        {chart.trace.map((item, index) => (
          <li className="relative ml-5 border-b py-5 last:border-b-0" key={item.id}>
            <span className="absolute -left-[1.65rem] top-6 grid size-5 place-items-center rounded-full border bg-background text-[10px]">{index + 1}</span>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium">{item.label}</h4>
              <Badge>{traceKindLabels[item.kind]}</Badge>
              <Badge>{item.rule}</Badge>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">伏神当前状态：{chart.hiddenSpiritsStatus === "NOT_IMPLEMENTED" ? "暂不计算，等待规则来源与 Golden Dataset 完成后再进入稳定引擎。" : chart.hiddenSpiritsStatus}</p>
    </div>
  );
}
