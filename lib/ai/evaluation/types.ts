export type EvalCategory = "knowledge" | "classics" | "bazi" | "liuyao" | "insufficient-context" | "adversarial";
export type EvalStatus = "PASS" | "FAIL" | "REVIEW";

export interface AiEvalFixture {
  id: string;
  category: EvalCategory;
  question: string;
  expectedEntityIds: string[];
  requiredCitationIds: string[];
  forbiddenClaims: string[];
  expectedTraceFacts?: Record<string, string | number | boolean | null>;
  expectsRefusal?: boolean;
  note?: string;
}

export interface EvaluatedClaim { text: string; citationIds: string[]; traceKeys?: string[] }

export interface EvalObservation {
  retrievedEntityIds: string[];
  availableCitationIds: string[];
  citedCitationIds: string[];
  claims: EvaluatedClaim[];
  traceFacts?: Record<string, string | number | boolean | null>;
  refused: boolean;
}

export interface EvalCheck { id: string; label: string; status: EvalStatus; detail: string }
export interface EvalResult { fixtureId: string; category: EvalCategory; overall: EvalStatus; checks: EvalCheck[] }
export interface EvalSummary { total: number; passed: number; failed: number; review: number; results: EvalResult[] }

export interface EvaluationRubricItem { id: string; label: string; question: string; allowedStatuses: readonly EvalStatus[] }
