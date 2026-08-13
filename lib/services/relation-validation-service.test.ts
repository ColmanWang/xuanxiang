import { describe, expect, it, vi } from "vitest";
import { validateRelations } from "@/lib/services/relation-validation-service";

function reader(existing: Set<string>) {
  const model = { findUnique: vi.fn(async ({ where }: { where: { id: string }; select: { id: true } }) => existing.has(where.id) ? { id: where.id } : null) };
  return { concept:model, classic:model, person:model, school:model, technique:model, dynasty:model };
}
describe("relation integrity", () => {
  it("accepts existing endpoints", async () => { await expect(validateRelations(reader(new Set(["wuxing","yixue"])), [{ sourceType:"CONCEPT", sourceId:"wuxing", targetType:"SCHOOL", targetId:"yixue" }])).resolves.toBeUndefined(); });
  it("rejects a missing endpoint", async () => { await expect(validateRelations(reader(new Set(["wuxing"])), [{ sourceType:"CONCEPT", sourceId:"wuxing", targetType:"SCHOOL", targetId:"missing" }])).rejects.toThrow("Invalid relation endpoint"); });
});
