import { EditorialError, EditorialErrorCode } from "./errors";

export interface StudioEnvironment {
  NODE_ENV?: string;
  ENABLE_EDITORIAL_STUDIO?: string;
}

export function isStudioEnabled(environment: StudioEnvironment = process.env): boolean {
  return environment.ENABLE_EDITORIAL_STUDIO === "true";
}

export function assertStudioAccess(environment: StudioEnvironment = process.env): void {
  if (!isStudioEnabled(environment)) {
    throw new EditorialError(EditorialErrorCode.STUDIO_DISABLED, "玄象编辑台当前未启用");
  }
}
