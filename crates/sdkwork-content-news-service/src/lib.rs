pub mod domain;
pub mod professional;
pub mod service;
pub use domain::*;
pub use professional::*;

// Re-export repository for service layer
pub use sdkwork_content_news_repository_sqlx as repository;
