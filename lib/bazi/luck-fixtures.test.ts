import { describe, expect, it } from "vitest";
import { luckCycleFixtures } from "@/fixtures/bazi/luck-cycles";
import { DeterministicBaziEngine } from "./engine";
import { referenceSequence, referenceYun } from "@/tests/reference/luck-reference";

describe("大运 Golden / cross-check fixtures", () => {
  const engine = new DeterministicBaziEngine();

  it.each(luckCycleFixtures)("$id 方向、起运与前三步", (fixture) => {
    const chart = engine.calculate(fixture.input);
    expect(chart.luck).not.toBeNull();
    expect(chart.luck?.direction).toBe(fixture.expectedDirection);
    expect(chart.luck?.start.startAge).toMatchObject(fixture.expectedStartAge);
    expect(chart.luck?.cycles.slice(0, 3).map((cycle) => cycle.pillar.display)).toEqual(fixture.expectedFirstCycles);

    const reference = referenceYun(fixture.input);
    expect(reference.direction).toBe(fixture.expectedDirection);
    expect(reference.startAge.years).toBe(fixture.expectedStartAge.years);
    expect(reference.startAge.months).toBe(fixture.expectedStartAge.months);
    // 两实现对剩余不足一日的取整方式不同；保留差异而不是篡改生产结果。
    expect(Math.abs(reference.startAge.days - fixture.expectedStartAge.days)).toBeLessThanOrEqual(1);
    expect(referenceSequence(chart.pillars.month.display, fixture.expectedDirection, 3)).toEqual(fixture.expectedFirstCycles);
  });
});
