import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { evaluateDependencyAudit, parseAuditReport } from "./dependency-audit";

const activeWaiver = {
  advisoryId: "GHSA-ggr8-5vv4-36mx",
  package: "deepmerge-ts",
  severity: "high",
  affectedVersion: "7.1.5",
  allowedPathSuffixes: ["prisma>@prisma/config>deepmerge-ts"],
  expiresAt: "2026-10-31",
};

const approvedFinding = {
  githubAdvisoryId: activeWaiver.advisoryId,
  moduleName: activeWaiver.package,
  severity: "high",
  versions: ["7.1.5"],
  paths: [".>better-auth>prisma>@prisma/config>deepmerge-ts"],
};

describe("dependency audit waiver gate", () => {
  it("bounds the approved braces waiver to its exact dev path, version and expiry", () => {
    const waivers = JSON.parse(readFileSync("docs/production/dependency-waivers.json", "utf8"));
    const finding = { githubAdvisoryId: "GHSA-vfj7-8cjw-p6xm", moduleName: "braces", severity: "high", versions: ["3.0.3"], paths: [".>eslint-config-next>@next/eslint-plugin-next>fast-glob>micromatch>braces"] };
    expect(evaluateDependencyAudit([finding], waivers, new Date("2026-10-24T00:00:00Z")).blocked).toHaveLength(0);
    expect(evaluateDependencyAudit([finding], waivers, new Date("2026-10-25T00:00:00Z")).blocked).toHaveLength(1);
    for (const change of [{ paths: [".>runtime>braces"] }, { versions: ["3.0.2"] }, { severity: "critical" }]) {
      expect(evaluateDependencyAudit([{ ...finding, ...change }], waivers, new Date("2026-10-10T00:00:00Z")).blocked).toHaveLength(1);
    }
  });
  it("accepts the approved advisory before its expiry", () => {
    expect(evaluateDependencyAudit([
      approvedFinding,
    ], [activeWaiver], new Date("2026-09-25T00:00:00Z"))).toMatchObject({ blocked: [], waived: [expect.anything()] });
  });

  it("blocks an unapproved high advisory", () => {
    expect(evaluateDependencyAudit([
      { githubAdvisoryId: "GHSA-new", moduleName: "new-package", severity: "high" },
    ], [activeWaiver], new Date("2026-09-25T00:00:00Z")).blocked).toHaveLength(1);
  });

  it("blocks an expired waiver", () => {
    expect(evaluateDependencyAudit([
      approvedFinding,
    ], [activeWaiver], new Date("2026-11-01T00:00:00Z")).blocked).toHaveLength(1);
  });

  it.each(["never", "2026-13-99", "2026-02-30"])("blocks an invalid waiver expiry: %s", (expiresAt) => {
    expect(evaluateDependencyAudit([
      approvedFinding,
    ], [{ ...activeWaiver, expiresAt }], new Date("2026-09-25T00:00:00Z")).blocked).toHaveLength(1);
  });

  it("never waives a critical advisory", () => {
    expect(evaluateDependencyAudit([
      { ...approvedFinding, severity: "critical" },
    ], [activeWaiver], new Date("2026-09-25T00:00:00Z")).blocked).toHaveLength(1);
  });

  it("blocks the approved advisory when it reaches an unapproved dependency path", () => {
    expect(evaluateDependencyAudit([
      { ...approvedFinding, paths: [".>runtime-package>deepmerge-ts"] },
    ], [activeWaiver], new Date("2026-09-25T00:00:00Z")).blocked).toHaveLength(1);
  });

  it("blocks the approved advisory when the affected version changes", () => {
    expect(evaluateDependencyAudit([
      { ...approvedFinding, versions: ["7.2.0"] },
    ], [activeWaiver], new Date("2026-09-25T00:00:00Z")).blocked).toHaveLength(1);
  });
});

describe("dependency audit report parsing", () => {
  it("accepts the vulnerability exit status and returns validated findings", () => {
    expect(parseAuditReport(JSON.stringify({
      advisories: {
        "1": {
          github_advisory_id: "GHSA-example",
          module_name: "example",
          severity: "high",
          findings: [{ version: "1.2.3", paths: [".>example"] }],
        },
      },
    }), 1)).toEqual([
      {
        githubAdvisoryId: "GHSA-example",
        moduleName: "example",
        severity: "high",
        versions: ["1.2.3"],
        paths: [".>example"],
      },
    ]);
  });

  it.each([
    ["missing advisories", JSON.stringify({ metadata: {} }), 0],
    ["invalid advisories", JSON.stringify({ advisories: [] }), 0],
    ["unexpected command status", JSON.stringify({ advisories: {} }), 2],
    ["invalid JSON", "not json", 0],
  ])("fails closed for %s", (_label, stdout, status) => {
    expect(() => parseAuditReport(stdout, status)).toThrow();
  });
});
