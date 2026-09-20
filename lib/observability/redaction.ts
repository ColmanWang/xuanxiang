const sensitiveKeys = /^(authorization|cookie|cookies|set-cookie|prompt|message|question|birthInput|input|source_text|sourceText|apiKey|token|password)$/i;

export function sanitizeLogData(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeLogData(item, seen));
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, sensitiveKeys.test(key) ? "[REDACTED]" : sanitizeLogData(item, seen)]));
}

export function sanitizeEvent<T extends { request?: { data?: unknown; cookies?: unknown; headers?: Record<string, unknown> } }>(event: T): T {
  if (!event.request) return event;
  const headers = event.request.headers ? sanitizeLogData(event.request.headers) as Record<string, unknown> : undefined;
  return { ...event, request: { ...(headers ? { headers } : {}) } };
}
