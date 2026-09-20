export class RequestTooLargeError extends Error {
  constructor() { super("Request body exceeds the configured limit."); this.name = "RequestTooLargeError"; }
}

export class TimeoutError extends Error {
  constructor(readonly timeoutMs: number) { super("Operation timed out."); this.name = "TimeoutError"; }
}

export async function readJsonWithLimit(request: Request, maxBytes: number): Promise<unknown> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new RangeError("maxBytes must be a positive safe integer.");
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    await request.body?.cancel().catch(() => undefined);
    throw new RequestTooLargeError();
  }
  if (!request.body) return JSON.parse("");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RequestTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new TimeoutError(timeoutMs)), timeoutMs); });
  try { return await Promise.race([operation, timeout]); }
  finally { if (timer) clearTimeout(timer); }
}

export function requestId(request: Request): string {
  return request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
}

export type TrustedProxyPlatform = "none" | "vercel";

function trustedProxyPlatform(value = process.env.TRUSTED_PROXY_HEADERS): TrustedProxyPlatform {
  return value?.toLowerCase() === "vercel" ? "vercel" : "none";
}

function validIpv4(value: string): boolean {
  const ipv4 = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  return Boolean(ipv4?.slice(1).every((part) => Number(part) <= 255 && String(Number(part)) === part));
}

function validIpv6(value: string): boolean {
  if (!value.includes(":") || value.split("::").length > 2) return false;
  const compressed = value.includes("::");
  const groups = value.split("::").flatMap((part) => part ? part.split(":") : []);
  let units = 0;
  for (const [index, group] of groups.entries()) {
    if (group.includes(".")) {
      if (index !== groups.length - 1 || !validIpv4(group)) return false;
      units += 2;
    } else {
      if (!/^[0-9a-f]{1,4}$/i.test(group)) return false;
      units += 1;
    }
  }
  return compressed ? units < 8 : units === 8;
}

function validIp(value: string): boolean {
  return value.length <= 45 && (validIpv4(value) || validIpv6(value));
}

export function clientIdentity(request: Request, platform: TrustedProxyPlatform = trustedProxyPlatform()): string {
  if (platform !== "vercel") return "anonymous";
  const candidate = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return validIp(candidate) ? candidate.toLowerCase() : "anonymous";
}
