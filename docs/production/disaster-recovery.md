# Disaster recovery

## Objectives and authority

Incident command, infrastructure owner, database owner, communications owner, approved RPO, and approved RTO must be assigned before launch. They are currently **BLOCKED**. Only the incident commander may authorize failover or restoration; database actions require a second reviewer.

## Recovery sequence

1. Declare the incident, preserve logs, identify the last known good commit/migration/index, and stop Studio writes if integrity is uncertain.
2. Keep the public read-only surface available only if it is safe; otherwise use maintenance mode with a clear temporary-unavailability response.
3. For an application fault, redeploy the last verified immutable artifact. Do not roll back a schema blindly.
4. For database loss/corruption, restore the selected encrypted backup into an isolated database, validate it, then switch the application connection under two-person review.
5. For a bad migration, prefer a reviewed forward fix or expand/migrate/contract recovery. Never use `migrate reset` on production.
6. Rebuild RAG only from published production content, record its manifest/checksum, and enable AI only after compatibility and grounding regression pass.
7. Run health, fixed Bazi/Liuyao fixtures, public browse/search/classic checks, and (if enabled) grounded AI smoke.
8. Monitor, communicate recovery, retain a timeline, and complete a blameless review with corrective actions.

Provider outage modes are independent: AI outage disables AI without blocking Core; Redis outage fails rate-limited endpoints safely; database outage returns explicit unavailable/failed health rather than infinite loading.
