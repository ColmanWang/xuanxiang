# Production architecture

玄象 1.0 uses a single Next.js application boundary. The browser talks only to the application; it never receives database, AI-provider, Redis, backup, or monitoring credentials.

```text
Browser
  -> CDN / TLS / application firewall
  -> Next.js application
       -> PostgreSQL + pgvector
       -> Redis-compatible rate limiter
       -> AI chat provider (optional)
       -> AI embedding provider (optional)
       -> server-side error tracking and structured logs
PostgreSQL -> encrypted managed backups / isolated backup storage
```

The application owns deterministic Bazi and Liuyao calculation. Providers may explain a server-recomputed trace but cannot calculate, publish, or edit source text. AI is a removable dependency: when it is unavailable or not accepted, public knowledge and deterministic tools remain the Core launch surface.

## Environment isolation

Development, staging, and production use different databases, Redis instances, OAuth applications, provider keys, indexes, domains, logs, and deployment identities. Staging may use synthetic accounts and fixtures. Production must never point to the local Docker database or a staging index. Studio writes are enabled only with production authentication, RBAC, CSRF protection, audit logging, and an explicit feature flag.

| Concern | Development | Staging | Production |
| --- | --- | --- | --- |
| data | local/synthetic | isolated production-like | authoritative |
| domain | localhost | non-public staging domain | public canonical domain |
| Studio | developer gate | test identities | least-privilege identities |
| AI | fake or developer provider | real acceptance provider | accepted provider or disabled |
| logs | local | restricted test project | restricted production project |
| index | disposable | rebuilt from staging published data | immutable recorded version |

## Trust boundaries

- Secrets remain server-side and are supplied by the deployment secret store.
- Database and provider egress are private/restricted where the platform permits it.
- Logs exclude prompts, birth data, session tokens, source bodies, and provider keys.
- `/dev/**` routes return 404 in production; hiding navigation is insufficient.
- Backups use encryption, separate access control, retention, and restore verification.

The hosting vendor, regions, retention duration, RPO, RTO, and monitoring service are deliberately not claimed here: they must be selected and recorded before launch.
