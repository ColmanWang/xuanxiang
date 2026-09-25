# 玄象 1.0 launch checklist

Allowed states are `PASS`, `BLOCKED`, and `WAIVED`. A waiver requires approver, reason, scope, expiry, and compensating control. Missing evidence is `BLOCKED`. Run `pnpm launch:readiness --evidence <reviewed-json>` to aggregate Core and AI separately; it does not use percentages.

| Area | State | Current evidence / next action |
| --- | --- | --- |
| Remote CI | PASS | GitHub Actions `CI` run #5 / ID `36116773464` passed `quality` and `secret-scan` for commit `3c376b00dfd99285dda2921c0c1933171660cca6`. |
| Staging database | PASS | Independent Neon `xuanxiang-staging`; pooled runtime and direct migration connections verified on PostgreSQL 18.6, with pgvector 0.8.6 after migration. |
| Production database | BLOCKED | No reachable production candidate or credential was supplied. |
| Migration reconciliation | PASS | Fresh Staging applied 6/6 migrations; `migrate status` is current and all six database checksums match the repository manifest. Earlier reported drift is classified as historical local drift. |
| Backup and retention | BLOCKED | Provider/policy not selected. |
| Restore drill | BLOCKED | No isolated restore evidence. |
| Authentication / sessions / CSRF | BLOCKED | Local implementation requires staging acceptance. |
| RBAC / Studio least privilege | BLOCKED | Local tests require staging role-matrix acceptance. |
| Published content snapshot | BLOCKED | No 1.0 export checksum/freeze evidence. |
| Bazi foundation | PASS | Base release commit CI and Neon Staging verification passed; readiness remains `READY_WITH_LIMITATIONS` because Tier A independent luck-cycle fixtures are still zero. |
| Liuyao foundation | PASS | Base release commit CI and Neon Staging verification passed; ruleset remains `EXPERIMENTAL` with documented month-jian and Fushen limitations. |
| Rate limiting | PASS | Independent Upstash Redis `xuanxiang-staging` in Singapore passed TLS REST read/write and cross-instance shared-state checks. In production fail-closed mode, AI denied request 11/11, Bazi 61/61, Liuyao 61/61, and Search 121/121 with HTTP 429 and positive `Retry-After` values. Production still requires a separate Redis database. |
| Security review | BLOCKED | See security review; staging and infrastructure evidence missing. |
| Dependency audit | WAIVED | Next.js 16.3.6 and Prisma 7.10.0 are installed. Fixed transitive versions remove the `nanoid`, `js-yaml`, and `mysql2` High findings. `GHSA-ggr8-5vv4-36mx` remains only in Prisma's trusted config/tooling path and has a project-owner-approved waiver expiring 2026-10-31; CI automatically blocks it after expiry and blocks every other High/Critical finding. |
| Sentry staging ingestion | PASS | Independent Sentry project `xuanxiang-staging` received the sanitized Phase 11.1 test exception in environment `staging`; event ID `1ac90b5daa8a4a39b205ab6791824e8c` was confirmed in the Sentry issue UI. `sendDefaultPii` was disabled and the repository `beforeSend` sanitizer was active. |
| Observability / alerts | BLOCKED | Sentry event ingestion is verified, but 5xx, rate-limit, database-failure, and AI-provider-failure signals plus alert delivery have not all been exercised. No production monitoring project exists yet. |
| SEO / privacy | BLOCKED | Release-domain crawl and policy review not completed. |
| Staging / production deployment | BLOCKED | Remote CI passes, but no Vercel Staging or production deployment exists yet. |
| Production smoke | BLOCKED | No deployment URL; smoke has not run. |
| AI providers | BLOCKED | No real-provider credentials/acceptance results. AI must remain disabled. |
| RAG production index | BLOCKED | No production rebuild manifest/checksum. |

Current result: **CoreReadiness BLOCKED; AiReadiness BLOCKED; LaunchReadiness BLOCKED**. This is a truthful preparation state, not a public-launch approval. If Core later reaches READY while AI remains BLOCKED, 1.0 may launch with AI disabled and be reported as `READY_WITH_LIMITATIONS`.
