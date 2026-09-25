# 玄象 1.0 launch checklist

Allowed states are `PASS`, `BLOCKED`, and `WAIVED`. A waiver requires approver, reason, scope, expiry, and compensating control. Missing evidence is `BLOCKED`. Run `pnpm launch:readiness --evidence <reviewed-json>` to aggregate Core and AI separately; it does not use percentages.

| Area | State | Current evidence / next action |
| --- | --- | --- |
| Production database | BLOCKED | No reachable production candidate or credential was supplied. |
| Migration reconciliation | BLOCKED | Repository baseline exists; `_prisma_migrations` comparison is unavailable. |
| Backup and retention | BLOCKED | Provider/policy not selected. |
| Restore drill | BLOCKED | No isolated restore evidence. |
| Authentication / sessions / CSRF | BLOCKED | Local implementation requires staging acceptance. |
| RBAC / Studio least privilege | BLOCKED | Local tests require staging role-matrix acceptance. |
| Published content snapshot | BLOCKED | No 1.0 export checksum/freeze evidence. |
| Bazi foundation | BLOCKED | Must pass on the release commit in CI/staging. |
| Liuyao foundation | BLOCKED | Must pass on the release commit; documented limitations remain. |
| Rate limiting | BLOCKED | No production Redis configuration/load evidence. |
| Security review | BLOCKED | See security review; staging and infrastructure evidence missing. |
| Dependency audit | WAIVED | Next.js 16.3.6 and Prisma 7.10.0 are installed. Fixed transitive versions remove the `nanoid`, `js-yaml`, and `mysql2` High findings. `GHSA-ggr8-5vv4-36mx` remains only in Prisma's trusted config/tooling path and has a project-owner-approved waiver expiring 2026-10-31; CI automatically blocks it after expiry and blocks every other High/Critical finding. |
| Observability / alerts | BLOCKED | No production monitoring project or alert delivery test. |
| SEO / privacy | BLOCKED | Release-domain crawl and policy review not completed. |
| CI/CD | BLOCKED | Workflows exist but have not passed remotely and deployment is intentionally not configured. |
| Production smoke | BLOCKED | No deployment URL; smoke has not run. |
| AI providers | BLOCKED | No real-provider credentials/acceptance results. AI must remain disabled. |
| RAG production index | BLOCKED | No production rebuild manifest/checksum. |

Current result: **CoreReadiness BLOCKED; AiReadiness BLOCKED; LaunchReadiness BLOCKED**. This is a truthful preparation state, not a public-launch approval. If Core later reaches READY while AI remains BLOCKED, 1.0 may launch with AI disabled and be reported as `READY_WITH_LIMITATIONS`.
