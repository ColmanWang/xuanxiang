import { describe, expect, it } from "vitest";
import { createIndexPlan } from "./plan";
import { buildIndexableDocuments } from "./source-documents";
import type { ContentExport } from "@/lib/content/types";

const empty: ContentExport = {
  schemaVersion: "test", entities: [], relations: [], sources: [], citations: [], interpretations: [],
  witnesses: [], sections: [], passages: [], passageEntityLinks: [],
};

describe("RAG inclusion policy", () => {
  it("only includes published production entities at BASIC or higher", () => {
    const content: ContentExport = { ...empty, entities: [
      { id: "ok", type: "CONCEPT", slug: "ok", title: "可检索", aliases: [], summary: "公开内容", editorialStatus: "BASIC", dataCategory: "PRODUCTION_CONTENT", publicationStatus: "PUBLISHED" },
      { id: "draft", type: "CONCEPT", slug: "draft", title: "草稿", aliases: [], summary: "草稿", editorialStatus: "DRAFT", dataCategory: "PRODUCTION_CONTENT", publicationStatus: "PUBLISHED" },
      { id: "fixture", type: "PERSON", slug: "fixture", title: "样例", aliases: [], summary: "样例", editorialStatus: "REVIEWED", dataCategory: "DEVELOPMENT_FIXTURE", publicationStatus: "PUBLISHED" },
      { id: "archived", type: "SCHOOL", slug: "archived", title: "归档", aliases: [], summary: "归档", editorialStatus: "SOURCED", dataCategory: "PRODUCTION_CONTENT", publicationStatus: "ARCHIVED" },
    ] };
    expect(buildIndexableDocuments(content).map((document) => document.entityId)).toEqual(["ok"]);
  });

  it("keeps a passage as a natural chunk with provenance", () => {
    const content: ContentExport = { ...empty,
      entities: [{ id: "classic", type: "CLASSIC", slug: "classic", title: "周易", aliases: [], summary: "经典", editorialStatus: "REVIEWED", dataCategory: "PRODUCTION_CONTENT", publicationStatus: "PUBLISHED" }],
      sources: [{ id: "source", type: "PRIMARY_TEXT", title: "底本", dataCategory: "PRODUCTION_CONTENT" }],
      witnesses: [{ id: "witness", classicId: "classic", sourceId: "source", title: "通行本", editionType: "BLOCK_PRINT", isPrimary: true, editorialStatus: "BASIC", dataCategory: "PRODUCTION_CONTENT" }],
      sections: [{ id: "section", witnessId: "witness", slug: "one", title: "第一章", ordinal: 1, sectionType: "CHAPTER", depth: 0, dataCategory: "PRODUCTION_CONTENT" }],
      passages: [{ id: "passage", sectionId: "section", ordinal: 1, text: "天行健。", contentType: "SOURCE_TEXT", editorialStatus: "BASIC", dataCategory: "PRODUCTION_CONTENT" }],
      citations: [{ id: "citation", sourceId: "source", subjectType: "CLASSIC", subjectId: "classic", citationType: "GENERAL", evidenceStatus: "DOCUMENTED", dataCategory: "PRODUCTION_CONTENT", passageId: "passage" }],
    };
    expect(buildIndexableDocuments(content)).toContainEqual(expect.objectContaining({ documentId: "passage:passage", text: "天行健。", passageId: "passage", classicId: "classic", citationIds: ["citation"] }));
  });
});

describe("incremental index plan", () => {
  const wanted = [{ documentId: "same", contentHash: "h1" }, { documentId: "changed", contentHash: "h2" }, { documentId: "new", contentHash: "h3" }];
  const existing = [{ documentId: "same", contentHash: "h1", provider: "p", model: "m" }, { documentId: "changed", contentHash: "old", provider: "p", model: "m" }, { documentId: "removed", contentHash: "old", provider: "p", model: "m" }];

  it("does not re-embed unchanged text for the same model and removes stale documents", () => {
    expect(createIndexPlan(wanted, existing, { provider: "p", model: "m", full: false })).toEqual({ create: ["new"], update: ["changed"], unchanged: ["same"], remove: ["removed"] });
  });

  it("re-embeds all documents when the embedding model changes", () => {
    expect(createIndexPlan(wanted, existing, { provider: "p", model: "m2", full: false })).toEqual({ create: ["new"], update: ["changed", "same"], unchanged: [], remove: ["removed"] });
  });
});
