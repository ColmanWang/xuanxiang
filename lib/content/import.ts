import { EditorialError, EditorialErrorCode } from "@/lib/editorial/errors";
import { canonicalizeContentExport } from "./export";
import type { ContentExport } from "./types";
import { CONTENT_SCHEMA_VERSION } from "./types";
import { validateKnowledgeBase } from "./validation";

type CollectionName = Exclude<keyof ContentExport, "schemaVersion" | "ruleProvenance">;
export interface ImportCount { create: number; update: number; unchanged: number; }
export interface ContentImportPlan { summary: Record<CollectionName, ImportCount>; validation: ReturnType<typeof validateKnowledgeBase>; }

function semanticRecord(value: unknown): string {
  const normalize = (input: unknown): unknown => {
    if (input instanceof Date) return input.toISOString();
    if (Array.isArray(input)) return input.map(normalize);
    if (!input || typeof input !== "object") return input;
    return Object.fromEntries(Object.entries(input as Record<string, unknown>)
      .filter(([key]) => key !== "updatedAt" && key !== "createdAt")
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, item]) => [key, normalize(item)]));
  };
  return JSON.stringify(normalize(value));
}

function compareCollections(current: readonly { id: string }[], incoming: readonly { id: string }[]): ImportCount {
  const currentById = new Map(current.map((record) => [record.id, semanticRecord(record)]));
  return incoming.reduce<ImportCount>((result, record) => {
    const existing = currentById.get(record.id);
    if (existing === undefined) return { ...result, create: result.create + 1 };
    if (existing === semanticRecord(record)) return { ...result, unchanged: result.unchanged + 1 };
    return { ...result, update: result.update + 1 };
  }, { create: 0, update: 0, unchanged: 0 });
}

export function planContentImport(current: ContentExport, incoming: ContentExport): ContentImportPlan {
  if (incoming.schemaVersion !== CONTENT_SCHEMA_VERSION) throw new EditorialError(EditorialErrorCode.VALIDATION_FAILED, `不支持的内容 Schema：${incoming.schemaVersion}`);
  const next = canonicalizeContentExport(incoming);
  return {
    validation: validateKnowledgeBase(next),
    summary: {
      entities: compareCollections(current.entities, next.entities), relations: compareCollections(current.relations, next.relations),
      sources: compareCollections(current.sources, next.sources), citations: compareCollections(current.citations, next.citations),
      interpretations: compareCollections(current.interpretations, next.interpretations), witnesses: compareCollections(current.witnesses, next.witnesses),
      sections: compareCollections(current.sections, next.sections), passages: compareCollections(current.passages, next.passages),
      passageEntityLinks: compareCollections(current.passageEntityLinks, next.passageEntityLinks),
    },
  };
}

export async function importContentSnapshot(content: ContentExport, operations: {
  dryRun: boolean;
  loadCurrent: () => Promise<ContentExport>;
  transaction: (run: () => Promise<void>) => Promise<void>;
  apply: (content: ContentExport) => Promise<void>;
}): Promise<{ applied: boolean; plan: ContentImportPlan }> {
  const current = await operations.loadCurrent();
  const plan = planContentImport(current, content);
  if (plan.validation.status === "FAIL") throw new EditorialError(EditorialErrorCode.VALIDATION_FAILED, "内容快照未通过完整性校验", undefined, { issues: plan.validation.issues });
  if (operations.dryRun) return { applied: false, plan };
  await operations.transaction(() => operations.apply(canonicalizeContentExport(content)));
  return { applied: true, plan };
}
