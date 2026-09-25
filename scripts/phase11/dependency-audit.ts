import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type AuditFinding = {
  githubAdvisoryId: string;
  moduleName: string;
  severity: string;
  versions?: string[];
  paths?: string[];
};

export type DependencyWaiver = {
  advisoryId: string;
  package: string;
  severity: string;
  affectedVersion: string;
  allowedPathSuffixes: string[];
  expiresAt: string;
};

type RawAuditAdvisory = {
  github_advisory_id: string;
  module_name: string;
  severity: string;
  findings: Array<{ version: string; paths: string[] }>;
};

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) return undefined;
  return timestamp;
}

export function parseAuditReport(stdout: string, status: number | null, commandError?: Error) {
  if (commandError) throw new Error(`Dependency audit failed to start: ${commandError.message}`);
  if (status !== 0 && status !== 1) throw new Error(`Dependency audit exited with unexpected status: ${status}`);

  let report: unknown;
  try {
    report = JSON.parse(stdout);
  } catch {
    throw new Error("Dependency audit returned invalid JSON");
  }
  if (!report || typeof report !== "object" || !("advisories" in report)) {
    throw new Error("Dependency audit JSON is missing advisories");
  }
  const advisories = (report as { advisories: unknown }).advisories;
  if (!advisories || typeof advisories !== "object" || Array.isArray(advisories)) {
    throw new Error("Dependency audit advisories must be an object");
  }

  return Object.values(advisories).map((item) => {
    if (
      !item
      || typeof item !== "object"
      || typeof (item as RawAuditAdvisory).github_advisory_id !== "string"
      || typeof (item as RawAuditAdvisory).module_name !== "string"
      || typeof (item as RawAuditAdvisory).severity !== "string"
      || !Array.isArray((item as RawAuditAdvisory).findings)
    ) throw new Error("Dependency audit contains an invalid advisory");
    const advisory = item as RawAuditAdvisory;
    if (advisory.findings.some((finding) => (
      !finding
      || typeof finding.version !== "string"
      || !Array.isArray(finding.paths)
      || finding.paths.some((path) => typeof path !== "string")
    ))) throw new Error("Dependency audit contains invalid finding paths");
    return {
      githubAdvisoryId: advisory.github_advisory_id,
      moduleName: advisory.module_name,
      severity: advisory.severity,
      versions: [...new Set(advisory.findings.map((finding) => finding.version))],
      paths: [...new Set(advisory.findings.flatMap((finding) => finding.paths))],
    };
  });
}

export function evaluateDependencyAudit(findings: AuditFinding[], waivers: DependencyWaiver[], now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const blocked: AuditFinding[] = [];
  const waived: AuditFinding[] = [];

  for (const finding of findings) {
    if (finding.severity !== "high" && finding.severity !== "critical") continue;
    const waiver = waivers.find((item) =>
      item.advisoryId === finding.githubAdvisoryId
      && item.package === finding.moduleName
      && item.severity === finding.severity
      && finding.versions?.length
      && finding.versions.every((version) => version === item.affectedVersion)
      && finding.paths?.length
      && finding.paths.every((path) => item.allowedPathSuffixes.some((suffix) => path.endsWith(suffix)))
      && parseDateOnly(item.expiresAt) !== undefined
      && parseDateOnly(item.expiresAt)! >= today,
    );
    if (finding.severity === "critical" || !waiver) blocked.push(finding);
    else waived.push(finding);
  }

  return { blocked, waived };
}

function run() {
  const audit = spawnSync("pnpm", ["audit", "--registry=https://registry.npmjs.org", "--json"], {
    encoding: "utf8",
    env: process.env,
  });
  if (!audit.stdout.trim()) throw new Error(`Dependency audit returned no JSON: ${audit.stderr.trim()}`);

  const findings = parseAuditReport(audit.stdout, audit.status, audit.error);
  const waiverPath = fileURLToPath(new URL("../../docs/production/dependency-waivers.json", import.meta.url));
  const waivers = JSON.parse(readFileSync(waiverPath, "utf8")) as DependencyWaiver[];
  const result = evaluateDependencyAudit(findings, waivers);

  for (const finding of result.waived) {
    console.warn(`Dependency audit WAIVED: ${finding.githubAdvisoryId} (${finding.moduleName})`);
  }
  if (result.blocked.length > 0) {
    for (const finding of result.blocked) {
      console.error(`Dependency audit BLOCKED: ${finding.githubAdvisoryId} (${finding.moduleName}, ${finding.severity})`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Dependency audit: PASS (${result.waived.length} active time-bound waiver)`);
}

if (process.argv[1]?.endsWith("dependency-audit.ts")) run();
