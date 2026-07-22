use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Value};
use sqlx::Row;
use std::sync::Arc;

#[derive(Deserialize)]
pub struct ListParams {
    pub status: Option<String>,
    pub tenant_id: Option<String>,
    pub page_size: Option<i64>,
    pub cursor: Option<String>,
}

pub async fn list_items(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);

    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE deleted_at IS NULL
         ORDER BY updated_at DESC
         LIMIT ?"
    )
    .bind(limit)
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let items: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "tenantId": row.get::<String, _>("tenant_id"),
                        "categoryId": row.get::<String, _>("category_id"),
                        "slug": row.get::<String, _>("slug"),
                        "title": row.get::<String, _>("title"),
                        "summary": row.get::<String, _>("summary"),
                        "status": row.get::<String, _>("status"),
                        "authorName": row.get::<Option<String>, _>("author_name"),
                        "featured": row.get::<bool, _>("featured"),
                        "priority": row.get::<i32, _>("priority"),
                        "estimatedReadMinutes": row.get::<i32, _>("estimated_read_minutes"),
                        "publishedAt": row.get::<Option<String>, _>("published_at"),
                        "updatedAt": row.get::<String, _>("updated_at"),
                    })
                })
                .collect();
            Json(json!(items))
        }
        Err(e) => {
            tracing::error!("Failed to list items: {}", e);
            Json(json!([]))
        }
    }
}

#[derive(Deserialize)]
pub struct CreateItemRequest {
    pub category_id: String,
    pub title: String,
    pub summary: String,
    pub body: Option<String>,
    pub author_name: Option<String>,
    pub tags: Option<Vec<String>>,
}

pub async fn create_item(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Json(request): Json<CreateItemRequest>,
) -> Json<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    let slug = request
        .title
        .to_lowercase()
        .replace(' ', "-")
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == '-')
        .collect::<String>();

    let result = sqlx::query(
        "INSERT INTO news_item (id, tenant_id, category_id, slug, title, summary, status, 
                                author_name, featured, priority, estimated_read_minutes, created_at, updated_at)
         VALUES (?, 'default', ?, ?, ?, ?, 'draft', ?, FALSE, 100, 0, ?, ?)"
    )
    .bind(&id)
    .bind(&request.category_id)
    .bind(&slug)
    .bind(&request.title)
    .bind(&request.summary)
    .bind(&request.author_name)
    .bind(&now)
    .bind(&now)
    .execute(&state.pool)
    .await;

    match result {
        Ok(_) => {
            // Insert body if provided
            if let Some(body) = &request.body {
                let _ = sqlx::query(
                    "INSERT INTO news_item_body (item_id, body_markdown, body_format, updated_at)
                     VALUES (?, ?, 'markdown', ?)"
                )
                .bind(&id)
                .bind(body)
                .bind(&now)
                .execute(&state.pool)
                .await;
            }

            Json(json!({ "success": true, "id": id, "slug": slug }))
        }
        Err(e) => {
            tracing::error!("Failed to create item: {}", e);
            Json(json!({ "success": false, "error": e.to_string() }))
        }
    }
}

pub async fn list_stories(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);

    let result = sqlx::query(
        "SELECT id, tenant_id, slug, title, summary, story_type, status, published_at, updated_at
         FROM news_story
         WHERE deleted_at IS NULL
         ORDER BY updated_at DESC
         LIMIT ?"
    )
    .bind(limit)
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let stories: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "tenantId": row.get::<String, _>("tenant_id"),
                        "slug": row.get::<String, _>("slug"),
                        "title": row.get::<String, _>("title"),
                        "summary": row.get::<String, _>("summary"),
                        "storyType": row.get::<String, _>("story_type"),
                        "status": row.get::<String, _>("status"),
                        "publishedAt": row.get::<Option<String>, _>("published_at"),
                        "updatedAt": row.get::<String, _>("updated_at"),
                    })
                })
                .collect();
            Json(json!(stories))
        }
        Err(e) => {
            tracing::error!("Failed to list stories: {}", e);
            Json(json!([]))
        }
    }
}

#[derive(Deserialize)]
pub struct CreateStoryRequest {
    pub title: String,
    pub summary: Option<String>,
    pub story_type: Option<String>,
    pub organization_id: Option<String>,
}

pub async fn create_story(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Json(request): Json<CreateStoryRequest>,
) -> Json<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    let slug = request
        .title
        .to_lowercase()
        .replace(' ', "-")
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == '-')
        .collect::<String>();

    let result = sqlx::query(
        "INSERT INTO news_story (id, tenant_id, organization_id, slug, title, summary, story_type, status, 
                                  priority, created_at, updated_at, version)
         VALUES (?, 'default', ?, ?, ?, ?, ?, 'draft', 100, ?, ?, 0)"
    )
    .bind(&id)
    .bind(&request.organization_id)
    .bind(&slug)
    .bind(&request.title)
    .bind(&request.summary)
    .bind(&request.story_type.as_deref().unwrap_or("standard"))
    .bind(&now)
    .bind(&now)
    .execute(&state.pool)
    .await;

    match result {
        Ok(_) => Json(json!({ "success": true, "id": id, "slug": slug })),
        Err(e) => {
            tracing::error!("Failed to create story: {}", e);
            Json(json!({ "success": false, "error": e.to_string() }))
        }
    }
}

pub async fn get_story(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Path(story_id): Path<String>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, slug, title, summary, story_type, status, published_at, updated_at
         FROM news_story
         WHERE id = ? AND deleted_at IS NULL"
    )
    .bind(&story_id)
    .fetch_optional(&state.pool)
    .await;

    match result {
        Ok(Some(row)) => {
            Json(json!({
                "id": row.get::<String, _>("id"),
                "tenantId": row.get::<String, _>("tenant_id"),
                "slug": row.get::<String, _>("slug"),
                "title": row.get::<String, _>("title"),
                "summary": row.get::<String, _>("summary"),
                "storyType": row.get::<String, _>("story_type"),
                "status": row.get::<String, _>("status"),
                "publishedAt": row.get::<Option<String>, _>("published_at"),
                "updatedAt": row.get::<String, _>("updated_at"),
            }))
        }
        Ok(None) => Json(json!(null)),
        Err(e) => {
            tracing::error!("Failed to get story: {}", e);
            Json(json!(null))
        }
    }
}

pub async fn publish_story(
    State(state): State<Arc<sdkwork_routes_news_open_api::state::NewsHttpState>>,
    Path(story_id): Path<String>,
) -> Json<Value> {
    let now = chrono::Utc::now().to_rfc3339();

    let result = sqlx::query(
        "UPDATE news_story
         SET status = 'published',
             published_at = COALESCE(published_at, ?),
             updated_at = ?,
             version = version + 1
         WHERE id = ? AND deleted_at IS NULL AND status IN ('draft', 'review')"
    )
    .bind(&now)
    .bind(&now)
    .bind(&story_id)
    .execute(&state.pool)
    .await;

    match result {
        Ok(r) => {
            if r.rows_affected() > 0 {
                Json(json!({ "success": true, "status": "published" }))
            } else {
                Json(json!({ "success": false, "error": "Story not found or already published" }))
            }
        }
        Err(e) => {
            tracing::error!("Failed to publish story: {}", e);
            Json(json!({ "success": false, "error": e.to_string() }))
        }
    }
}
