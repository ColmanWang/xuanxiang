import { describe, expect, it, vi } from "vitest";
import { STUDIO_PERMISSIONS, type StudioPermission } from "@/lib/auth/permissions";
import type { StudioPrincipal } from "@/lib/auth/session";
import { createEditorialWriteService } from "./service";

const principal: StudioPrincipal = { userId: "user-1", email: "editor@example.com", name: "Editor", role: "ADMIN" };

describe("editorial mutation authorization", () => {
  it.each([
    ["saveConcept", STUDIO_PERMISSIONS.EDIT_DRAFT],
    ["saveRelation", STUDIO_PERMISSIONS.EDIT_DRAFT],
    ["saveSource", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION],
    ["saveCitation", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION],
    ["saveWitness", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION],
    ["saveSection", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION],
    ["savePassage", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION],
    ["markReviewed", STUDIO_PERMISSIONS.MARK_REVIEWED],
    ["archiveEntity", STUDIO_PERMISSIONS.ARCHIVE],
  ] as const)("checks %s before validating or writing", async (method, permission) => {
    const authorize = vi.fn(async (requested: StudioPermission) => {
      expect(requested).toBe(permission);
      throw new Error("STOP_AFTER_AUTHORIZATION");
    });
    const service = createEditorialWriteService({} as never, authorize);
    await expect((service[method] as (...args: never[]) => Promise<unknown>)()).rejects.toThrow("STOP_AFTER_AUTHORIZATION");
    expect(authorize).toHaveBeenCalledOnce();
  });

  it("uses publish permission only when publishing", async () => {
    const permissions: StudioPermission[] = [];
    const authorize = vi.fn(async (permission: StudioPermission) => { permissions.push(permission); return principal; });
    const db = { $transaction: vi.fn(async () => { throw new Error("STOP_BEFORE_WRITE"); }) };
    const service = createEditorialWriteService(db as never, authorize);
    await expect(service.setPublicationStatus("CONCEPT", "id", "PUBLISHED", new Date())).rejects.toThrow("STOP_BEFORE_WRITE");
    await expect(service.setPublicationStatus("CONCEPT", "id", "DRAFT", new Date())).rejects.toThrow("STOP_BEFORE_WRITE");
    expect(permissions).toEqual([STUDIO_PERMISSIONS.PUBLISH, STUDIO_PERMISSIONS.EDIT_DRAFT]);
  });

  it("records the authenticated actor id and role in the audit row", async () => {
    const auditCreate = vi.fn(async () => undefined);
    const tx = {
      concept: {
        findUnique: vi.fn(async () => null),
        create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...data, createdAt: new Date(), updatedAt: new Date() })),
      },
      editorialAuditLog: { create: auditCreate },
    };
    const db = { $transaction: vi.fn(async (work: (client: typeof tx) => Promise<unknown>) => work(tx)) };
    const service = createEditorialWriteService(db as never, async () => principal);
    await service.saveConcept({ name: "太极", slug: "taiji", summary: "摘要", aliases: [], categories: [] });
    expect(auditCreate).toHaveBeenCalledWith({ data: expect.objectContaining({
      actor: principal.email,
      actorId: principal.userId,
      actorRole: principal.role,
    }) });
  });

  it("rejects promotion to REVIEWED through an ordinary save", async () => {
    const tx = {
      concept: {
        findUnique: vi.fn(async () => ({ id: "concept-1", editorialStatus: "BASIC", publicationStatus: "DRAFT", updatedAt: new Date("2026-09-20T00:00:00Z") })),
        update: vi.fn(),
      },
      editorialAuditLog: { create: vi.fn() },
    };
    const db = { $transaction: vi.fn(async (work: (client: typeof tx) => Promise<unknown>) => work(tx)) };
    const service = createEditorialWriteService(db as never, async () => principal);
    await expect(service.saveConcept({ id: "concept-1", name: "太极", slug: "taiji", summary: "摘要", aliases: [], categories: [], editorialStatus: "REVIEWED", expectedUpdatedAt: new Date("2026-09-20T00:00:00Z") })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(tx.concept.update).not.toHaveBeenCalled();
  });

  it("requires publish permission before changing an already published entity", async () => {
    const editor = { ...principal, role: "EDITOR" as const };
    const authorize = vi.fn(async (permission: StudioPermission) => {
      if (permission === STUDIO_PERMISSIONS.PUBLISH) throw Object.assign(new Error("forbidden"), { code: "FORBIDDEN" });
      return editor;
    });
    const tx = {
      concept: {
        findUnique: vi.fn(async () => ({ id: "concept-1", editorialStatus: "BASIC", publicationStatus: "PUBLISHED", updatedAt: new Date("2026-09-20T00:00:00Z") })),
        update: vi.fn(),
      },
      editorialAuditLog: { create: vi.fn() },
    };
    const db = { $transaction: vi.fn(async (work: (client: typeof tx) => Promise<unknown>) => work(tx)) };
    const service = createEditorialWriteService(db as never, authorize);
    await expect(service.saveConcept({ id: "concept-1", name: "太极", slug: "taiji", summary: "新摘要", aliases: [], categories: [], editorialStatus: "BASIC", expectedUpdatedAt: new Date("2026-09-20T00:00:00Z") })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(authorize).toHaveBeenNthCalledWith(1, STUDIO_PERMISSIONS.EDIT_DRAFT);
    expect(authorize).toHaveBeenNthCalledWith(2, STUDIO_PERMISSIONS.PUBLISH);
    expect(tx.concept.update).not.toHaveBeenCalled();
  });
});
