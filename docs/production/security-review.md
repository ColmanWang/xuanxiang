# Production security review

Status on 2026-09-26: **BLOCKED**. OAuth, allowlist, RBAC, unauthenticated Studio isolation, public smoke, and desktop/mobile public E2E now have staging evidence. Final CSRF/adversarial staging checks, alert exercises, production secret-store review, production database/network review, backup/restore evidence, and operational ownership evidence remain missing.

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

## Staging evidence recorded on 2026-09-26

- GitHub OAuth used the staging-only callback and completed a real login. A verified email first matched an enabled allowlist row, then the immutable Better Auth user ID was bound and used on subsequent sessions.
- Disabling the bound allowlist member allowed OAuth to complete but denied Studio access. Re-enabling the same member restored ADMIN access.
- An unauthenticated `/studio` response initially contained protected child-page payload data despite rendering the login UI. Commit `f2846cd` added page-level server authorization; the deployed response was rechecked and no longer contained the protected dashboard markers.
- EDITOR could create a draft but received server `FORBIDDEN` for Review and Publish. After commit `930388c`, Review, Publish, and Archive controls were absent for EDITOR.
- REVIEWER successfully reviewed and published a staging-only fixture with a staging-only Citation; Archive was absent. ADMIN saw Review, Publish, and Archive and successfully archived both test fixtures.
- The two test Concepts, one test Source, and one test Citation were removed after acceptance. Ten audit records were intentionally retained.
- `pnpm production:smoke --url https://xuanxiang-staging.vercel.app` passed all seven checks with stable Bazi and Liuyao fingerprints. Playwright passed 12/12 public-path checks across desktop Chromium and an iPhone 13/WebKit viewport profile.
- Latest recorded remote CI evidence is run ID `36213415413` for commit `930388c`: https://github.com/ColmanWang/xuanxiang/actions/runs/36213415413.
- Operational signal code now avoids request bodies and user content: rate-limit events are metrics/logs only, while database and AI-provider failures create sanitized Sentry error events. This remains local implementation evidence until deployment and alert delivery are exercised on staging.
