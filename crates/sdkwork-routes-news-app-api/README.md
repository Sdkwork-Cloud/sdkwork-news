# sdkwork-routes-news-app-api

Domain: content
Capability: news
Package type: rust-route-crate
Status: standard

This crate owns the app-api route metadata for SDKWork News. Business rules live in `sdkwork-content-news-service`; SQLx persistence lives in `sdkwork-content-news-repository-sqlx`.

## Verification

- `cargo test --manifest-path crates/sdkwork-routes-news-app-api/Cargo.toml`
