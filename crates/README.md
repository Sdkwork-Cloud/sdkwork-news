# Crates

## Purpose

`crates/` contains Rust source crates split by responsibility.

## Owner

The `sdkwork-news` repository owns the news service, repository, and route crates.

## Allowed Content

- `sdkwork-content-news-service/` for business rules and service ports.
- `sdkwork-content-news-repository-sqlx/` for SQLx database access.
- `sdkwork-routes-news-open-api/`, `sdkwork-routes-news-app-api/`, and `sdkwork-routes-news-backend-api/` for HTTP route adaptation by surface.

## Forbidden Content

- Generic Rust crates named with `core`, `runtime`, `product`, `backend`, `common`, or other forbidden responsibility suffixes.
- Generated SDK transport packages.
- SQL queries inside route crates or business rules inside repository crates.

## Related Specs

- `../sdkwork-specs/RUST_CODE_SPEC.md`
- `../sdkwork-specs/NAMING_SPEC.md`
- `../sdkwork-specs/WEB_BACKEND_SPEC.md`

## Verification

Run `cargo test --workspace`.
