mod bootstrap;
mod handlers;
mod http_route_manifest;
mod middleware;
mod readiness;
mod routes;
mod web_bootstrap;

use anyhow::Result;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Bootstrap application
    let app = bootstrap::create_app().await?;

    // Start server
    let bind = std::env::var("BIND_ADDR").unwrap_or_else(|_| "0.0.0.0:3000".to_string());
    let listener = tokio::net::TcpListener::bind(&bind).await?;
    tracing::info!("News API server listening on {}", bind);

    axum::serve(listener, app).await?;

    Ok(())
}
