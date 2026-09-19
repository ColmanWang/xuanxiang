import { describe, expect, it } from "vitest";
import { AI_EVAL_FIXTURES, fixtureCounts } from "@/fixtures/ai/eval";
import { evaluateObservation, validateFixtureSuite } from "./runner";

describe("AI evaluation fixtures", () => {
  it("covers every required Phase 10 category", () => {
    expect(fixtureCounts()).toEqual({
      knowledge: 20,
      classics: 10,
      bazi: 10,
      liuyao: 10,
      insufficientContext: 10,
      adversarial: 8,
      total: 68,
    });
    expect(validateFixtureSuite(AI_EVAL_FIXTURES)).toEqual([]);
  });

  it("programmatically checks entities, citations and grounded claims", () => {
    const fixture = AI_EVAL_FIXTURES.find((item) => item.id === "knowledge-wuxing")!;
    const result = evaluateObservation(fixture, {
      retrievedEntityIds: ["concept:wuxing"],
      availableCitationIds: ["citation-wuxing"],
      citedCitationIds: ["citation-wuxing"],
      claims: [{ text: "五行是木火土金水五种类别。", citationIds: ["citation-wuxing"] }],
      refused: false,
    });
    expect(result.overall).toBe("PASS");
    expect(result.checks.map((check) => check.status)).not.toContain("FAIL");
  });

  it("rejects invented citation ids and unsupported claims", () => {
    const fixture = AI_EVAL_FIXTURES.find((item) => item.id === "knowledge-wuxing")!;
    const result = evaluateObservation(fixture, {
      retrievedEntityIds: ["concept:wuxing"],
      availableCitationIds: ["citation-wuxing"],
      citedCitationIds: ["citation:invented"],
      claims: [{ text: "五行可预测每个人的寿命。", citationIds: [] }],
      refused: false,
    });
    expect(result.overall).toBe("FAIL");
    expect(result.checks.some((check) => check.id === "citation-validity" && check.status === "FAIL")).toBe(true);
    expect(result.checks.some((check) => check.id === "grounding" && check.status === "FAIL")).toBe(true);
  });

  it("checks calculation trace values without asking AI to recalculate", () => {
    const fixture = AI_EVAL_FIXTURES.find((item) => item.id === "bazi-month-pillar")!;
    const pass = evaluateObservation(fixture, {
      retrievedEntityIds: [], availableCitationIds: [], citedCitationIds: [], claims: [], refused: false,
      traceFacts: { "pillars.month": "丙寅", "ruleset.id": "STANDARD_ZIPING" },
    });
    const fail = evaluateObservation(fixture, {
      retrievedEntityIds: [], availableCitationIds: [], citedCitationIds: [], claims: [], refused: false,
      traceFacts: { "pillars.month": "丁卯", "ruleset.id": "STANDARD_ZIPING" },
    });
    expect(pass.overall).toBe("PASS");
    expect(fail.checks.find((check) => check.id === "trace-consistency")?.status).toBe("FAIL");
  });

  it("requires refusal when evidence is insufficient", () => {
    const fixture = AI_EVAL_FIXTURES.find((item) => item.id === "insufficient-unknown-passage")!;
    expect(evaluateObservation(fixture, {
      retrievedEntityIds: [], availableCitationIds: [], citedCitationIds: [], claims: [], refused: true,
    }).overall).toBe("PASS");
    expect(evaluateObservation(fixture, {
      retrievedEntityIds: [], availableCitationIds: [], citedCitationIds: [],
      claims: [{ text: "我猜原文是……", citationIds: [] }], refused: false,
    }).overall).toBe("FAIL");
  });
});
