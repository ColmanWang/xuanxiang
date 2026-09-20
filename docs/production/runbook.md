# Production runbook

Start every incident by recording time, environment, commit, migration head, index version, symptoms, and incident commander. Preserve evidence; redact secrets and personal data.

## AI provider down

Disable the public AI feature flag, verify Core health and deterministic tools, check provider status/latency without logging prompts or keys, and re-enable only after real-provider smoke and grounding checks pass. Core launch remains independent.

## Database connections high or database down

Check application and database connection metrics, slow queries, deployment changes, and pool limits. Stop nonessential index/import jobs and Studio writes. Do not retry without bounds. Health must fail and pages must show temporary unavailability. Escalate before scaling or terminating sessions.

## Migration failed

Stop the rollout. Preserve Prisma and database logs, verify backup, inspect `prisma migrate status`, and compare the exact migration checksum. Do not reset or edit the applied SQL. Test a forward fix on a clone; require database-owner review before production.

## Content validation fails or RAG is stale

Freeze publishing. Keep the last accepted content/index active. Fix content through reviewed Studio workflow, rerun validation/export, rebuild from published data only, record checksum/manifest, run AI regression, then atomically activate. Never index Draft or archived content.

## Studio login failure

Keep public Core online. Verify environment identity, OAuth callback/domain, session store, cookie/security settings, clock, and rate-limit events. Do not bypass auth or issue shared accounts.

## Unexpected Bazi or Liuyao regression

Disable the affected tool or roll back the application artifact if compatible with the current schema. Preserve the failing fixture/trace/fingerprint. Foundation Freeze applies: no emergency rule change without fixtures, provenance, review, and full regression.

## Rollback

Application rollback means deploying the previous verified immutable artifact, then health/smoke. Database rollback is normally a forward fix; destructive migrations follow expand/migrate/contract. Restore is a disaster-recovery action, not a routine migration undo.
