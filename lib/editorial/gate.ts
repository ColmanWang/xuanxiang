import { EditorialError, EditorialErrorCode } from "./errors";

export interface StudioEnvironment {
  NODE_ENV?: string;
  ENABLE_EDITORIAL_STUDIO?: string;
}

export function isStudioEnabled(environment: StudioEnvironment = process.env): boolean {
  // Phase 9 intentionally has no authentication system. Even an accidentally
  // configured production environment must therefore fail closed.
  return environment.NODE_ENV !== "production" && environment.ENABLE_EDITORIAL_STUDIO === "true";
}

export function assertStudioAccess(environment: StudioEnvironment = process.env): void {
  if (!isStudioEnabled(environment)) {
    throw new EditorialError(EditorialErrorCode.STUDIO_DISABLED, "玄象编辑台当前未启用");
  }
}
