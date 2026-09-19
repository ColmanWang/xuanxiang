export type StudioEntityType = "concept" | "person" | "school" | "classic" | "technique";

export interface StudioStat {
  label: string;
  value: number;
  href: string;
}

export interface StudioEntryRow {
  id: string;
  type: StudioEntityType;
  title: string;
  slug: string;
  summary: string;
  editorialStatus: "DRAFT" | "BASIC" | "SOURCED" | "REVIEWED";
  publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
}

export interface StudioEntryDetail extends StudioEntryRow {
  aliases: string[];
  categories: string[];
  period?: string;
  lastReviewedAt?: string;
  category?: string;
  coreQuestions?: string[];
  classificationStatus?: "DOCUMENTED" | "TRADITIONAL" | "INFERRED" | "CONTESTED";
  themes?: string[];
  attributionStatus?: "CERTAIN" | "TRADITIONAL" | "CONTESTED" | "ANONYMOUS" | "COMPOSITE" | "UNKNOWN";
}

export interface StudioGap {
  id: string;
  level: "WARNING" | "ERROR";
  label: string;
  detail: string;
  href: string;
}

export interface StudioValidationSummary {
  status: "PASS" | "PASS_WITH_WARNINGS" | "FAIL";
  checks: Array<{ id: string; label: string; status: "PASS" | "WARNING" | "ERROR"; detail: string }>;
}
