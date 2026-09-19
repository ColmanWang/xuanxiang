import { isStudioEnabled } from "../gate";
import { EditorialActionError } from "./errors";

/** Studio writes are intentionally unavailable in production until authentication exists. */
export function isEditorialStudioEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return isStudioEnabled(env);
}

export function assertEditorialStudioEnabled(env: NodeJS.ProcessEnv = process.env): void {
  if (!isEditorialStudioEnabled(env)) {
    throw new EditorialActionError("STUDIO_DISABLED", "玄象编辑台当前未启用。");
  }
}
