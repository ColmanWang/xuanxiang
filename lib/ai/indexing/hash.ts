import { createHash } from "node:crypto";

export function contentHash(text: string): string {
  return `sha256:${createHash("sha256").update(text.normalize("NFC").trim()).digest("hex")}`;
}
