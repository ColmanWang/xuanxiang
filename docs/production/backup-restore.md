# Backup and restore policy

Launch requires a managed PostgreSQL backup policy with daily automated backups, encrypted storage, restricted restore rights, and a documented retention value. Point-in-time recovery should be enabled when the selected provider supports it. The concrete provider, retention, RPO, and RTO are **BLOCKED** until infrastructure is selected.

Before every production migration, an operator records the latest successful backup and its age. A high-risk migration requires an immediate snapshot. A backup is not accepted merely because a job reported success: at least quarterly, restore it into a new isolated database, run `prisma migrate status`, content validation, row-count/sampling checks, health, Bazi/Liuyao fixed fixtures, and read-only smoke tests. Destroy the drill environment through the provider's audited process after evidence is retained.

Restore evidence records backup identifier, source and isolated destination, timestamps, operator/reviewer, application commit, migration head, RPO achieved, RTO achieved, validation results, and any data loss. Never restore over production as a drill.
