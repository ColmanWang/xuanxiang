import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { verifyMigrationIntegrity } from "./check-migration-integrity";

async function fixture(sql: string, checksum: string) {
  const root = await mkdtemp(path.join(tmpdir(), "xx-migration-"));
  const migrations = path.join(root, "prisma", "migrations");
  await mkdir(path.join(migrations, "001_initial"), { recursive: true });
  await writeFile(path.join(migrations, "001_initial", "migration.sql"), sql);
  await writeFile(path.join(migrations, "checksums.json"), JSON.stringify({ algorithm: "sha256", files: { "001_initial/migration.sql": checksum } }));
  return root;
}

describe("migration checksum gate", () => {
  it("accepts an unchanged migration", async () => {
    const root = await fixture("SELECT 1;\n", "b4e0497804e46e0a0b0b8c31975b062152d551bac49c3c2e80932567b4085dcd");
    expect(await verifyMigrationIntegrity(root)).toMatchObject({ ok: true, checked: 1 });
  });
  it("rejects edited and untracked migrations", async () => {
    const root = await fixture("SELECT 2;\n", "b4e0497804e46e0a0b0b8c31975b062152d551bac49c3c2e80932567b4085dcd");
    await mkdir(path.join(root, "prisma", "migrations", "002_new"));
    await writeFile(path.join(root, "prisma", "migrations", "002_new", "migration.sql"), "SELECT 3;\n");
    const result = await verifyMigrationIntegrity(root);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining("checksum mismatch"), expect.stringContaining("untracked migration")]));
  });
});
