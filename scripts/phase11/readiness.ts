export type ReadinessStatus = "READY" | "READY_WITH_LIMITATIONS" | "BLOCKED";
export type CheckStatus = "PASS" | "WAIVED" | "BLOCKED";
export type ReadinessCheck = { id: string; status: CheckStatus; detail: string };
export type ReadinessReport = { status: ReadinessStatus; checks: readonly ReadinessCheck[] };

export const CORE_CHECK_IDS = [
  "db", "migration", "backup", "restore", "auth", "rbac", "studio", "content", "bazi", "liuyao",
  "rate-limit", "security", "observability", "seo", "privacy", "ci-cd", "smoke",
] as const;
export const AI_CHECK_IDS = ["ai-provider", "rag-index", "ai-regression", "ai-smoke"] as const;

export function summarize(checks: readonly ReadinessCheck[]): ReadinessReport {
  const status = checks.some((check) => check.status === "BLOCKED")
    ? "BLOCKED"
    : checks.some((check) => check.status === "WAIVED") ? "READY_WITH_LIMITATIONS" : "READY";
  return { status, checks };
}

export function buildReadinessReport(evidence: Record<string, Partial<ReadinessCheck>> = {}) {
  const check = (id: string): ReadinessCheck => {
    const item = evidence[id];
    if (item?.status === "PASS" || item?.status === "WAIVED" || item?.status === "BLOCKED") {
      return { id, status: item.status, detail: item.detail?.trim() || "No detail recorded." };
    }
    return { id, status: "BLOCKED", detail: "No verified evidence supplied; absence is not treated as PASS." };
  };
  const core = summarize(CORE_CHECK_IDS.map(check));
  const ai = summarize(AI_CHECK_IDS.map(check));
  return {
    core,
    ai,
    launch: core.status === "BLOCKED" ? "BLOCKED" : core.status === "READY_WITH_LIMITATIONS" || ai.status !== "READY" ? "READY_WITH_LIMITATIONS" : "READY",
    aiEnabled: ai.status !== "BLOCKED",
  } as const;
}
