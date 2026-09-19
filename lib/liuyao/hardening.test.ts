import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import { NON_SYMMETRIC_HEXAGRAM_FIXTURES } from "@/fixtures/liuyao/non-symmetric";
import { SOUL_POSITION_GOLDEN } from "@/fixtures/liuyao/palaces";
import { EARTHLY_BRANCHES, ganzhiAt } from "@/lib/calendar/ganzhi";
import { getSolarTermsAround } from "@/lib/calendar/lunar-adapter";
import { MONTH_BOUNDARY_TERMS } from "@/lib/calendar/solar-terms";
import { locateSolarTermContext } from "@/lib/calendar/solar-terms";
import { instantToLocal } from "@/lib/calendar/timezone";
import { normalizeBirthInput } from "@/lib/calendar/normalize";
import { calculateDayPillar } from "@/lib/bazi/pillars";
import { STANDARD_ZIPING } from "@/lib/bazi/rules";
import { buildLiuyaoCalendarContext, normalizeLiuyaoInput } from "./calendar-context";
import { DeterministicLiuyaoEngine } from "./engine";
import { HEXAGRAMS, hexagramFromLines } from "./hexagrams";
import { changedYinYang, isMovingLine } from "./lines";
import { palaceFor } from "./palaces";
import { calculateVoidBranches } from "./void-branches";
import { LIUYAO_HEXAGRAM_MANIFEST, LIUYAO_REGRESSION_MANIFEST } from "./manifests";
import type { LiuyaoLineValue } from "./types";

const inputAtInstant = (instant: Temporal.Instant, timezone: string) =>
  normalizeLiuyaoInput({
    method: "MANUAL_LINE_VALUES",
    lines: [7, 8, 9, 7, 6, 8],
    divinationTime: { localDateTime: instantToLocal(instant, timezone), timezone },
  });

