import { describe, expect, it } from "vitest";
import { diffEditorialText } from "./diff";
import { isEditorialStudioEnabled } from "./gate";
import { citationInputSchema, conceptInputSchema, passageInputSchema, personInputSchema, relationInputSchema, sectionInputSchema } from "./schemas";
import { assertRevision, changedFields } from "./service";

describe("editorial action boundaries", () => {
  it("uses the explicit feature gate in every environment", () => {
    expect(isEditorialStudioEnabled({ NODE_ENV: "production", ENABLE_EDITORIAL_STUDIO: "true" })).toBe(true);
    expect(isEditorialStudioEnabled({ NODE_ENV: "production", ENABLE_EDITORIAL_STUDIO: "false" })).toBe(false);
    expect(isEditorialStudioEnabled({ NODE_ENV: "development", ENABLE_EDITORIAL_STUDIO: "true" })).toBe(true);
  });
  it("validates structured concepts and safe slugs", () => {
    expect(conceptInputSchema.safeParse({ name: "太极", slug: "taiji", summary: "概念摘要", aliases: [], categories: [] }).success).toBe(true);
    expect(conceptInputSchema.safeParse({ name: "太极", slug: "太极", summary: "概念摘要" }).success).toBe(false);
  });
  it("allows unknown years and rejects inverted known lifetimes", () => {
    expect(personInputSchema.safeParse({ name: "佚名", slug: "anonymous", summary: "资料待补", aliases: [], categories: [] }).success).toBe(true);
    expect(personInputSchema.safeParse({ name: "测试", slug: "test-person", summary: "测试", aliases: [], categories: [], birthYear: 100, deathYear: 99 }).success).toBe(false);
  });
  it("rejects self relations", () => {
    expect(relationInputSchema.safeParse({ sourceType: "CONCEPT", sourceId: "x", targetType: "CONCEPT", targetId: "x", relationType: "RELATED_TO" }).success).toBe(false);
  });
  it("requires positive section and passage ordinals and accepts citation revisions", () => {
    expect(sectionInputSchema.safeParse({ witnessId: "w", slug: "chapter", title: "章", ordinal: 0, sectionType: "CHAPTER" }).success).toBe(false);
    expect(passageInputSchema.safeParse({ sectionId: "s", ordinal: 0, text: "原文" }).success).toBe(false);
    expect(citationInputSchema.safeParse({ sourceId: "s", subjectType: "CONCEPT", subjectId: "c", citationType: "GENERAL", expectedUpdatedAt: "2026-08-30T00:00:00Z" }).success).toBe(true);
  });
  it("creates a reviewable line diff", () => {
    expect(diffEditorialText("天地\n玄黄", "天地\n玄象")).toEqual([
      { kind: "unchanged", text: "天地" },
      { kind: "removed", text: "玄黄" },
      { kind: "added", text: "玄象" },
    ]);
  });
  it("detects optimistic concurrency conflicts", async () => {
    await expect(assertRevision({ updatedAt: new Date("2026-01-02T00:00:00Z") }, new Date("2026-01-01T00:00:00Z"))).rejects.toMatchObject({ code: "EDITORIAL_CONFLICT" });
    await expect(assertRevision({ updatedAt: new Date("2026-01-02T00:00:00Z") }, new Date("2026-01-02T00:00:00Z"))).resolves.toBeUndefined();
  });
  it("stores only changed field names in audit summaries", () => {
    expect(changedFields({ name: "太极", summary: "旧" }, { name: "太极", summary: "新" })).toEqual(["summary"]);
  });
});
