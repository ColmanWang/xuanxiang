# Phase 11.1 staging content snapshot

This manifest records the accepted staging content state for the scoped Phase 11.1 closure. It is not a database backup and does not approve a production launch.

- Environment: isolated staging database (pooled runtime connection; resource identity retained privately)
- Generated at: `2026-09-27T03:41:16.490Z`
- Schema version: `1.0.0`
- Checksum: `sha256:af49f59fdda249ea6c5de9df863e5f5749dbcc70fc4b602251177e62db7d003b`
- Validation: `PASS` (`0` errors, `0` warnings)
- Sensitive-value scan: no password, token, authorization, session, OAuth, email, or PostgreSQL connection-string match

## Counts

| Record type | Count |
| --- | ---: |
| Entities | 64 |
| Published production entities | 58 |
| Dynasty foundation entities | 6 |
| Relations | 94 |
| Sources | 16 |
| Citations | 17 |
| Interpretations | 2 |
| Witnesses | 8 |
| Sections | 15 |
| Passages | 32 |
| Passage entity links | 32 |

The full JSON export was generated in a local temporary directory and is intentionally not committed. Regenerate it from the reviewed staging database with `pnpm content:export --out <temporary-path>` and compare the checksum above.
