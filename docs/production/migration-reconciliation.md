# Migration reconciliation and release gate

## Current finding

Historical Phase 9 checksum drift was reported, but this checkout has no reachable production-candidate database or `_prisma_migrations` export. Repository hashes alone cannot identify which deployed checksum differs or prove schema equivalence. Reconciliation is therefore **BLOCKED**, not passed. No database was reset or modified during Phase 11 preparation.

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
