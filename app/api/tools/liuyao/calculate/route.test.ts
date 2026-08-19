import { describe, expect, it } from "vitest";
import { POST } from "./route";

const valid = {
  method: "MANUAL_LINE_VALUES",
  lineOrder: "BOTTOM_TO_TOP",
  lines: [7, 8, 9, 7, 6, 8],
  divinationTime: { localDateTime: "2026-08-19T14:30", timezone: "Asia/Shanghai" },
  question: "仅作备注，不进入计算",
};

async function call(body: unknown) {
  const response = await POST(
    new Request("http://localhost/api/tools/liuyao/calculate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return {
    status: response.status,
    body: (await response.json()) as {
      chart?: { primaryHexagram: { name: string }; changedHexagram: { name: string } | null; fingerprint: string };
      error?: { code: string; message: string; field?: string };
    },
  };
}

describe("POST /api/tools/liuyao/calculate contract", () => {
  it("returns a deterministic Liuyao chart", async () => {
    const result = await call(valid);

    expect(result.status).toBe(200);
    expect(result.body.chart?.primaryHexagram.name).toBe("丰");
    expect(result.body.chart?.changedHexagram?.name).toBe("随");
    expect(result.body.chart?.fingerprint).toMatch(/^xx-liuyao-/);
  });

  it.each([
    [{ ...valid, lines: [7, 8, 9] }, "INVALID_LINE_COUNT"],
    [{ ...valid, lines: [7, 8, 10, 7, 6, 8] }, "INVALID_LINE_VALUE"],
    [{ ...valid, lineOrder: "TOP_TO_BOTTOM" }, "INVALID_LINE_ORDER"],
    [{ ...valid, ruleSetId: "UNKNOWN" }, "UNSUPPORTED_RULESET"],
    [{ ...valid, divinationTime: { localDateTime: "2026-02-30T12:00", timezone: "Asia/Shanghai" } }, "INVALID_DATE"],
    [{ ...valid, divinationTime: { localDateTime: "2026-08-19T12:00", timezone: "Mars/Olympus" } }, "INVALID_TIMEZONE"],
    [
      { ...valid, divinationTime: { localDateTime: "2024-03-10T02:30", timezone: "America/New_York" } },
      "NONEXISTENT_LOCAL_TIME",
    ],
    [
      { ...valid, divinationTime: { localDateTime: "2024-11-03T01:30", timezone: "America/New_York" } },
      "AMBIGUOUS_LOCAL_TIME",
    ],
  ])("returns stable error code %s", async (input, code) => {
    const result = await call(input);

    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.body.error?.code).toBe(code);
  });

  it("accepts explicit DST disambiguation", async () => {
    const result = await call({
      ...valid,
      divinationTime: { localDateTime: "2024-11-03T01:30", timezone: "America/New_York", timeDisambiguation: "LATER" },
    });

    expect(result.status).toBe(200);
  });
});
