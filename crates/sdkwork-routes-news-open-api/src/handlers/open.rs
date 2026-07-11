use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use serde_json::{json, Value};
use sqlx::Row;
use std::sync::Arc;

use crate::state::NewsHttpState;

#[derive(Deserialize)]
pub struct ListParams {
    pub category_id: Option<String>,
    pub q: Option<String>,
    pub status: Option<String>,
    pub page_size: Option<i64>,
    pub cursor: Option<String>,
}

pub async fn list_items(
    State(state): State<Arc<crate::state::NewsHttpState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);
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
    State(state): State<Arc<crate::state::NewsHttpState>>,
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

pub async fn get_item_by_slug(
    State(state): State<Arc<crate::state::NewsHttpState>>,
    Path(slug): Path<String>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE slug = ? AND status = 'published' AND deleted_at IS NULL"
    )
    .bind(&slug)
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
            tracing::error!("Failed to get item by slug: {}", e);
            Json(json!(null))
        }
    }
}

pub async fn list_categories(
    State(state): State<Arc<crate::state::NewsHttpState>>,
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

pub async fn list_channels(
    State(state): State<Arc<crate::state::NewsHttpState>>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, slug, title, channel_type, status, priority
         FROM news_channel
         WHERE status = 'active'
         ORDER BY priority ASC, title ASC"
    )
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let channels: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "tenantId": row.get::<String, _>("tenant_id"),
                        "slug": row.get::<String, _>("slug"),
                        "title": row.get::<String, _>("title"),
                        "channelType": row.get::<String, _>("channel_type"),
                        "status": row.get::<String, _>("status"),
                        "priority": row.get::<i32, _>("priority"),
                    })
                })
                .collect();
            Json(json!(channels))
        }
        Err(e) => {
            tracing::error!("Failed to list channels: {}", e);
            Json(json!([]))
        }
    }
}

pub async fn list_channel_feed(
    State(state): State<Arc<crate::state::NewsHttpState>>,
    Path(channel_id): Path<String>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);

    let result = sqlx::query(
        "SELECT i.id, i.tenant_id, i.category_id, i.slug, i.title, i.summary, 
                i.status, i.author_name, i.featured, i.priority, 
                i.estimated_read_minutes, i.published_at, i.updated_at
         FROM news_channel_item ci
         JOIN news_item i ON i.id = ci.item_id
         WHERE ci.channel_id = ? AND ci.status = 'active' AND i.status = 'published' AND i.deleted_at IS NULL
         ORDER BY ci.rank ASC, i.published_at DESC
         LIMIT ?"
    )
    .bind(&channel_id)
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
            tracing::error!("Failed to list channel feed: {}", e);
            Json(json!([]))
        }
    }
}

pub async fn list_topics(
    State(state): State<Arc<crate::state::NewsHttpState>>,
) -> Json<Value> {
    let result = sqlx::query(
        "SELECT id, tenant_id, slug, title, description, status, priority
         FROM news_topic
         WHERE status = 'active'
         ORDER BY priority ASC, title ASC"
    )
    .fetch_all(&state.pool)
    .await;

    match result {
        Ok(rows) => {
            let topics: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "id": row.get::<String, _>("id"),
                        "tenantId": row.get::<String, _>("tenant_id"),
                        "slug": row.get::<String, _>("slug"),
                        "title": row.get::<String, _>("title"),
                        "description": row.get::<Option<String>, _>("description"),
                        "status": row.get::<String, _>("status"),
                        "priority": row.get::<i32, _>("priority"),
                    })
                })
                .collect();
            Json(json!(topics))
        }
        Err(e) => {
            tracing::error!("Failed to list topics: {}", e);
            Json(json!([]))
        }
    }
}

pub async fn list_trending(
    State(state): State<Arc<crate::state::NewsHttpState>>,
    Query(params): Query<ListParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);

    let result = sqlx::query(
        "SELECT i.id, i.tenant_id, i.category_id, i.slug, i.title, i.summary, 
                i.status, i.author_name, i.featured, i.priority, 
                i.estimated_read_minutes, i.published_at, i.updated_at
         FROM news_item i
         WHERE i.status = 'published' AND i.deleted_at IS NULL
         ORDER BY i.featured DESC, i.priority ASC, i.published_at DESC
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
            tracing::error!("Failed to list trending: {}", e);
            Json(json!([]))
        }
    }
}

#[derive(Deserialize)]
pub struct SearchParams {
    pub q: Option<String>,
    pub page_size: Option<i64>,
    pub cursor: Option<String>,
}

pub async fn search(
    State(state): State<Arc<crate::state::NewsHttpState>>,
    Query(params): Query<SearchParams>,
) -> Json<Value> {
    let limit = params.page_size.unwrap_or(20).min(100);
    let query = params.q.unwrap_or_default();
    let search_pattern = format!("%{}%", query);

    let result = sqlx::query(
        "SELECT id, tenant_id, category_id, slug, title, summary, status, author_name, 
                featured, priority, estimated_read_minutes, published_at, updated_at
         FROM news_item
         WHERE status = 'published' AND deleted_at IS NULL
           AND (title LIKE ? OR summary LIKE ?)
         ORDER BY published_at DESC, priority ASC
         LIMIT ?"
    )
    .bind(&search_pattern)
    .bind(&search_pattern)
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
            tracing::error!("Failed to search: {}", e);
            Json(json!([]))
        }
    }
}
