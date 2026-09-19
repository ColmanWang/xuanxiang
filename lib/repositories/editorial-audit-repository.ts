import type {
  EditorialAuditAction,
  EditorialObjectType,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

type EditorialDatabase = PrismaClient | Prisma.TransactionClient;

export interface EditorialAuditInput {
  entityType: EditorialObjectType;
  entityId: string;
  action: EditorialAuditAction;
  actor?: string | null;
  changeSummary: Readonly<Record<string, unknown>>;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
}

function normalizeJson(value: unknown): Prisma.InputJsonValue {
  // Prisma rejects an ambiguous top-level null, while JSON snapshots may
  // legitimately contain nested null values. Audit inputs are always objects.
  if (value === null) return null as unknown as Prisma.InputJsonValue;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, normalizeJson(item)]),
    );
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return String(value);
}

function snapshot(value: unknown): Prisma.InputJsonValue | undefined {
  return value === undefined ? undefined : normalizeJson(value);
}

export function createEditorialAuditRepository(database: EditorialDatabase = prisma) {
  return {
    append(input: EditorialAuditInput) {
      return database.editorialAuditLog.create({
        data: {
          entityType: input.entityType,
          entityId: input.entityId,
          action: input.action,
          actor: input.actor === undefined ? "LOCAL_EDITOR" : input.actor,
          changeSummary: normalizeJson(input.changeSummary),
          beforeSnapshot: snapshot(input.beforeSnapshot),
          afterSnapshot: snapshot(input.afterSnapshot),
        },
      });
    },

    listForEntity(entityType: EditorialObjectType, entityId: string, limit = 50) {
      return database.editorialAuditLog.findMany({
        where: { entityType, entityId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: Math.min(Math.max(limit, 1), 200),
      });
    },
  };
}

export const editorialAuditRepository = createEditorialAuditRepository();
