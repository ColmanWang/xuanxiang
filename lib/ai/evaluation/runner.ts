import type { AiEvalFixture, EvalCheck, EvalObservation, EvalResult, EvalStatus, EvalSummary } from "./types";

const REQUIRED_CATEGORIES = ["knowledge", "classics", "bazi", "liuyao", "insufficient-context", "adversarial"] as const;

function check(id: string, label: string, ok: boolean, passDetail: string, failDetail: string): EvalCheck {
  return { id, label, status: ok ? "PASS" : "FAIL", detail: ok ? passDetail : failDetail };
}

function includesNormalized(text: string, fragment: string): boolean {
  return text.normalize("NFKC").toLocaleLowerCase().includes(fragment.normalize("NFKC").toLocaleLowerCase());
}

export function evaluateObservation(fixture: AiEvalFixture, observation: EvalObservation): EvalResult {
  const retrieved = new Set(observation.retrievedEntityIds);
  const available = new Set(observation.availableCitationIds);
  const cited = new Set(observation.citedCitationIds);
  const missingEntities = fixture.expectedEntityIds.filter((id) => !retrieved.has(id));
  const missingCitations = fixture.requiredCitationIds.filter((id) => !cited.has(id));
  const invalidCitations = observation.citedCitationIds.filter((id) => !available.has(id));
  const traceFacts = observation.traceFacts ?? {};
  const unsupportedClaims = observation.claims.filter((claim) => {
    const citationsValid = claim.citationIds.length > 0 && claim.citationIds.every((id) => available.has(id));
    const traceValid = (claim.traceKeys?.length ?? 0) > 0 && claim.traceKeys!.every((key) => Object.hasOwn(traceFacts, key));
    return !citationsValid && !traceValid;
  });
  const forbiddenClaims = fixture.forbiddenClaims.filter((fragment) => observation.claims.some((claim) => includesNormalized(claim.text, fragment)));
  const traceMismatches = Object.entries(fixture.expectedTraceFacts ?? {}).filter(([key, expected]) => observation.traceFacts?.[key] !== expected);
  const refusalCorrect = fixture.expectsRefusal ? observation.refused && observation.claims.length === 0 : !observation.refused;
  const checks: EvalCheck[] = [
    check("retrieval", "Expected entities", missingEntities.length === 0, "All expected entities were retrieved.", `Missing: ${missingEntities.join(", ")}`),
    check("required-citations", "Required citations", missingCitations.length === 0, "All required citations were used.", `Missing: ${missingCitations.join(", ")}`),
    check("citation-validity", "Citation validity", invalidCitations.length === 0, "Every citation was present in supplied context.", `Invented or unavailable: ${invalidCitations.join(", ")}`),
    check("grounding", "Grounded claims", unsupportedClaims.length === 0, "Every factual claim has an available citation.", `${unsupportedClaims.length} unsupported claim(s).`),
    check("forbidden-claims", "Forbidden claims", forbiddenClaims.length === 0, "No forbidden claim was produced.", `Matched: ${forbiddenClaims.join(", ")}`),
    check("trace-consistency", "Calculation trace consistency", traceMismatches.length === 0, "Explanation values match the supplied trace.", `Mismatch: ${traceMismatches.map(([key]) => key).join(", ")}`),
    check("refusal", "Appropriate refusal", refusalCorrect, "Refusal behavior is appropriate for the evidence.", fixture.expectsRefusal ? "Expected a claim-free refusal." : "Unexpected refusal."),
  ];
  const overall: EvalStatus = checks.some((item) => item.status === "FAIL") ? "FAIL" : checks.some((item) => item.status === "REVIEW") ? "REVIEW" : "PASS";
  return { fixtureId: fixture.id, category: fixture.category, overall, checks };
}

export function summarizeEvaluation(results: EvalResult[]): EvalSummary {
  return {
    total: results.length,
    passed: results.filter((item) => item.overall === "PASS").length,
    failed: results.filter((item) => item.overall === "FAIL").length,
    review: results.filter((item) => item.overall === "REVIEW").length,
    results,
  };
}

export function validateFixtureSuite(fixtures: readonly AiEvalFixture[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const fixture of fixtures) {
    if (ids.has(fixture.id)) errors.push(`Duplicate fixture id: ${fixture.id}`);
    ids.add(fixture.id);
    if (!fixture.question.trim()) errors.push(`Empty question: ${fixture.id}`);
    if (fixture.expectsRefusal && (fixture.expectedEntityIds.length > 0 || fixture.requiredCitationIds.length > 0)) errors.push(`Refusal fixture expects evidence: ${fixture.id}`);
  }
  for (const category of REQUIRED_CATEGORIES) if (!fixtures.some((fixture) => fixture.category === category)) errors.push(`Missing category: ${category}`);
  return errors;
}
