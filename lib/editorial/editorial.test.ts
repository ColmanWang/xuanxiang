import { describe, expect, it, vi } from "vitest";
import { assertStudioAccess, isStudioEnabled } from "./gate";
import { adaptEditorialEntity } from "./entity-adapter";
import { EditorialError, EditorialErrorCode } from "./errors";
import { assertRevision, updateWithRevision } from "./concurrency";

describe("editorial foundation", () => {
  it("keeps Studio disabled in production without the explicit gate", () => {
    expect(isStudioEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(() => assertStudioAccess({ NODE_ENV: "production" })).toThrowError(EditorialError);
  });

  it("allows development and production only through the explicit gate", () => {
    expect(isStudioEnabled({ NODE_ENV: "development" })).toBe(false);
    expect(isStudioEnabled({ NODE_ENV: "development", ENABLE_EDITORIAL_STUDIO: "true" })).toBe(true);
    expect(isStudioEnabled({ NODE_ENV: "production", ENABLE_EDITORIAL_STUDIO: "true" })).toBe(true);
  });

  it("adapts domain records without duplicating their content", () => {
    const updatedAt = new Date("2026-08-30T10:00:00.000Z");
    expect(adaptEditorialEntity("CONCEPT", { id: "concept-wuxing", name: "五行", slug: "wuxing", aliases: ["五材"], summary: "摘要", editorialStatus: "SOURCED", updatedAt })).toMatchObject({
      id: "concept-wuxing", type: "CONCEPT", title: "五行", slug: "wuxing", aliases: ["五材"], editorialStatus: "SOURCED", revision: updatedAt.toISOString(),
    });
  });

  it("rejects stale optimistic-concurrency revisions", async () => {
    expect(() => assertRevision("2026-08-30T10:00:00.000Z", new Date("2026-08-30T10:00:01.000Z"))).toThrowError(expect.objectContaining({ code: EditorialErrorCode.EDITORIAL_CONFLICT }));
    const update = vi.fn().mockResolvedValue({ id: "concept-wuxing" });
    await updateWithRevision({ expectedUpdatedAt: "2026-08-30T10:00:00.000Z", currentUpdatedAt: new Date("2026-08-30T10:00:00.000Z"), update });
    expect(update).toHaveBeenCalledOnce();
  });
});
