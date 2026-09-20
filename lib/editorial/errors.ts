export enum EditorialErrorCode {
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  RELATION_INTEGRITY_ERROR = "RELATION_INTEGRITY_ERROR",
  CITATION_INTEGRITY_ERROR = "CITATION_INTEGRITY_ERROR",
  DEPENDENCY_CONFLICT = "DEPENDENCY_CONFLICT",
  EDITORIAL_CONFLICT = "EDITORIAL_CONFLICT",
  STUDIO_DISABLED = "STUDIO_DISABLED",
  UNAUTHORIZED = "UNAUTHORIZED",
  AUTHENTICATION_REQUIRED = "AUTHENTICATION_REQUIRED",
  FORBIDDEN = "FORBIDDEN",
  SOURCE_TEXT_CONFIRMATION_REQUIRED = "SOURCE_TEXT_CONFIRMATION_REQUIRED",
}

export class EditorialError extends Error {
  constructor(
    public readonly code: EditorialErrorCode,
    message: string,
    public readonly field?: string,
    public readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "EditorialError";
  }
}
