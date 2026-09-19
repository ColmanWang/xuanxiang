import { AI_EVAL_FIXTURES, fixtureCounts } from "@/fixtures/ai/eval";
import { readFile } from "node:fs/promises";
import { evaluateObservation, summarizeEvaluation, validateFixtureSuite, type EvalObservation } from "@/lib/ai/evaluation";

async function main() {
  const suiteErrors = validateFixtureSuite(AI_EVAL_FIXTURES);
  if (suiteErrors.length) {
    console.error("AI evaluation fixture suite: FAIL");
    for (const error of suiteErrors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  const observationArgument = process.argv.find((argument) => argument.startsWith("--observations="));
  const observationFile = observationArgument?.slice("--observations=".length);
  const supplied = observationFile ? await loadObservations(observationFile) : undefined;
  // Canonical observations exercise every hard validator offline. End-to-end provider behavior
  // belongs to ai:smoke and is deliberately not a default CI dependency.
  const results = AI_EVAL_FIXTURES.map((fixture) => evaluateObservation(fixture, supplied?.[fixture.id] ?? {
    retrievedEntityIds: fixture.expectedEntityIds,
    availableCitationIds: fixture.requiredCitationIds,
    citedCitationIds: fixture.requiredCitationIds,
    claims: [],
    traceFacts: fixture.expectedTraceFacts,
    refused: fixture.expectsRefusal === true,
  }));
  const summary = summarizeEvaluation(results);
  const categories = [
    ["retrieval", ["knowledge", "classics"]],
    ["citation", ["knowledge", "classics"]],
    ["grounding", ["knowledge", "classics", "adversarial"]],
    ["calculation explanation", ["bazi", "liuyao"]],
    ["insufficient-context", ["insufficient-context", "adversarial"]],
  ] as const;
  console.log(observationFile ? `AI eval mode: supplied observations (${observationFile})` : "AI eval mode: deterministic fixture and hard-constraint validation (no paid provider)");
  console.log(`Fixtures: ${JSON.stringify(fixtureCounts())}`);
  for (const [label, selected] of categories) {
    const selectedCategories = new Set<string>(selected);
    const relevant = results.filter((result) => selectedCategories.has(result.category));
    console.log(`${label}: ${relevant.every((result) => result.overall === "PASS") ? "PASS" : "FAIL"} (${relevant.length})`);
  }
  console.log(`Total: PASS ${summary.passed} / FAIL ${summary.failed} / REVIEW ${summary.review}`);
  if (summary.failed) process.exitCode = 1;
}

async function loadObservations(path: string): Promise<Record<string, EvalObservation>> {
  const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Observations must be a JSON object keyed by fixture id.");
  const observations = parsed as Record<string, EvalObservation>;
  const missing = AI_EVAL_FIXTURES.filter((fixture) => !observations[fixture.id]).map((fixture) => fixture.id);
  if (missing.length) throw new Error(`Observations are missing ${missing.length} fixture(s): ${missing.slice(0, 5).join(", ")}`);
  return observations;
}

void main().catch((error) => { console.error(`AI eval: FAIL (${error instanceof Error ? error.message : "unknown error"})`); process.exitCode = 1; });
