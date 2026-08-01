# sdkwork-api-news-standalone-gateway Specs

Component root: `crates/sdkwork-api-news-standalone-gateway`

Thin standalone listener, process-wide Web Framework wiring, readiness mounting,
and topology-owned bind configuration. Business routes, repositories, and
database bootstrap remain owned by `sdkwork-api-news-assembly` and its modules.
