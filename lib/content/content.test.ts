import { describe, expect, it, vi } from "vitest";
import { canonicalizeContentExport, createContentSnapshotManifest } from "./export";
import { applyKnowledgeBase } from "./database";
import { importContentSnapshot, planContentImport } from "./import";
import type { ContentExport } from "./types";
import { validateKnowledgeBase } from "./validation";

const fixture = (): ContentExport => ({
  schemaVersion: "1.0.0",
  entities: [
    { id: "b", type: "CONCEPT", slug: "yin-yang", title: "阴阳", aliases: [], summary: "", editorialStatus: "BASIC", updatedAt: "2026-08-30T00:00:00.000Z" },
    { id: "a", type: "CONCEPT", slug: "wuxing", title: "五行", aliases: ["五材"], summary: "", editorialStatus: "SOURCED", updatedAt: "2026-08-30T00:00:00.000Z" },
  ],
  relations: [{ id: "r1", sourceType: "CONCEPT", sourceId: "a", targetType: "CONCEPT", targetId: "b", relationType: "RELATED_TO", evidenceStatus: "DOCUMENTED" }],
  sources: [{ id: "s1", type: "PRIMARY_TEXT", title: "尚书" }],
  citations: [{ id: "c1", sourceId: "s1", subjectType: "CONCEPT", subjectId: "a", citationType: "DEFINITION", evidenceStatus: "DOCUMENTED" }],
  interpretations: [], witnesses: [], sections: [], passages: [], passageEntityLinks: [],
});

describe("content operations", () => {
  it("exports in a stable semantic order and stable checksum", () => {
    const first = canonicalizeContentExport(fixture());
    const second = canonicalizeContentExport({ ...fixture(), entities: [...fixture().entities].reverse() });
    expect(first).toEqual(second);
    expect(first.entities.map((entity) => entity.id)).toEqual(["a", "b"]);
    expect(createContentSnapshotManifest(first, "2026-08-30T12:00:00.000Z").checksum).toBe(createContentSnapshotManifest(second, "2027-01-01T00:00:00.000Z").checksum);
  });

  it("detects integrity errors and non-blocking content gaps", () => {
    const invalid: ContentExport = { ...fixture(), relations: [{ ...fixture().relations[0], targetId: "missing" }], citations: [], };
    const report = validateKnowledgeBase(invalid);
    expect(report.status).toBe("FAIL");
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: "DANGLING_RELATION", severity: "ERROR" }), expect.objectContaining({ code: "SOURCED_WITHOUT_CITATION", severity: "WARNING" })]));
  });

  it("plans dry-runs without writes and rolls back a failed transaction", async () => {
    const current = fixture();
    const incoming: ContentExport = { ...fixture(), entities: [...fixture().entities, { id: "p1", type: "PERSON", slug: "wang-bi", title: "王弼", aliases: [], summary: "", editorialStatus: "DRAFT", updatedAt: "2026-08-30T00:00:00.000Z" }] };
    const plan = planContentImport(current, incoming);
    expect(plan.summary.entities).toEqual({ create: 1, update: 0, unchanged: 2 });
    const transaction = vi.fn(async (run: () => Promise<void>) => run());
    const apply = vi.fn().mockRejectedValue(new Error("write failed"));
    await expect(importContentSnapshot(incoming, { dryRun: true, loadCurrent: async () => current, transaction, apply })).resolves.toMatchObject({ applied: false });
    expect(transaction).not.toHaveBeenCalled();
    await expect(importContentSnapshot(incoming, { dryRun: false, loadCurrent: async () => current, transaction, apply })).rejects.toThrow("write failed");
    expect(transaction).toHaveBeenCalledOnce();
  });
  it("detects semantic changes inside nested entity fields", () => {
    const current = fixture();
    current.entities[0] = { ...current.entities[0], fields: { nested: { note: "old" } } };
    const incoming = fixture();
    incoming.entities[0] = { ...incoming.entities[0], fields: { nested: { note: "new" } } };
    expect(planContentImport(current, incoming).summary.entities.update).toBe(1);
  });
  it("imports Dynasty records before entities that may reference them", async () => {
    const order: string[]=[];
    const upsert=(type:string)=>async({create}:{create:{id:string}})=>{order.push(`${type}:${create.id}`)};
    const db={dynasty:{upsert:upsert("dynasty")},concept:{upsert:upsert("concept")}};
    const content:ContentExport={...fixture(),entities:[{id:"concept",type:"CONCEPT",slug:"concept",title:"概念",aliases:[],summary:"",editorialStatus:"DRAFT",fields:{dynastyId:"dynasty"}},{id:"dynasty",type:"DYNASTY",slug:"dynasty",title:"时代",aliases:[],summary:"",editorialStatus:"BASIC"}],relations:[],sources:[],citations:[],interpretations:[],witnesses:[],sections:[],passages:[],passageEntityLinks:[]};
    await applyKnowledgeBase(db as never,content);
    expect(order).toEqual(["dynasty:dynasty","concept:concept"]);
  });
});
