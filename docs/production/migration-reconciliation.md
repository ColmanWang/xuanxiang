# Migration reconciliation and release gate

## Current finding

Staging reconciliation is **RESOLVED** as of 2026-09-25. A fresh, isolated Neon Staging database received all six repository migrations through `prisma migrate deploy` over its direct connection. `prisma migrate status` then reported the schema up to date, pgvector 0.8.6 was present, and all six `_prisma_migrations.checksum` values matched `prisma/migrations/checksums.json`. No migration was failed or rolled back, and no database reset or `migrate resolve` was used.

Production reconciliation is **RESOLVED** as of 2026-10-02 for the initial empty-database bootstrap. Independent pooled runtime and direct migration connections were verified before deployment, pgvector 0.8.6 was present, and the `public` schema contained no application tables. Production then received all six repository migrations through `prisma migrate deploy` over the direct connection. The follow-up `prisma migrate status` reported the schema up to date; all six rows were finished without rollback or failure, and all six database checksums matched `prisma/migrations/checksums.json`. During this migration reconciliation step, no reset, resolve, seed, or content import was run; the frozen content snapshot was imported later as a separate Production Launch Closure step.

The earlier Phase 9 report is classified as **historical local drift**: it was not reproduced on the fresh Staging candidate and there is still no historical development-database export from which to identify the old differing row. Any future production candidate must repeat this comparison before deploy; the Staging result is evidence for this candidate, not permission to assume another database is clean.

The repository baseline is `prisma/migrations/checksums.json`. `scripts/phase11/check-migration-integrity.ts` fails when a recorded migration changes, disappears, or when a new migration is not recorded. After a migration is applied anywhere shared, it is immutable; all later schema changes require a new migration.

## Non-destructive reconciliation procedure

1. Take and verify a fresh backup/snapshot of the candidate database.
2. Run `prisma migrate status` with the candidate's direct connection URL and export `_prisma_migrations` names, checksums, timestamps, and failure logs. Do not export application rows.
3. Hash the exact repository `migration.sql` bytes with SHA-256 and compare migration by migration.
4. Inspect the migration's Git history and compare the live schema to the intended post-migration schema.
5. Classify each mismatch: changed file with equivalent schema, partially applied migration, failed migration, or schema divergence.
6. Produce a reviewed repair plan. Prefer a new forward-fix migration. Use `prisma migrate resolve` only when operators have proved that the database already matches the intended state and have recorded the exact migration and evidence.
7. Re-run status and validate on staging, then run read-only smoke tests. Production remains blocked until this evidence exists.

Never run `prisma migrate reset`, delete `_prisma_migrations`, edit an applied SQL file, or mark an unapplied change as applied merely to silence Prisma.

## Release gate

Order: backup confirmation -> repository checksum gate -> `prisma validate` -> `prisma migrate status` -> staging `migrate deploy` -> staging health/smoke -> reviewed production approval -> production `migrate deploy` -> health/smoke. Destructive changes use expand/migrate/contract across releases. Prisma migrations are forward-fixed; an automatic schema rollback is not promised.
