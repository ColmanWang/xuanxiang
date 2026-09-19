import { createHash } from "node:crypto";
import type { ContentExport, ContentSnapshotManifest } from "./types";

function sortById<T extends { id: string }>(records: readonly T[]): T[] {
  return [...records].sort((left, right) => left.id.localeCompare(right.id, "en"));
}

export function canonicalizeContentExport(content: ContentExport): ContentExport {
  return {
    schemaVersion: content.schemaVersion,
    entities: [...content.entities].sort((a, b) => a.type.localeCompare(b.type, "en") || a.slug.localeCompare(b.slug, "zh-CN") || a.id.localeCompare(b.id, "en")),
    relations: sortById(content.relations), sources: sortById(content.sources), citations: sortById(content.citations),
    interpretations: sortById(content.interpretations), witnesses: sortById(content.witnesses),
    sections: [...content.sections].sort((a, b) => a.witnessId.localeCompare(b.witnessId, "en") || (a.parentId ?? "").localeCompare(b.parentId ?? "", "en") || a.ordinal - b.ordinal || a.id.localeCompare(b.id, "en")),
    passages: [...content.passages].sort((a, b) => a.sectionId.localeCompare(b.sectionId, "en") || a.ordinal - b.ordinal || a.id.localeCompare(b.id, "en")),
    passageEntityLinks: sortById(content.passageEntityLinks),
    ruleProvenance: content.ruleProvenance ? [...content.ruleProvenance].sort((a, b) => a.system.localeCompare(b.system, "en") || a.policyId.localeCompare(b.policyId, "en")) : undefined,
  };
}

function stableValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, item]) => [key, stableValue(item)]));
  return value;
}

export function serializeContentExport(content: ContentExport): string {
  return `${JSON.stringify(stableValue(canonicalizeContentExport(content)), null, 2)}\n`;
}

export function createContentSnapshotManifest(content: ContentExport, generatedAt = new Date().toISOString()): ContentSnapshotManifest {
  const canonical = canonicalizeContentExport(content);
  return {
    schemaVersion: canonical.schemaVersion,
    generatedAt,
    checksum: `sha256:${createHash("sha256").update(serializeContentExport(canonical)).digest("hex")}`,
    counts: {
      entities: canonical.entities.length, relations: canonical.relations.length, sources: canonical.sources.length,
      citations: canonical.citations.length, interpretations: canonical.interpretations.length,
      witnesses: canonical.witnesses.length, sections: canonical.sections.length, passages: canonical.passages.length,
      passageEntityLinks: canonical.passageEntityLinks.length,
    },
  };
}
