import * as Sentry from "@sentry/nextjs";
import { sanitizeEvent } from "@/lib/observability/redaction";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) Sentry.init({ dsn, sendDefaultPii: false, beforeSend: (event) => sanitizeEvent(event) });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
