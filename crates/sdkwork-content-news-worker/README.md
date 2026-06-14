# sdkwork-content-news-worker

Domain: content
Capability: news
Package type: rust-crate
Status: design skeleton

This crate owns professional news background jobs: search/schema.org projection rebuilds,
projection drift checks, external feed polling, and bounded feed-item retries.

## Public API

- `.`
- `jobs`

## TODO Handoff

- TODO(news-worker): wire repositories, services, locks, retry policy, and scheduler bootstrap.
- TODO(news-worker): add job smoke, idempotency, retry, and drift verification tests.

## Verification

- `cargo test --manifest-path crates/sdkwork-content-news-worker/Cargo.toml`
