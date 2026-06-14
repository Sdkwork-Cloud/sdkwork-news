use sqlx::Row;

pub fn live_event_from_row(row: &sqlx::sqlite::SqliteRow) -> super::models::NewsStoredLiveEvent {
    super::models::NewsStoredLiveEvent {
        id: string_cell(row, "id"),
        slug: string_cell(row, "slug"),
        title: string_cell(row, "title"),
        summary: string_cell(row, "summary"),
        event_type: string_cell(row, "event_type"),
        priority: integer_cell(row, "priority"),
        status: string_cell(row, "status"),
        region: optional_string_cell(row, "region"),
        locale: optional_string_cell(row, "locale"),
        started_at: optional_string_cell(row, "started_at"),
        published_at: optional_string_cell(row, "published_at"),
        closed_at: optional_string_cell(row, "closed_at"),
        updated_at: string_cell(row, "updated_at"),
    }
}

pub fn live_update_from_row(row: &sqlx::sqlite::SqliteRow) -> super::models::NewsStoredLiveUpdate {
    super::models::NewsStoredLiveUpdate {
        id: string_cell(row, "id"),
        live_event_id: string_cell(row, "live_event_id"),
        title: optional_string_cell(row, "title"),
        body: string_cell(row, "body"),
        update_type: string_cell(row, "update_type"),
        importance: integer_cell(row, "importance"),
        source_id: optional_string_cell(row, "source_id"),
        author_id: optional_string_cell(row, "author_id"),
        item_id: optional_string_cell(row, "item_id"),
        published_at: optional_string_cell(row, "published_at"),
    }
}

pub fn normalize_tag_slug(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace(' ', "-")
}

pub fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

pub fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

pub fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

pub fn optional_integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<i64> {
    row.try_get::<Option<i64>, _>(column)
        .ok()
        .flatten()
        .or_else(|| {
            row.try_get::<Option<i32>, _>(column)
                .ok()
                .flatten()
                .map(i64::from)
        })
}

pub fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .or_else(|_| row.try_get::<i64, _>(column).map(|value| value != 0))
        .unwrap_or(false)
}
