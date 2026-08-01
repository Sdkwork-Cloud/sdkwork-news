mod bootstrap;

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
    let bind = std::env::var("SDKWORK_NEWS_APPLICATION_PUBLIC_INGRESS_BIND")?;
    let listener = tokio::net::TcpListener::bind(&bind).await?;
    tracing::info!("News API server listening on {}", bind);

    axum::serve(listener, app).await?;

    Ok(())
}
