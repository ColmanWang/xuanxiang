import { describe, expect, it } from "vitest";
import { isEligibleProposalEvidence } from "./evidence-policy";

describe("AI proposal evidence boundary", () => {
  const manifest = { indexVersion: "v-current", provider: "embedding-provider", model: "embedding-model" };
  const document = { publicationStatus: "PUBLISHED", editorialStatus: "REVIEWED", sourceType: "PRODUCTION_CONTENT", indexVersion: "v-current", contentHash: "hash-1", embeddings: [{ provider: "embedding-provider", model: "embedding-model", contentHash: "hash-1" }] };

  it("accepts only published, reviewed-policy evidence from the current index", () => {
    expect(isEligibleProposalEvidence(document, manifest)).toBe(true);
    expect(isEligibleProposalEvidence({ ...document, publicationStatus: "DRAFT" }, manifest)).toBe(false);
    expect(isEligibleProposalEvidence({ ...document, editorialStatus: "DRAFT" }, manifest)).toBe(false);
    expect(isEligibleProposalEvidence({ ...document, sourceType: "DEVELOPMENT_FIXTURE" }, manifest)).toBe(false);
    expect(isEligibleProposalEvidence({ ...document, indexVersion: "v-stale" }, manifest)).toBe(false);
  });

  it("rejects missing or stale embeddings", () => {
    expect(isEligibleProposalEvidence({ ...document, embeddings: [] }, manifest)).toBe(false);
    expect(isEligibleProposalEvidence({ ...document, embeddings: [{ ...document.embeddings[0], contentHash: "old-hash" }] }, manifest)).toBe(false);
  });
});
