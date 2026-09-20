import { describe, expect, it } from "vitest";
import { AI_CHECK_IDS, CORE_CHECK_IDS, buildReadinessReport, summarize } from "./readiness";

describe("LaunchReadiness", () => {
  it("uses the three-state model without percentages", () => {
    expect(summarize([{ id: "x", status: "PASS", detail: "ok" }]).status).toBe("READY");
    expect(summarize([{ id: "x", status: "WAIVED", detail: "accepted" }]).status).toBe("READY_WITH_LIMITATIONS");
    expect(summarize([{ id: "x", status: "BLOCKED", detail: "missing" }]).status).toBe("BLOCKED");
  });
  it("keeps Core and AI independent", () => {
    const evidence = Object.fromEntries(CORE_CHECK_IDS.map((id) => [id, { status: "PASS" as const, detail: "verified" }]));
    const result = buildReadinessReport(evidence);
    expect(result.core.status).toBe("READY");
    expect(result.ai.status).toBe("BLOCKED");
    expect(result.launch).toBe("READY_WITH_LIMITATIONS");
    expect(result.aiEnabled).toBe(false);
    expect(result.ai.checks.map((item) => item.id)).toEqual(AI_CHECK_IDS);
  });
  it("does not turn missing evidence into a pass", () => {
    expect(buildReadinessReport().launch).toBe("BLOCKED");
  });
});
