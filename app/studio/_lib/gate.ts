import "server-only";
import { notFound } from "next/navigation";
import { getStudioPrincipal } from "@/lib/auth/session";
import { isStudioEnabled } from "@/lib/editorial/gate";

export async function requireEditorialStudio() {
  if (!isStudioEnabled()) notFound();
  return getStudioPrincipal();
}
