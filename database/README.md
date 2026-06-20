# NEWS Database Module

Canonical lifecycle assets for `sdkwork-news` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `news`
- serviceCode: `NEWS`
- tablePrefix: `news_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
pnpm run db:plan
pnpm run db:bootstrap
```

## Baseline

Legacy SQL from `crates/sdkwork-content-news-repository-sqlx/migrations/*.sql` is consolidated in `database/ddl/baseline/postgres/0001_news_legacy_baseline.sql`.

## Runtime bootstrap

PostgreSQL: `sdkwork-news-database-host` via `bootstrap_news_database()` / `connect_and_bootstrap_news_database_from_env()`.

SQLite tests and the current api-server path continue to use inline migration SQL through `SqliteNewsStore::migrate()`.
