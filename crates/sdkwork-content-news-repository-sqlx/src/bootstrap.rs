//! SDKWork News database pool bootstrap via `sdkwork-database`.

use sdkwork_database_config::DatabaseConfig;
use sdkwork_database_sqlx::{create_pool_from_config, DatabasePool, PoolError};

pub use sdkwork_news_database_host::{
    bootstrap_news_database, bootstrap_news_database_from_env, NewsDatabaseHost,
};

pub type NewsDatabasePool = DatabasePool;

pub async fn connect_news_database_pool_from_env() -> Result<NewsDatabasePool, PoolError> {
    let config = DatabaseConfig::from_env("NEWS")?;
    create_pool_from_config(config).await
}

pub async fn connect_and_bootstrap_news_database_from_env() -> Result<NewsDatabaseHost, String> {
    let pool = connect_news_database_pool_from_env()
        .await
        .map_err(|error| error.to_string())?;
    bootstrap_news_database(pool).await
}
