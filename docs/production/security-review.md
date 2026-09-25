# Production security review

Status on 2026-09-20: **BLOCKED**. Code-level controls can be reviewed locally, but no staging penetration test, production secret-store review, OAuth redirect verification, database network review, dependency acceptance, or operational ownership evidence was supplied.

The official-registry production audit initially found two critical Next.js advisories and a high Playwright advisory. Next.js is now 16.3.6 and Playwright is 1.55.1. Stable same-major overrides remove the later `nanoid`, `js-yaml`, and `mysql2` High findings. Prisma 7.10.0 still pins `@prisma/config` to `deepmerge-ts 7.1.5`; forcing the patched 8.x major would be outside Prisma's compatibility contract. The project owner approved a time-bound waiver for `GHSA-ggr8-5vv4-36mx` through 2026-10-31, limited to trusted Prisma configuration/build/migration tooling. Public inputs cannot reach this merge path. `pnpm dependency:audit` fails on every other High/Critical advisory and automatically fails this waiver after expiry. The waiver record is `docs/production/dependency-waivers.json`.

## Required evidence

- Authentication uses secure, HttpOnly, SameSite cookies; production HTTPS; short-lived/revocable sessions; CSRF protection; and generic login errors.
- RBAC defaults to deny and independently enforces Viewer, Editor, Reviewer, Publisher, and Admin privileges on the server. Publishing and role changes are audited.
- Every external input has schema/size validation. Database access is parameterized. Rendered content is escaped/sanitized.
- Studio and auth endpoints have distributed rate limits. Proxy headers are trusted only behind an explicitly configured proxy.
- Keys are in a secret manager, separated by environment, rotation-tested, least-privilege, and absent from client bundles, logs, history, and build artifacts.
- Logs redact sessions, authorization headers, OAuth codes, birth data, AI prompts, provider payloads, and database URLs. Error responses contain no stack or provider detail.
- Draft/private/editorial records never enter public search, RAG, sitemap, cache, or API responses.
- Security headers, CSP, HTTPS/HSTS, request limits, dependency audit, and secret scan pass in CI and staging.
- Backups are encrypted and restore access is restricted and audited.

Critical/high findings block launch. Medium findings require an owner and deadline; a waiver must state scope, risk, expiry, and approver in the launch checklist.
