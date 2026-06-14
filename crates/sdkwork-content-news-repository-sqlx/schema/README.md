# News Professional Schema Registry

This directory stores authored database design registry files for the `content.news` capability.

The SQLx migrations under `../migrations/` remain the implemented physical schema source. Files in
this directory describe the professional newsroom target schema, including planned tables that still
need migrations, repositories, DTO mapping, and drift checks.

Implementation handoff:

- `news-professional-schema.registry.json` declares implemented and planned table contracts.
- `src/professional_schema.rs` exposes the same registry shape for Rust contract tests.
- Future migration work should add `0007_news_professional_newsroom_foundation.sql`, then update the
  implemented/planned status and repository methods.
