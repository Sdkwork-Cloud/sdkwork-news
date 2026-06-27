//! Gateway assembly for sdkwork-news.
//! Application bootstrap lives in `bootstrap.rs`; route inventory is in `assembly-manifest.json`.

mod bootstrap;
mod generated;

pub use bootstrap::{assemble_application_business_router, ApplicationAssembly};
pub use sdkwork_routes_news_open_api::state::NewsHttpState;

pub fn assembly_route_count() -> usize {
    generated::ROUTE_CRATE_COUNT
}
