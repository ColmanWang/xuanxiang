import type { RagDocument } from "../types";

const FIXTURES = new Set(["DEVELOPMENT_FIXTURE", "REGRESSION_FIXTURE", "SAMPLE_CONTENT"]);
export function isRagDocumentIncluded(document: RagDocument): boolean {
  return document.publicationStatus === "PUBLISHED" && !FIXTURES.has(document.sourceType) && document.editorialStatus !== "DRAFT" && document.editorialStatus !== "ARCHIVED";
}
