# 玄象 1.0 launch checklist

Allowed states are `PASS`, `BLOCKED`, and `WAIVED`. A waiver requires approver, reason, scope, expiry, and compensating control. Missing evidence is `BLOCKED`. Run `pnpm launch:readiness --evidence <reviewed-json>` to aggregate Core and AI separately; it does not use percentages.

| Area | State | Current evidence / next action |
| --- | --- | --- |
| Remote CI | PASS | GitHub Actions `CI` run ID `36213415413` passed for commit `930388c` (`fix: enforce studio rbac controls`): https://github.com/ColmanWang/xuanxiang/actions/runs/36213415413. |
| Staging database | PASS | Independent Neon `xuanxiang-staging`; pooled runtime and direct migration connections verified on PostgreSQL 18.6, with pgvector 0.8.6 after migration. |
| Production database | BLOCKED | No reachable production candidate or credential was supplied. |
| Migration reconciliation | PASS | Fresh Staging applied 6/6 migrations; `migrate status` is current and all six database checksums match the repository manifest. Earlier reported drift is classified as historical local drift. |
| Backup and retention | BLOCKED | Provider/policy not selected. |
| Restore drill | BLOCKED | No isolated restore evidence. |
| Authentication / sessions / CSRF | BLOCKED | GitHub OAuth callback, verified-email plus immutable Better Auth user binding, session persistence, logout/login, and disabled-member denial were exercised successfully on staging. An unauthenticated response leak discovered during acceptance was fixed in `f2846cd` and rechecked: the login page remains available while protected Studio content is absent. Final staging CSRF adversarial evidence is still missing, so this combined gate remains blocked. |
| RBAC / Studio least privilege | PASS | Staging acceptance exercised the same bound identity as EDITOR, REVIEWER, and ADMIN. EDITOR could create a draft but received server `FORBIDDEN` for Review and Publish; its Review/Publish/Archive controls were absent after `930388c`. REVIEWER successfully reviewed and published a cited fixture, with Archive absent. ADMIN saw all three controls and archived both fixtures. Test business records were removed afterward; 10 audit records were retained. |
| Published content snapshot | BLOCKED | No 1.0 export checksum/freeze evidence. |
| Bazi foundation | PASS | Base release commit CI and Neon Staging verification passed; readiness remains `READY_WITH_LIMITATIONS` because Tier A independent luck-cycle fixtures are still zero. |
| Liuyao foundation | PASS | Base release commit CI and Neon Staging verification passed; ruleset remains `EXPERIMENTAL` with documented month-jian and Fushen limitations. |
| Rate limiting | PASS | Independent Upstash Redis `xuanxiang-staging` in Singapore passed TLS REST read/write and cross-instance shared-state checks. In production fail-closed mode, AI denied request 11/11, Bazi 61/61, Liuyao 61/61, and Search 121/121 with HTTP 429 and positive `Retry-After` values. Production still requires a separate Redis database. |
| Security review | BLOCKED | See security review; staging and infrastructure evidence missing. |
| Dependency audit | WAIVED | Next.js 16.3.6 and Prisma 7.10.0 are installed. Fixed transitive versions remove the `nanoid`, `js-yaml`, and `mysql2` High findings. `GHSA-ggr8-5vv4-36mx` remains only in Prisma's trusted config/tooling path and has a project-owner-approved waiver expiring 2026-10-31; CI automatically blocks it after expiry and blocks every other High/Critical finding. |
| Sentry staging ingestion | PASS | Independent Sentry project `xuanxiang-staging` received the sanitized Phase 11.1 test exception in environment `staging`; event ID `1ac90b5daa8a4a39b205ab6791824e8c` was confirmed in the Sentry issue UI. `sendDefaultPii` was disabled and the repository `beforeSend` sanitizer was active. |
| Observability / alerts | BLOCKED | Local implementation now emits sanitized Sentry metrics for operational signals and 5xx responses, plus error Issues for database and AI-provider failures; 338 tests and the production build pass. The change is not yet committed or deployed, and staging signal/alert-delivery exercises have not run. No production monitoring project exists yet. |
| SEO / privacy | BLOCKED | Release-domain crawl and policy review not completed. |
| Staging deployment | PASS | Vercel project `xuanxiang-staging` deployed commit `930388c` at `https://xuanxiang-staging.vercel.app` with AI disabled and allowlisted Studio enabled. The deployment reached `Ready`; the public homepage and health endpoint returned HTTP 200, and health reported database `ok`, app version `1.0.0`, Bazi engine `1.2.0`, and Liuyao engine `1.0.0`. |
| Staging core smoke | PASS | `pnpm production:smoke --url https://xuanxiang-staging.vercel.app` passed homepage, Knowledge, Classics, health, read-only Search, deterministic Bazi fingerprint `xx-bazi-edb3eb8a`, and deterministic Liuyao fingerprint `xx-liuyao-7cb97a9c`. AI remained disabled as required. |
| Staging E2E / viewport QA | PASS | Playwright against the deployed staging URL passed 12/12 checks: homepage, Knowledge, Classics, Bazi, Liuyao, and Search on desktop Chromium and iPhone 13/WebKit viewport profiles. |
| Production deployment | BLOCKED | No separate production infrastructure or deployment exists yet. |
| Production smoke | BLOCKED | No production deployment URL; production smoke has not run. |
| AI providers | BLOCKED | No real-provider credentials/acceptance results. AI must remain disabled. |
| RAG production index | BLOCKED | No production rebuild manifest/checksum. |

Current result: **CoreReadiness BLOCKED; AiReadiness BLOCKED; LaunchReadiness BLOCKED**. This is a truthful preparation state, not a public-launch approval. If Core later reaches READY while AI remains BLOCKED, 1.0 may launch with AI disabled and be reported as `READY_WITH_LIMITATIONS`.