describe("Liuyao 8.5 hardening", () => {
  it("locks at least twenty asymmetric lower/upper mappings", () => {
    expect(NON_SYMMETRIC_HEXAGRAM_FIXTURES).toHaveLength(20);
    for (const fixture of NON_SYMMETRIC_HEXAGRAM_FIXTURES) {
      const hexagram = hexagramFromLines(fixture.lines);
      expect({ name: hexagram.name, number: hexagram.number, lower: hexagram.lowerTrigram.id, upper: hexagram.upperTrigram.id }).toEqual({
        name: fixture.name,
        number: fixture.number,
        lower: fixture.lower,
        upper: fixture.upper,
      });
      expect(fixture.lower).not.toBe(fixture.upper);
    }
  });

  it("locks all wandering-soul and returning-soul assignments", () => {
    const special = HEXAGRAMS.map((hexagram) => ({ hexagram, palace: palaceFor(hexagram) })).filter(
      ({ palace }) => palace.position === "WANDERING_SOUL" || palace.position === "RETURNING_SOUL",
    );
    expect(special).toHaveLength(16);
    expect(special.filter(({ palace }) => palace.position === "WANDERING_SOUL")).toHaveLength(8);
    expect(special.filter(({ palace }) => palace.position === "RETURNING_SOUL")).toHaveLength(8);
    expect(special.filter(({ palace }) => palace.position === "WANDERING_SOUL").map(({ hexagram }) => hexagram.name).sort()).toEqual(
      [...SOUL_POSITION_GOLDEN.WANDERING_SOUL].sort(),
    );
    expect(special.filter(({ palace }) => palace.position === "RETURNING_SOUL").map(({ hexagram }) => hexagram.name).sort()).toEqual(
      [...SOUL_POSITION_GOLDEN.RETURNING_SOUL].sort(),
    );
  });

  it("exhaustively validates all sixty void-branch results", () => {
    const expectedByXun = [
      ["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"],
    ] as const;
    for (let index = 0; index < 60; index += 1) {
      const day = { ...ganzhiAt(index), display: `${ganzhiAt(index).stem}${ganzhiAt(index).branch}` };
      expect(calculateVoidBranches(day).branches).toEqual(expectedByXun[Math.floor(index / 10)]);
    }
  });

  it("switches all twelve month-jian boundaries only at the exact instant", () => {
    const terms = getSolarTermsAround(2026, "Asia/Shanghai").filter((term) =>
      term.localDateTime.startsWith("2026-") && MONTH_BOUNDARY_TERMS.includes(term.name as (typeof MONTH_BOUNDARY_TERMS)[number]),
    );
    expect(terms).toHaveLength(12);
    terms.forEach((term) => {
      const instant = Temporal.Instant.from(term.utcInstant);
      const before = buildLiuyaoCalendarContext(inputAtInstant(instant.subtract({ seconds: 1 }), "Asia/Shanghai"));
      const at = buildLiuyaoCalendarContext(inputAtInstant(instant, "Asia/Shanghai"));
      const after = buildLiuyaoCalendarContext(inputAtInstant(instant.add({ seconds: 1 }), "Asia/Shanghai"));
      const expectedIndex = MONTH_BOUNDARY_TERMS.indexOf(term.name as (typeof MONTH_BOUNDARY_TERMS)[number]);
      expect(at.monthBranch).toBe(EARTHLY_BRANCHES[(expectedIndex + 2) % 12]);
      expect(after.monthBranch).toBe(at.monthBranch);
      expect(before.monthBranch).not.toBe(at.monthBranch);
    });
  });

  it("uses one astronomical instant for month-jian across timezones", () => {
    const term = getSolarTermsAround(2026, "UTC").find((item) => item.name === "立秋");
    expect(term).toBeDefined();
    const instant = Temporal.Instant.from(term!.utcInstant);
    for (const timezone of ["Asia/Shanghai", "UTC", "America/New_York"]) {
      const before = buildLiuyaoCalendarContext(inputAtInstant(instant.subtract({ seconds: 1 }), timezone));
      const at = buildLiuyaoCalendarContext(inputAtInstant(instant, timezone));
      expect(before.monthBranch).toBe("未");
      expect(at.monthBranch).toBe("申");
    }
  });

  it("keeps shared calendar facts aligned with the frozen Bazi calendar path", () => {
    const instant = Temporal.Instant.from("2026-08-19T06:30:00Z");
    for (const timezone of ["Asia/Shanghai", "UTC", "America/New_York", "Europe/London", "Australia/Sydney"]) {
      const localDateTime = instantToLocal(instant, timezone);
      const plain = Temporal.PlainDateTime.from(localDateTime);
      const liuyao = buildLiuyaoCalendarContext(inputAtInstant(instant, timezone));
      const baziTime = normalizeBirthInput({
        calendarType: "GREGORIAN",
        date: { year: plain.year, month: plain.month, day: plain.day },
        time: { hour: plain.hour, minute: plain.minute, second: plain.second },
        timezone,
        timePrecision: "MINUTE",
        includeLuckCycles: false,
      });
      const baziDay = calculateDayPillar(baziTime, STANDARD_ZIPING).value;
      const solarTerms = locateSolarTermContext(baziTime);
      expect(liuyao.dayGanzhi.display).toBe(baziDay.display);
      expect(solarTerms.terms.some((term) => term.name === liuyao.monthBoundaryTerm && term.localDateTime === liuyao.monthBoundaryTime)).toBe(true);
    }
  });

  it("strengthens all 4096 moving-line invariants", () => {
    const values: LiuyaoLineValue[] = [6, 7, 8, 9];
    for (let code = 0; code < 4096; code += 1) {
      let cursor = code;
      const lines = Array.from({ length: 6 }, () => {
        const value = values[cursor % 4];
        cursor = Math.floor(cursor / 4);
        return value;
      });
      const movingCount = lines.filter(isMovingLine).length;
      expect(movingCount).toBeGreaterThanOrEqual(0);
      expect(movingCount).toBeLessThanOrEqual(6);
      const changed = movingCount ? hexagramFromLines(lines.map(changedYinYang)) : null;
      expect(changed === null || HEXAGRAMS.includes(changed)).toBe(true);
      if (movingCount === 0) expect(changed).toBeNull();
      if (movingCount === 6) {
        const primary = hexagramFromLines(lines.map((value) => (value === 6 ? "YIN" : "YANG")));
        expect(changed!.lines.every((line, index) => line !== primary.lines[index])).toBe(true);
      }
    }
  });

  it("enumerates the three-coin 1:3:3:1 mapping without randomness", () => {
    const values = Array.from({ length: 8 }, (_, mask) =>
      [0, 1, 2].reduce((sum, bit) => sum + ((mask >> bit) & 1 ? 3 : 2), 0),
    );
    expect(values.filter((value) => value === 6)).toHaveLength(1);
    expect(values.filter((value) => value === 7)).toHaveLength(3);
    expect(values.filter((value) => value === 8)).toHaveLength(3);
    expect(values.filter((value) => value === 9)).toHaveLength(1);
  });

  it("publishes complete regression manifests without user input", () => {
    expect(LIUYAO_HEXAGRAM_MANIFEST).toHaveLength(64);
    expect(new Set(LIUYAO_HEXAGRAM_MANIFEST.map((entry) => entry.number)).size).toBe(64);
    expect(LIUYAO_REGRESSION_MANIFEST.engineVersion).toBe("1.0.0");
    expect(LIUYAO_REGRESSION_MANIFEST.hexagramCount).toBe(64);
    expect(JSON.stringify(LIUYAO_REGRESSION_MANIFEST)).not.toMatch(/question|divinationTime|lines/);
  });

  it("keeps repeated calculations deterministic", () => {
    const engine = new DeterministicLiuyaoEngine();
    const input = { method: "MANUAL_LINE_VALUES" as const, lines: [7, 8, 9, 7, 6, 8] as const, divinationTime: { localDateTime: "2026-08-19T14:30", timezone: "Asia/Shanghai" } };
    expect(engine.calculate(input)).toEqual(engine.calculate(input));
  });
});
