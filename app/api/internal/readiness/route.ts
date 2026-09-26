import { validateProductionEnv } from "@/lib/config/env";
import { reportOperationalSignal } from "@/lib/observability/signals";
import { prisma } from "@/lib/prisma";
import { RagStatusRepository } from "@/lib/repositories/rag-status-repository";
import { requestId, withTimeout } from "@/lib/security/request";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const expected = process.env.INTERNAL_HEALTH_TOKEN;
  if (process.env.NODE_ENV === "production" && (!expected || request.headers.get("authorization") !== `Bearer ${expected}`)) return new Response(null, { status: 404 });
  const configuration = process.env.NODE_ENV === "production"
    ? validateProductionEnv(process.env, { throwOnError: false })
    : { success: true as const };
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, Number(process.env.DB_HEALTH_TIMEOUT_MS || 2_000));
    const rag = await withTimeout(new RagStatusRepository(prisma).counts(), Number(process.env.DB_HEALTH_TIMEOUT_MS || 2_000));
    const ready = !("success" in configuration) || configuration.success;
    return Response.json({ ready, database: "ok", configuration: ready ? "ok" : "invalid", rag: { state: rag.manifest?.state ?? "MISSING", indexVersion: rag.manifest?.indexVersion ?? null, documentCount: rag.documents, embeddingCount: rag.embeddings }, build: { version: process.env.APP_VERSION || "unknown", commit: process.env.DEPLOYMENT_COMMIT_SHA || process.env.COMMIT_SHA || null } }, { status: ready ? 200 : 503, headers: { "cache-control": "no-store" } });
  } catch {
    reportOperationalSignal("database_failure", { route: "/api/internal/readiness", requestId: requestId(request), errorCode: "DATABASE_UNAVAILABLE", status: 503 });
    return Response.json({ ready: false, database: "unavailable", configuration: "success" in configuration && !configuration.success ? "invalid" : "ok" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
