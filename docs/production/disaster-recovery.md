# Disaster recovery

## Objectives and authority

Owner decision recorded on 2026-10-12: the project owner assumes incident command, infrastructure, database, communications, and daily operational responsibility. Approved objectives are RPO 48 hours and RTO 4 hours. Snapshot freshness met the 48-hour objective at documented checkpoints; prepared-target recovery took 49.497 seconds. Neither is a guarantee of sustained RPO or full incident RTO. The owner accepted scoped Phase 11.2 closure with these limitations; full incident-RTO follow-up remains due 2026-11-11.

The owner explicitly accepted a single-operator exception to independent two-person database review. The owner may review and authorize execution, but this must not be described as independent dual review. Before any Production database restore or connection switch, validate the restore in an isolated database, preserve the backup and rollback plan, and obtain a separate explicit execution approval from the owner. Approval of this exception does not authorize an actual restore, failover, or switch. Scope: owner-operated Production recovery while independent staffing is unavailable. Review this exception before each recovery and before expanding operational ownership; it expires for any operation whose preflight or explicit approval is missing.

## Recovery sequence

Owner scope sign-off — 2026-10-12: the latest #16 prepared-target download-to-production-mode-local-smoke exercise passed in 49.497 seconds and was explicitly accepted. Full incident RTO, including discovery, resource provisioning, public deployment/connection switch and traffic recovery, remains unverified with follow-up due 2026-11-11. This acceptance is not authorization to execute a Production switch and does not waive final security review.

1. Declare the incident, preserve logs, identify the last known good commit/migration/index, and stop Studio writes if integrity is uncertain.
2. Keep the public read-only surface available only if it is safe; otherwise use maintenance mode with a clear temporary-unavailability response.
3. For an application fault, redeploy the last verified immutable artifact. Do not roll back a schema blindly.
4. For database loss/corruption, restore the selected encrypted backup into an isolated database, validate it, then switch the application connection under independent two-person review or the explicitly approved single-operator exception above.
5. For a bad migration, prefer a reviewed forward fix or expand/migrate/contract recovery. Never use `migrate reset` on production.
6. Rebuild RAG only from published production content, record its manifest/checksum, and enable AI only after compatibility and grounding regression pass.
7. Run health, fixed Bazi/Liuyao fixtures, public browse/search/classic checks, and (if enabled) grounded AI smoke.
8. Monitor, communicate recovery, retain a timeline, and complete a blameless review with corrective actions.

Provider outage modes are independent: AI outage disables AI without blocking Core; Redis outage fails rate-limited endpoints safely; database outage returns explicit unavailable/failed health rather than infinite loading.
