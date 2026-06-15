use sqlx::sqlite::SqlitePoolOptions;
use sdkwork_content_news_repository_sqlx::repository::professional_repository::NewsProfessionalRepository;

pub async fn create_test_repo() -> NewsProfessionalRepository {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    
    // Run migrations from the repository crate
    let migrations = [
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0001_news_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0002_news_industry_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0003_news_personalization_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0004_news_alert_digest_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0005_news_trust_correction_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0006_news_live_coverage_foundation.sql"),
        include_str!("../../sdkwork-content-news-repository-sqlx/migrations/0007_news_professional_newsroom_foundation.sql"),
    ];

    for migration in &migrations {
        sqlx::raw_sql(migration)
            .execute(&pool)
            .await
            .unwrap();
    }

    NewsProfessionalRepository::new(pool)
}
