import "server-only";
import { notFound, redirect } from "next/navigation";
import { getStudioPrincipal } from "@/lib/auth/session";
import { isStudioEnabled } from "@/lib/editorial/gate";

export async function requireEditorialStudio() {
  if (!isStudioEnabled()) notFound();
  return getStudioPrincipal();
}

export async function requireStudioPageAccess() {
  const principal = await requireEditorialStudio();
  if (!principal) redirect("/studio/login");
  return principal;
}
