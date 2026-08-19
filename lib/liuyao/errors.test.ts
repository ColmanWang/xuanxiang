import { describe, expect, it } from "vitest";
import { LiuyaoCalculationError, isLiuyaoErrorCode } from "./errors";

describe("Liuyao error model", () => {
  it("exposes stable public error codes", () => {
    expect(isLiuyaoErrorCode("INVALID_LINE_COUNT")).toBe(true);
    expect(isLiuyaoErrorCode("AMBIGUOUS_LOCAL_TIME")).toBe(true);
    expect(isLiuyaoErrorCode("NOT_A_CODE")).toBe(false);
  });

  it("keeps field and non-sensitive details without an input payload", () => {
    const error = new LiuyaoCalculationError("INVALID_LINE_VALUE", "爻值必须是 6、7、8 或 9。", "lines.2", {
      index: 2,
    });
    expect(error).toMatchObject({ code: "INVALID_LINE_VALUE", field: "lines.2", details: { index: 2 } });
    expect(error).not.toHaveProperty("input");
    expect(error).not.toHaveProperty("question");
  });
});
