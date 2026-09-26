import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";

export type OperationalSignal = "rate_limit" | "database_failure" | "ai_provider_failure";

type SignalFields = {
  route: string;
  requestId: string;
  errorCode: string;
  status: number;
};

export async function reportOperationalSignal(signal: OperationalSignal, fields: SignalFields): Promise<void> {
  const attributes = {
    signal,
    route: fields.route,
    error_code: fields.errorCode,
    status: String(fields.status),
  };
  const logFields = { signal, ...fields };

  try {
    Sentry.metrics.count("xuanxiang.operational.signal", 1, { attributes });
    if (fields.status >= 500) {
      Sentry.metrics.count("xuanxiang.http.5xx", 1, {
        attributes: { route: fields.route, status: String(fields.status) },
      });
    }
    if (signal !== "rate_limit") {
      Sentry.captureMessage(`Operational signal: ${signal}`, {
        level: "error",
        tags: attributes,
        extra: { requestId: fields.requestId },
      });
      await Sentry.flush(2_000);
    }
  } catch {
    // Telemetry must never change the API response path.
  }

  if (signal === "rate_limit") logger.warn(logFields, "operational.signal");
  else logger.error(logFields, "operational.signal");
}
