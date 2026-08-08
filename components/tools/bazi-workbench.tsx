"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BaziPillar } from "@/lib/bazi/types";

const mockPillars: BaziPillar[] = [
  { label: "年柱", stem: "甲", branch: "子", tenGod: "偏印", hiddenStems: ["癸"], nayin: "海中金", element: "木 / 水", growthStage: "沐浴" },
  { label: "月柱", stem: "丙", branch: "寅", tenGod: "比肩", hiddenStems: ["甲", "丙", "戊"], nayin: "炉中火", element: "火 / 木", growthStage: "长生" },
  { label: "日柱", stem: "丙", branch: "辰", tenGod: "日主", hiddenStems: ["戊", "乙", "癸"], nayin: "沙中土", element: "火 / 土", growthStage: "冠带" },
  { label: "时柱", stem: "辛", branch: "卯", tenGod: "正财", hiddenStems: ["乙"], nayin: "松柏木", element: "金 / 木", growthStage: "沐浴" },
];

const resultRows: Array<{ label: string; values: string[] }> = [
  { label: "天干", values: mockPillars.map((pillar) => pillar.stem) },
  { label: "地支", values: mockPillars.map((pillar) => pillar.branch) },
  { label: "十神", values: mockPillars.map((pillar) => pillar.tenGod) },
  { label: "藏干", values: mockPillars.map((pillar) => pillar.hiddenStems.join(" · ")) },
  { label: "纳音", values: mockPillars.map((pillar) => pillar.nayin) },
  { label: "五行", values: mockPillars.map((pillar) => pillar.element) },
  { label: "十二长生", values: mockPillars.map((pillar) => pillar.growthStage) },
];

export function BaziWorkbench() {
  const [showResult, setShowResult] = useState(true);

  return (
    <div className="grid gap-10 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <form
        className="border-t-2 border-primary bg-card p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setShowResult(true);
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">输入条件</h2>
          <span className="tabular text-xs text-muted-foreground">INPUT / 01</span>
        </div>
        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm">
            出生日期
            <Input required type="date" defaultValue="1990-02-18" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            出生时间
            <Input required type="time" defaultValue="08:30" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            出生地点
            <Input required placeholder="城市，如：杭州" defaultValue="杭州" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            性别
            <select className="h-11 rounded-sm border bg-background px-3">
              <option>男</option><option>女</option>
            </select>
          </label>
          <fieldset>
            <legend className="mb-2 text-sm">历法</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="border bg-background p-3 text-sm"><input type="radio" name="calendar" defaultChecked className="mr-2" />公历</label>
              <label className="border bg-background p-3 text-sm"><input type="radio" name="calendar" className="mr-2" />农历</label>
            </div>
          </fieldset>
          <Button type="submit" className="w-full">开始推演</Button>
          <p className="text-xs leading-5 text-muted-foreground">
            当前结果为界面演示数据，确定性历法引擎尚未启用。
          </p>
        </div>
      </form>

      <section className="min-w-0" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
          <div>
            <p className="text-xs text-muted-foreground">结构输出 · MOCK DATA</p>
            <h2 className="mt-3 font-serif text-3xl">四柱结构</h2>
          </div>
          <Badge>演示数据</Badge>
        </div>

        {showResult ? (
          <>
            <div className="mt-6 overflow-x-auto border">
              <table className="w-full min-w-[43rem] border-collapse text-center text-sm">
                <caption className="sr-only">四柱演示结果，包含天干、地支、十神、藏干、纳音、五行和十二长生</caption>
                <thead className="bg-ink text-ink-foreground">
                  <tr>
                    <th scope="col" className="p-4 text-left font-normal text-ink-muted">字段</th>
                    {mockPillars.map((pillar) => <th scope="col" className="p-4 font-serif text-lg font-normal" key={pillar.label}>{pillar.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {resultRows.map((row) => (
                    <tr className="border-t odd:bg-card/60" key={row.label}>
                      <th scope="row" className="p-4 text-left font-medium">{row.label}</th>
                      {row.values.map((value, index) => <td className="p-4" key={`${row.label}-${index}`}>{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-px border bg-border sm:grid-cols-2">
              {[
                ["大运", "TODO：接入确定性起运与大运计算"],
                ["流年", "TODO：接入流年序列与关系分析"],
              ].map(([title, description]) => (
                <div className="bg-background p-5" key={title}>
                  <h3 className="font-serif text-lg">{title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>

            <aside className="research-only mt-6 border-l-2 border-accent bg-card p-5">
              <p className="research-label">Research note</p>
              <h3 className="mt-3 font-serif text-lg">规则边界</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                后续计算将明确节气换月、真太阳时、早晚子时与历法转换策略，并保留每一步中间结果供复核。
              </p>
            </aside>
          </>
        ) : null}
      </section>
    </div>
  );
}
