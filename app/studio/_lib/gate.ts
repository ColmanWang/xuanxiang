import "server-only";
import { notFound } from "next/navigation";
import { isStudioEnabled } from "@/lib/editorial/gate";

export function requireEditorialStudio() {
  if (!isStudioEnabled()) notFound();
}
