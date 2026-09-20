import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type Manifest = { algorithm: "sha256"; files: Record<string, string> };

export async function verifyMigrationIntegrity(root = process.cwd()) {
  const migrationsDirectory = path.join(root, "prisma", "migrations");
  const manifest = JSON.parse(await readFile(path.join(migrationsDirectory, "checksums.json"), "utf8")) as Manifest;
  if (manifest.algorithm !== "sha256") throw new Error(`Unsupported checksum algorithm: ${manifest.algorithm}`);

  const directories = (await readdir(migrationsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const actualFiles = directories.map((directory) => `${directory}/migration.sql`);
  const expectedFiles = Object.keys(manifest.files).sort();
  const errors: string[] = [];

  for (const missing of expectedFiles.filter((file) => !actualFiles.includes(file))) errors.push(`missing migration: ${missing}`);
  for (const untracked of actualFiles.filter((file) => !expectedFiles.includes(file))) errors.push(`untracked migration: ${untracked}`);
  for (const file of actualFiles.filter((candidate) => expectedFiles.includes(candidate))) {
    const content = await readFile(path.join(migrationsDirectory, file));
    const checksum = createHash("sha256").update(content).digest("hex");
    if (checksum !== manifest.files[file]) errors.push(`checksum mismatch: ${file}`);
  }
  return { ok: errors.length === 0, checked: actualFiles.length, errors };
}

async function main() {
  const result = await verifyMigrationIntegrity();
  console.log(`Migration integrity: ${result.ok ? "PASS" : "FAIL"} (${result.checked} migrations checked)`);
  for (const error of result.errors) console.error(`- ${error}`);
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("check-migration-integrity.ts")) void main();
