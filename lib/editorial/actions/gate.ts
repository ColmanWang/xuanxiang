import { isStudioEnabled } from "../gate";
import { getStudioPrincipal, type StudioPrincipal } from "@/lib/auth/session";
import { hasStudioPermission, type StudioPermission } from "@/lib/auth/permissions";
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

export async function authorizeEditorialMutation(permission: StudioPermission): Promise<StudioPrincipal> {
  assertEditorialStudioEnabled();
  const principal = await getStudioPrincipal();
  if (!principal) throw new EditorialActionError("AUTHENTICATION_REQUIRED", "请先登录有效的 Studio 账号。");
  if (!hasStudioPermission(principal.role, permission)) {
    throw new EditorialActionError("FORBIDDEN", "当前 Studio 角色无权执行该操作。", undefined, { permission });
  }
  return principal;
}
