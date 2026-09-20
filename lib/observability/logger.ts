import pino from "pino";
import { sanitizeLogData } from "./redaction";

const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: { service: "xuanxiang", environment: process.env.NODE_ENV || "development" },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "request.body", "prompt", "message", "question", "birthInput", "input", "apiKey", "token", "password"],
    censor: "[REDACTED]",
  },
});

function safeFields(fields: unknown): object { return sanitizeLogData(fields) as object; }

export const logger = {
  info(fields: unknown, message?: string) { baseLogger.info(safeFields(fields), message); },
  warn(fields: unknown, message?: string) { baseLogger.warn(safeFields(fields), message); },
  error(fields: unknown, message?: string) { baseLogger.error(safeFields(fields), message); },
};

export function logRequest(fields: { requestId: string; route: string; status: number; duration: number; errorCode?: string }): void {
  logger.info(fields, "request.completed");
}
