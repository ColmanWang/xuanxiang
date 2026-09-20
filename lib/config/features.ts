export function envFlag(value: string | undefined, fallback = false): boolean {
  if (value === undefined || value === "") return fallback;
  return value === "true";
}

export function publicAiEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return envFlag(env.PUBLIC_AI_ENABLED);
}

export function maintenanceModeEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return envFlag(env.MAINTENANCE_MODE);
}
