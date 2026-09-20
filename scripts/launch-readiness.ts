import { readFile } from "node:fs/promises";
import { buildReadinessReport } from "./phase11/readiness";

function option(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const evidencePath = option("--evidence");
  const evidence = evidencePath ? JSON.parse(await readFile(evidencePath, "utf8")) : {};
  const report = buildReadinessReport(evidence);
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), ...report }, null, 2));
  if (report.launch === "BLOCKED") process.exitCode = 1;
}

void main().catch((error) => {
  console.error(`Launch readiness: BLOCKED (${error instanceof Error ? error.message : "unknown error"})`);
  process.exitCode = 1;
});
