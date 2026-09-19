import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createEditorialAuditRepository } from "./editorial-audit-repository";

const testEntityId = "phase9-editorial-audit-integration";

describe("editorial database foundation", () => {
  afterAll(async () => {
    await prisma.editorialAuditLog.deleteMany({ where: { entityId: testEntityId } });
  });

  it("preserves existing seeded entries as published production content", async () => {
    const concept = await prisma.concept.findUniqueOrThrow({ where: { slug: "wuxing" } });
    expect(concept).toMatchObject({
      dataCategory: "PRODUCTION_CONTENT",
      publicationStatus: "PUBLISHED",
    });
  });

  it("writes a compact audit record and reads it in reverse chronology", async () => {
    const repository = createEditorialAuditRepository(prisma);
    const created = await repository.append({
      entityType: "CONCEPT",
      entityId: testEntityId,
      action: "UPDATE",
      changeSummary: { fields: ["summary"], reason: "integration-test" },
      beforeSnapshot: { summary: "旧摘要", updatedAt: new Date("2026-08-30T00:00:00.000Z") },
      afterSnapshot: { summary: "新摘要" },
    });

    expect(created.beforeSnapshot).toEqual({ summary: "旧摘要", updatedAt: "2026-08-30T00:00:00.000Z" });
    const records = await repository.listForEntity("CONCEPT", testEntityId);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ id: created.id, actor: "LOCAL_EDITOR", action: "UPDATE" });
  });
});

