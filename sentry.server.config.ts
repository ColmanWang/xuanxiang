import * as Sentry from "@sentry/nextjs";
import { sanitizeEvent } from "@/lib/observability/redaction";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEPLOYMENT_ENV || process.env.NODE_ENV,
    release: process.env.DEPLOYMENT_COMMIT_SHA || process.env.COMMIT_SHA || process.env.APP_VERSION,
    sendDefaultPii: false,
    beforeSend: (event) => sanitizeEvent(event),
  });
}
