import { NextResponse, type NextRequest } from "next/server";
import { maintenanceModeEnabled } from "@/lib/config/features";

function csp(nonce: string): string {
  const developmentEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${developmentEval}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = csp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", policy);
  const alwaysAvailable = request.nextUrl.pathname === "/api/health" || request.nextUrl.pathname === "/api/internal/readiness";
  if (maintenanceModeEnabled() && !alwaysAvailable) {
    return Response.json({ error: { code: "MAINTENANCE", message: "系统维护中，请稍后重试。", requestId } }, { status: 503, headers: { "retry-after": "300", "x-request-id": requestId, "content-security-policy": policy } });
  }
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId);
  response.headers.set("content-security-policy", policy);
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
