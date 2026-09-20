const acceptedEditorialStatuses = new Set(["BASIC", "SOURCED", "REVIEWED"]);
const excludedSourceTypes = new Set(["DEVELOPMENT_FIXTURE", "REGRESSION_FIXTURE", "SAMPLE_CONTENT"]);

export interface ProposalIndexManifest {
  indexVersion: string;
  provider: string;
  model: string;
}

export interface ProposalEvidenceDocument {
  publicationStatus: string;
  editorialStatus: string;
  sourceType: string;
  indexVersion: string;
  contentHash: string;
  embeddings: ReadonlyArray<{ provider: string; model: string; contentHash: string }>;
}

export function isEligibleProposalEvidence(document: ProposalEvidenceDocument, manifest: ProposalIndexManifest): boolean {
  return document.publicationStatus === "PUBLISHED"
    && acceptedEditorialStatuses.has(document.editorialStatus)
    && !excludedSourceTypes.has(document.sourceType)
    && document.indexVersion === manifest.indexVersion
    && document.embeddings.some((embedding) => embedding.provider === manifest.provider
      && embedding.model === manifest.model
      && embedding.contentHash === document.contentHash);
}
