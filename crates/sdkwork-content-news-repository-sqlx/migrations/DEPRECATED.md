# Deprecated legacy migrations

These SQL files are consolidated into `database/ddl/baseline/postgres/0001_news_legacy_baseline.sql`.

Runtime SQLite tests continue to execute migrations through `SqliteNewsStore::migrate()` and `manifest` helpers until store wiring moves to the database framework bootstrap path.

PostgreSQL bootstrap MUST use `sdkwork-news-database-host` / `bootstrap_news_database()`.
