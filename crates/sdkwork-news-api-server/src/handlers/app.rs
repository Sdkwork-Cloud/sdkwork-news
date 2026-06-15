use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Value};
use sqlx::Row;
use std::sync::Arc;

use crate::bootstrap::AppState;

#[derive(Deserialize)]
pub struct ListParams {
    pub category_id: Option<String>,
    pub q: Option<String>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub cursor: Option<String>,
}

pub async fn list_items(
    State(state): State<Arc<AppState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.limit.unwrap_or(20).min(100);
    let status = params.status.as_deref().unwrap_or("published");

    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE status = ? AND deleted_at IS NULL
         ORDER BY published_at DESC, priority ASC
         LIMIT ?"
    )
    .bind(status)
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

pub async fn get_item(
    State(state): State<Arc<AppState>>,
    Path(item_id): Path<String>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE id = ? AND deleted_at IS NULL"
    )
    .bind(&item_id)
    .fetch_optional(&state.pool)
    .await;

    match result {
        Ok(Some(row)) => {
            Json(json!({
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
            }))
        }
        Ok(None) => Json(json!(null)),
        Err(e) => {
            tracing::error!("Failed to get item: {}", e);
            Json(json!(null))
        }
    }
}

pub async fn list_categories(
    State(state): State<Arc<AppState>>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, slug, title, description, priority, enabled
         FROM news_category
         WHERE enabled = TRUE
         ORDER BY priority ASC, title ASC"
    )
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let categories: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "tenantId": row.get::<String, _>("tenant_id"),
                        "slug": row.get::<String, _>("slug"),
                        "title": row.get::<String, _>("title"),
                        "description": row.get::<Option<String>, _>("description"),
                        "priority": row.get::<i32, _>("priority"),
                        "enabled": row.get::<bool, _>("enabled"),
                    })
                })
                .collect();
            Json(json!(categories))
        }
        Err(e) => {
            tracing::error!("Failed to list categories: {}", e);
            Json(json!([]))
        }
    }
}

#[derive(Deserialize)]
pub struct FeedParams {
    pub limit: Option<i64>,
    pub cursor: Option<String>,
    pub trace_id: Option<String>,
}

pub async fn get_personalized_feed(
    State(state): State<Arc<AppState>>,
    Query(params): Query<FeedParams>,
) -> Json<Value> {
    let limit = params.limit.unwrap_or(20).min(100);

    // Simple personalized feed - returns published items ordered by priority
    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE status = 'published' AND deleted_at IS NULL
         ORDER BY featured DESC, priority ASC, published_at DESC
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
            tracing::error!("Failed to get personalized feed: {}", e);
            Json(json!([]))
        }
    }
}

#[derive(Deserialize)]
pub struct CreateEventRequest {
    pub item_id: String,
    pub event_type: String,
    pub dwell_ms: Option<i64>,
    pub trace_id: Option<String>,
}

pub async fn create_event(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateEventRequest>,
) -> Json<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let result = sqlx::query(
        "INSERT INTO news_publication_event (id, tenant_id, item_id, event_type, actor_user_id, occurred_at)
         VALUES (?, 'default', ?, ?, NULL, ?)"
    )
    .bind(&id)
    .bind(&request.item_id)
    .bind(&request.event_type)
    .bind(&now)
    .execute(&state.pool)
    .await;

    match result {
        Ok(_) => Json(json!({ "success": true, "id": id })),
        Err(e) => {
            tracing::error!("Failed to create event: {}", e);
            Json(json!({ "success": false, "error": e.to_string() }))
        }
    }
}

pub async fn list_favorites(
    State(state): State<Arc<AppState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.limit.unwrap_or(20).min(100);

    let result = sqlx::query(
        "SELECT f.id, f.user_id, f.item_id, f.status, f.created_at,
                i.title, i.slug, i.summary
         FROM news_favorite f
         JOIN news_item i ON i.id = f.item_id
         WHERE f.status = 'active'
         ORDER BY f.created_at DESC
         LIMIT ?"
    )
    .bind(limit)
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let favorites: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "userId": row.get::<String, _>("user_id"),
                        "itemId": row.get::<String, _>("item_id"),
                        "status": row.get::<String, _>("status"),
                        "createdAt": row.get::<String, _>("created_at"),
                        "item": {
                            "title": row.get::<String, _>("title"),
                            "slug": row.get::<String, _>("slug"),
                            "summary": row.get::<String, _>("summary"),
                        }
                    })
                })
                .collect();
            Json(json!(favorites))
        }
        Err(e) => {
            tracing::error!("Failed to list favorites: {}", e);
            Json(json!([]))
        }
    }
}

pub async fn create_favorite(
    State(state): State<Arc<AppState>>,
    Path(item_id): Path<String>,
) -> Json<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let result = sqlx::query(
        "INSERT INTO news_favorite (id, tenant_id, user_id, item_id, status, created_at)
         VALUES (?, 'default', 'anonymous', ?, 'active', ?)
         ON CONFLICT (tenant_id, user_id, item_id) DO UPDATE SET status = 'active', deleted_at = NULL"
    )
    .bind(&id)
    .bind(&item_id)
    .bind(&now)
    .execute(&state.pool)
    .await;

    match result {
        Ok(_) => Json(json!({ "success": true, "id": id })),
        Err(e) => {
            tracing::error!("Failed to create favorite: {}", e);
            Json(json!({ "success": false, "error": e.to_string() }))
        }
    }
}
