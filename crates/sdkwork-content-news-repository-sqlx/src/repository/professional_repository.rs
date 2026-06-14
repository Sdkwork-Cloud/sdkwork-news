use sqlx::{Row, SqlitePool};

pub struct NewsProfessionalRepository {
    pool: SqlitePool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsStory {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub story_type: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredStory {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub story_type: String,
    pub status: String,
    pub published_at: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsStoryItem {
    pub id: String,
    pub tenant_id: String,
    pub story_id: String,
    pub item_id: String,
    pub relation_type: String,
    pub rank: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsEditorialAssignment {
    pub id: String,
    pub tenant_id: String,
    pub item_id: Option<String>,
    pub story_id: Option<String>,
    pub assignee_user_id: String,
    pub assignment_role: String,
    pub due_at: Option<String>,
    pub created_by_user_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredEditorialAssignment {
    pub id: String,
    pub assignee_user_id: String,
    pub assignment_role: String,
    pub status: String,
    pub due_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsReviewTask {
    pub id: String,
    pub tenant_id: String,
    pub target_type: String,
    pub target_id: String,
    pub review_type: String,
    pub reviewer_user_id: Option<String>,
    pub due_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredReviewTask {
    pub id: String,
    pub target_type: String,
    pub target_id: String,
    pub review_type: String,
    pub status: String,
    pub reviewer_user_id: Option<String>,
    pub decision: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsImportJob {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub source_id: Option<String>,
    pub import_format: String,
    pub provider: String,
    pub idempotency_key: String,
    pub provider_payload_hash: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredImportJob {
    pub id: String,
    pub import_format: String,
    pub status: String,
    pub item_count: i64,
    pub error_count: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsExportJob {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub export_format: String,
    pub filter_json: Option<String>,
    pub destination_uri: Option<String>,
    pub requested_by_user_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredExportJob {
    pub id: String,
    pub export_format: String,
    pub status: String,
    pub item_count: i64,
    pub error_count: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItemRights {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub rights_status: String,
    pub copyright_holder: Option<String>,
    pub license_code: Option<String>,
    pub embargo_until: Option<String>,
    pub usage_terms: Option<String>,
    pub geography_scope: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsC2paProvenance {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub media_id: Option<String>,
    pub provenance_status: String,
    pub manifest_uri: Option<String>,
    pub manifest_hash: Option<String>,
    pub signer: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsBodyBlock {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub version_id: Option<String>,
    pub block_type: String,
    pub block_order: i64,
    pub body: String,
    pub data_json: Option<String>,
    pub media_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSchemaOrgProjection {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub schema_type: String,
    pub json_ld: String,
    pub source_version: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsApiOperationAudit {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub surface: String,
    pub operation_id: String,
    pub method: String,
    pub path: String,
    pub actor_user_id: Option<String>,
    pub auth_mode: String,
    pub request_id: String,
    pub trace_id: Option<String>,
    pub status_code: Option<i64>,
    pub idempotency_key: Option<String>,
    pub occurred_at: String,
}

impl NewsProfessionalRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create_story(&self, input: NewNewsStory) -> Result<NewsStoredStory, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_story
                (id, tenant_id, organization_id, slug, title, summary, story_type, status,
                 priority, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, 'draft', 100, ?, ?, 0)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.organization_id)
        .bind(&input.slug)
        .bind(&input.title)
        .bind(&input.summary)
        .bind(&input.story_type)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredStory {
            id: input.id,
            tenant_id: input.tenant_id,
            slug: input.slug,
            title: input.title,
            summary: input.summary,
            story_type: input.story_type,
            status: "draft".to_string(),
            published_at: None,
            updated_at: input.now,
        })
    }

    pub async fn retrieve_story(
        &self,
        tenant_id: &str,
        story_id: &str,
    ) -> Result<Option<NewsStoredStory>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT id, tenant_id, slug, title, summary, story_type, status, published_at, updated_at
            FROM news_story
            WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(story_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.as_ref().map(|row| NewsStoredStory {
            id: string_cell(row, "id"),
            tenant_id: string_cell(row, "tenant_id"),
            slug: string_cell(row, "slug"),
            title: string_cell(row, "title"),
            summary: string_cell(row, "summary"),
            story_type: string_cell(row, "story_type"),
            status: string_cell(row, "status"),
            published_at: optional_string_cell(row, "published_at"),
            updated_at: string_cell(row, "updated_at"),
        }))
    }

    pub async fn list_stories(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredStory>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, slug, title, summary, story_type, status, published_at, updated_at
            FROM news_story
            WHERE tenant_id = ?
              AND deleted_at IS NULL
              AND (? IS NULL OR status = ?)
            ORDER BY updated_at DESC, slug ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(status)
        .bind(status)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredStory {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                slug: string_cell(row, "slug"),
                title: string_cell(row, "title"),
                summary: string_cell(row, "summary"),
                story_type: string_cell(row, "story_type"),
                status: string_cell(row, "status"),
                published_at: optional_string_cell(row, "published_at"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn update_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        title: &str,
        summary: &str,
        expected_version: i64,
        now: &str,
    ) -> Result<bool, sqlx::Error> {
        let result = sqlx::query(
            r#"
            UPDATE news_story
            SET title = ?, summary = ?, updated_at = ?, version = version + 1
            WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL AND version = ?
            "#,
        )
        .bind(title)
        .bind(summary)
        .bind(now)
        .bind(tenant_id)
        .bind(story_id)
        .bind(expected_version)
        .execute(&self.pool)
        .await?;
        Ok(result.rows_affected() > 0)
    }

    pub async fn delete_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_story
            SET deleted_at = ?, updated_at = ?, version = version + 1
            WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(story_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            UPDATE news_story
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(story_id)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO news_editorial_audit
                (id, tenant_id, item_id, action, actor_user_id, before_json, after_json, created_at)
            VALUES
                (?, ?, ?, 'story.publish', NULL, NULL, NULL, ?)
            "#,
        )
        .bind(format!("audit_story_publish_{story_id}_{now}"))
        .bind(tenant_id)
        .bind(story_id)
        .bind(now)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn attach_story_item(&self, input: NewNewsStoryItem) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_story_item
                (id, tenant_id, story_id, item_id, relation_type, rank, pinned, note,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, FALSE, NULL, ?, ?)
            ON CONFLICT (tenant_id, story_id, item_id, relation_type)
            DO UPDATE SET rank = excluded.rank,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.story_id)
        .bind(&input.item_id)
        .bind(&input.relation_type)
        .bind(input.rank)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_assignment(
        &self,
        input: NewNewsEditorialAssignment,
    ) -> Result<NewsStoredEditorialAssignment, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_editorial_assignment
                (id, tenant_id, item_id, story_id, assignee_user_id, assignment_role, status,
                 due_at, created_by_user_id, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, 0)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.item_id)
        .bind(&input.story_id)
        .bind(&input.assignee_user_id)
        .bind(&input.assignment_role)
        .bind(&input.due_at)
        .bind(&input.created_by_user_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredEditorialAssignment {
            id: input.id,
            assignee_user_id: input.assignee_user_id,
            assignment_role: input.assignment_role,
            status: "open".to_string(),
            due_at: input.due_at,
        })
    }

    pub async fn list_assignments(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredEditorialAssignment>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, assignee_user_id, assignment_role, status, due_at
            FROM news_editorial_assignment
            WHERE tenant_id = ?
              AND (? IS NULL OR status = ?)
            ORDER BY due_at ASC, created_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(status)
        .bind(status)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredEditorialAssignment {
                id: string_cell(row, "id"),
                assignee_user_id: string_cell(row, "assignee_user_id"),
                assignment_role: string_cell(row, "assignment_role"),
                status: string_cell(row, "status"),
                due_at: optional_string_cell(row, "due_at"),
            })
            .collect())
    }

    pub async fn update_assignment(
        &self,
        tenant_id: &str,
        assignment_id: &str,
        status: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_editorial_assignment
            SET status = ?,
                completed_at = CASE WHEN ? IN ('done', 'cancelled') THEN ? ELSE completed_at END,
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(status)
        .bind(status)
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(assignment_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_review_task(
        &self,
        input: NewNewsReviewTask,
    ) -> Result<NewsStoredReviewTask, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_review_task
                (id, tenant_id, target_type, target_id, review_type, status, reviewer_user_id,
                 due_at, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, 0)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.target_type)
        .bind(&input.target_id)
        .bind(&input.review_type)
        .bind(&input.reviewer_user_id)
        .bind(&input.due_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredReviewTask {
            id: input.id,
            target_type: input.target_type,
            target_id: input.target_id,
            review_type: input.review_type,
            status: "open".to_string(),
            reviewer_user_id: input.reviewer_user_id,
            decision: None,
        })
    }

    pub async fn list_review_tasks(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredReviewTask>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, target_type, target_id, review_type, status, reviewer_user_id, decision
            FROM news_review_task
            WHERE tenant_id = ?
              AND (? IS NULL OR status = ?)
            ORDER BY due_at ASC, created_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(status)
        .bind(status)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredReviewTask {
                id: string_cell(row, "id"),
                target_type: string_cell(row, "target_type"),
                target_id: string_cell(row, "target_id"),
                review_type: string_cell(row, "review_type"),
                status: string_cell(row, "status"),
                reviewer_user_id: optional_string_cell(row, "reviewer_user_id"),
                decision: optional_string_cell(row, "decision"),
            })
            .collect())
    }

    pub async fn update_review_task(
        &self,
        tenant_id: &str,
        task_id: &str,
        decision: &str,
        decision_reason: Option<&str>,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        let status = match decision {
            "approved" => "approved",
            "rejected" => "rejected",
            "changes_requested" => "changes_requested",
            _ => "open",
        };
        sqlx::query(
            r#"
            UPDATE news_review_task
            SET decision = ?,
                decision_reason = ?,
                status = ?,
                completed_at = CASE WHEN ? IN ('approved', 'rejected', 'changes_requested') THEN ? ELSE completed_at END,
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(decision)
        .bind(decision_reason)
        .bind(status)
        .bind(status)
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(task_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_import_job(
        &self,
        input: NewNewsImportJob,
    ) -> Result<NewsStoredImportJob, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_import_job
                (id, tenant_id, organization_id, source_id, import_format, provider, status,
                 idempotency_key, provider_payload_hash, item_count, error_count,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, 'pending', ?, ?, 0, 0, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.organization_id)
        .bind(&input.source_id)
        .bind(&input.import_format)
        .bind(&input.provider)
        .bind(&input.idempotency_key)
        .bind(&input.provider_payload_hash)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredImportJob {
            id: input.id,
            import_format: input.import_format,
            status: "pending".to_string(),
            item_count: 0,
            error_count: 0,
        })
    }

    pub async fn retrieve_import_job(
        &self,
        tenant_id: &str,
        job_id: &str,
    ) -> Result<Option<NewsStoredImportJob>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT id, import_format, status, item_count, error_count
            FROM news_import_job
            WHERE tenant_id = ? AND id = ?
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(job_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.as_ref().map(|row| NewsStoredImportJob {
            id: string_cell(row, "id"),
            import_format: string_cell(row, "import_format"),
            status: string_cell(row, "status"),
            item_count: integer_cell(row, "item_count"),
            error_count: integer_cell(row, "error_count"),
        }))
    }

    pub async fn create_export_job(
        &self,
        input: NewNewsExportJob,
    ) -> Result<NewsStoredExportJob, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_export_job
                (id, tenant_id, organization_id, export_format, status, filter_json,
                 destination_uri, item_count, error_count, requested_by_user_id,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, 'pending', ?, ?, 0, 0, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.organization_id)
        .bind(&input.export_format)
        .bind(&input.filter_json)
        .bind(&input.destination_uri)
        .bind(&input.requested_by_user_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredExportJob {
            id: input.id,
            export_format: input.export_format,
            status: "pending".to_string(),
            item_count: 0,
            error_count: 0,
        })
    }

    pub async fn upsert_item_rights(&self, input: NewNewsItemRights) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_item_rights
                (id, tenant_id, item_id, rights_status, copyright_holder, license_code,
                 embargo_until, usage_terms, geography_scope, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT (tenant_id, item_id)
            DO UPDATE SET rights_status = excluded.rights_status,
                          copyright_holder = excluded.copyright_holder,
                          license_code = excluded.license_code,
                          embargo_until = excluded.embargo_until,
                          usage_terms = excluded.usage_terms,
                          geography_scope = excluded.geography_scope,
                          updated_at = excluded.updated_at,
                          version = news_item_rights.version + 1
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.item_id)
        .bind(&input.rights_status)
        .bind(&input.copyright_holder)
        .bind(&input.license_code)
        .bind(&input.embargo_until)
        .bind(&input.usage_terms)
        .bind(&input.geography_scope)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_c2pa_provenance(
        &self,
        input: NewNewsC2paProvenance,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_c2pa_provenance
                (id, tenant_id, item_id, media_id, provenance_status, manifest_uri,
                 manifest_hash, signer, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, item_id)
            DO UPDATE SET media_id = excluded.media_id,
                          provenance_status = excluded.provenance_status,
                          manifest_uri = excluded.manifest_uri,
                          manifest_hash = excluded.manifest_hash,
                          signer = excluded.signer,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.item_id)
        .bind(&input.media_id)
        .bind(&input.provenance_status)
        .bind(&input.manifest_uri)
        .bind(&input.manifest_hash)
        .bind(&input.signer)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_body_block(&self, input: NewNewsBodyBlock) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_body_block
                (id, tenant_id, item_id, version_id, block_type, block_order, body,
                 data_json, media_id, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.item_id)
        .bind(&input.version_id)
        .bind(&input.block_type)
        .bind(input.block_order)
        .bind(&input.body)
        .bind(&input.data_json)
        .bind(&input.media_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_schema_org_projection(
        &self,
        input: NewNewsSchemaOrgProjection,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_schema_org_projection
                (id, tenant_id, item_id, schema_type, json_ld, source_version, status,
                 rebuilt_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, 'fresh', ?, ?, ?)
            ON CONFLICT (tenant_id, item_id, schema_type)
            DO UPDATE SET json_ld = excluded.json_ld,
                          source_version = excluded.source_version,
                          status = 'fresh',
                          rebuilt_at = excluded.rebuilt_at,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.item_id)
        .bind(&input.schema_type)
        .bind(&input.json_ld)
        .bind(input.source_version)
        .bind(&input.now)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn record_api_operation_audit(
        &self,
        input: NewNewsApiOperationAudit,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_api_operation_audit
                (id, tenant_id, organization_id, surface, operation_id, method, path,
                 actor_user_id, auth_mode, request_id, trace_id, status_code,
                 idempotency_key, occurred_at, metadata_json)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.organization_id)
        .bind(&input.surface)
        .bind(&input.operation_id)
        .bind(&input.method)
        .bind(&input.path)
        .bind(&input.actor_user_id)
        .bind(&input.auth_mode)
        .bind(&input.request_id)
        .bind(&input.trace_id)
        .bind(input.status_code)
        .bind(&input.idempotency_key)
        .bind(&input.occurred_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    row.get::<String, _>(column)
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.get::<Option<String>, _>(column)
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.get::<i64, _>(column)
}
