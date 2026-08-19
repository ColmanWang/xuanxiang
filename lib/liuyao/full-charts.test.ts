import { describe, expect, it } from "vitest";
import { LIUYAO_FULL_CHART_FIXTURES } from "@/fixtures/liuyao/full-charts";
import { DeterministicLiuyaoEngine } from "./engine";

describe("Liuyao full-chart regression fixtures", () => {
  const engine = new DeterministicLiuyaoEngine();

  it.each(LIUYAO_FULL_CHART_FIXTURES)("$id", (fixture) => {
    const chart = engine.calculate(fixture.input);
    expect({ number: chart.primaryHexagram.number, name: chart.primaryHexagram.name }).toEqual(fixture.expected.primary);
    expect(chart.movingLines.map((line) => line.lineIndex)).toEqual(fixture.expected.movingLineIndices);
    expect(chart.changedHexagram ? { number: chart.changedHexagram.number, name: chart.changedHexagram.name } : null).toEqual(
      fixture.expected.changed,
    );
    expect({ name: chart.palace.trigram.name, position: chart.palace.position }).toEqual(fixture.expected.palace);
    expect(chart.shiYing).toEqual(fixture.expected.shiYing);
    expect(chart.calendarContext.dayGanzhi.display).toBe(fixture.expected.dayGanzhi);
    expect(chart.calendarContext.monthBranch).toBe(fixture.expected.monthBranch);
    expect(chart.lines.map((line) => `${line.najia.stem}${line.najia.branch}`)).toEqual(fixture.expected.najia);
    expect(chart.lines.map((line) => line.relative)).toEqual(fixture.expected.relatives);
    expect(chart.lines.map((line) => line.spirit)).toEqual(fixture.expected.spirits);
    expect(chart.engineVersion).toBe("1.0.0");
    expect(chart.trace).toHaveLength(11);
  });

  it("covers no movement, bottom movement, top movement, multiple movement and all movement", () => {
    expect(LIUYAO_FULL_CHART_FIXTURES.map((fixture) => fixture.expected.movingLineIndices)).toEqual([
      [2, 4],
      [],
      [0],
      [5],
      [0, 1, 2, 3, 4, 5],
    ]);
  });

  it("covers multiple timezones and explicit DST disambiguation", () => {
    expect(new Set(LIUYAO_FULL_CHART_FIXTURES.map((fixture) => fixture.input.divinationTime.timezone))).toEqual(
      new Set(["Asia/Shanghai", "UTC", "America/New_York", "Europe/London"]),
    );
    expect(LIUYAO_FULL_CHART_FIXTURES.find((fixture) => fixture.id === "kun-top-moving-new-york")?.input.divinationTime.timeDisambiguation).toBe(
      "LATER",
    );
  });

  it("requires complete provenance metadata for every fixture", () => {
    for (const fixture of LIUYAO_FULL_CHART_FIXTURES) {
      expect(fixture.verification.source).not.toBe("");
      expect(fixture.verification.locator).not.toBe("");
      expect(fixture.verification.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(["A", "B", "C"]).toContain(fixture.verification.tier);
    }
  });
});
