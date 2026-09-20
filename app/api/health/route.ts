import { prisma } from "@/lib/prisma";
import { BAZI_ENGINE_VERSION } from "@/lib/bazi/engine";
import { LIUYAO_ENGINE_VERSION } from "@/lib/liuyao/engine";
import { withTimeout } from "@/lib/security/request";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "ok" | "unavailable" = "unavailable";
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, Number(process.env.DB_HEALTH_TIMEOUT_MS || 2_000));
    database = "ok";
  } catch { /* health responses deliberately omit infrastructure details */ }
  return Response.json(
    { app: "xuanxiang", status: database === "ok" ? "ok" : "degraded", database, version: process.env.APP_VERSION || "unknown", engines: { bazi: BAZI_ENGINE_VERSION, liuyao: LIUYAO_ENGINE_VERSION } },
    { status: database === "ok" ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
}
