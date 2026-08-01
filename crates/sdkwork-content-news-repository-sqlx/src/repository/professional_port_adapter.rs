use async_trait::async_trait;
use sdkwork_content_news_service::repository_port as port;

use super::professional_repository::{self as records, NewsProfessionalRepository};

fn repository_error(error: sqlx::Error) -> port::NewsRepositoryError {
    port::NewsRepositoryError::new(error.to_string())
}

fn stored_story(record: records::NewsStoredStory) -> port::NewsStoredStory {
    port::NewsStoredStory {
        id: record.id,
        tenant_id: record.tenant_id,
        slug: record.slug,
        title: record.title,
        summary: record.summary,
        story_type: record.story_type,
        status: record.status,
        published_at: record.published_at,
        updated_at: record.updated_at,
    }
}

#[async_trait]
impl port::NewsProfessionalRepositoryPort for NewsProfessionalRepository {
    async fn create_story(
        &self,
        input: port::NewNewsStory,
    ) -> port::NewsRepositoryResult<port::NewsStoredStory> {
        let record = NewsProfessionalRepository::create_story(
            self,
            records::NewNewsStory {
                id: input.id,
                tenant_id: input.tenant_id,
                organization_id: input.organization_id,
                slug: input.slug,
                title: input.title,
                summary: input.summary,
                story_type: input.story_type,
                now: input.now,
            },
        )
        .await
        .map_err(repository_error)?;
        Ok(stored_story(record))
    }

    async fn retrieve_story(
        &self,
        tenant_id: &str,
        story_id: &str,
    ) -> port::NewsRepositoryResult<Option<port::NewsStoredStory>> {
        NewsProfessionalRepository::retrieve_story(self, tenant_id, story_id)
            .await
            .map(|record| record.map(stored_story))
            .map_err(repository_error)
    }

    async fn list_stories(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> port::NewsRepositoryResult<Vec<port::NewsStoredStory>> {
        NewsProfessionalRepository::list_stories(self, tenant_id, status, limit)
            .await
            .map(|records| records.into_iter().map(stored_story).collect())
            .map_err(repository_error)
    }

    async fn update_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        title: &str,
        summary: &str,
        expected_version: i64,
        now: &str,
    ) -> port::NewsRepositoryResult<bool> {
        NewsProfessionalRepository::update_story(
            self,
            tenant_id,
            story_id,
            title,
            summary,
            expected_version,
            now,
        )
        .await
        .map_err(repository_error)
    }

    async fn delete_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::delete_story(self, tenant_id, story_id, now)
            .await
            .map_err(repository_error)
    }

    async fn publish_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::publish_story(self, tenant_id, story_id, now)
            .await
            .map_err(repository_error)
    }

    async fn attach_story_item(
        &self,
        input: port::NewNewsStoryItem,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::attach_story_item(
            self,
            records::NewNewsStoryItem {
                id: input.id,
                tenant_id: input.tenant_id,
                story_id: input.story_id,
                item_id: input.item_id,
                relation_type: input.relation_type,
                rank: input.rank,
                now: input.now,
            },
        )
        .await
        .map_err(repository_error)
    }

    async fn create_assignment(
        &self,
        input: port::NewNewsEditorialAssignment,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::create_assignment(
            self,
            records::NewNewsEditorialAssignment {
                id: input.id,
                tenant_id: input.tenant_id,
                item_id: input.item_id,
                story_id: input.story_id,
                assignee_user_id: input.assignee_user_id,
                assignment_role: input.assignment_role,
                due_at: input.due_at,
                created_by_user_id: input.created_by_user_id,
                now: input.now,
            },
        )
        .await
        .map(|_| ())
        .map_err(repository_error)
    }

    async fn update_assignment(
        &self,
        tenant_id: &str,
        assignment_id: &str,
        status: &str,
        now: &str,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::update_assignment(self, tenant_id, assignment_id, status, now)
            .await
            .map_err(repository_error)
    }

    async fn create_review_task(
        &self,
        input: port::NewNewsReviewTask,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::create_review_task(
            self,
            records::NewNewsReviewTask {
                id: input.id,
                tenant_id: input.tenant_id,
                target_type: input.target_type,
                target_id: input.target_id,
                review_type: input.review_type,
                reviewer_user_id: input.reviewer_user_id,
                due_at: input.due_at,
                now: input.now,
            },
        )
        .await
        .map(|_| ())
        .map_err(repository_error)
    }

    async fn update_review_task(
        &self,
        tenant_id: &str,
        task_id: &str,
        decision: &str,
        decision_reason: Option<&str>,
        now: &str,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::update_review_task(
            self,
            tenant_id,
            task_id,
            decision,
            decision_reason,
            now,
        )
        .await
        .map_err(repository_error)
    }

    async fn create_import_job(
        &self,
        input: port::NewNewsImportJob,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::create_import_job(
            self,
            records::NewNewsImportJob {
                id: input.id,
                tenant_id: input.tenant_id,
                organization_id: input.organization_id,
                source_id: input.source_id,
                import_format: input.import_format,
                provider: input.provider,
                idempotency_key: input.idempotency_key,
                provider_payload_hash: input.provider_payload_hash,
                now: input.now,
            },
        )
        .await
        .map(|_| ())
        .map_err(repository_error)
    }

    async fn create_export_job(
        &self,
        input: port::NewNewsExportJob,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::create_export_job(
            self,
            records::NewNewsExportJob {
                id: input.id,
                tenant_id: input.tenant_id,
                organization_id: input.organization_id,
                export_format: input.export_format,
                filter_json: input.filter_json,
                destination_uri: input.destination_uri,
                requested_by_user_id: input.requested_by_user_id,
                now: input.now,
            },
        )
        .await
        .map(|_| ())
        .map_err(repository_error)
    }

    async fn upsert_item_rights(
        &self,
        input: port::NewNewsItemRights,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::upsert_item_rights(
            self,
            records::NewNewsItemRights {
                id: input.id,
                tenant_id: input.tenant_id,
                item_id: input.item_id,
                rights_status: input.rights_status,
                copyright_holder: input.copyright_holder,
                license_code: input.license_code,
                embargo_until: input.embargo_until,
                usage_terms: input.usage_terms,
                geography_scope: input.geography_scope,
                now: input.now,
            },
        )
        .await
        .map_err(repository_error)
    }

    async fn upsert_c2pa_provenance(
        &self,
        input: port::NewNewsC2paProvenance,
    ) -> port::NewsRepositoryResult<()> {
        NewsProfessionalRepository::upsert_c2pa_provenance(
            self,
            records::NewNewsC2paProvenance {
                id: input.id,
                tenant_id: input.tenant_id,
                item_id: input.item_id,
                media_id: input.media_id,
                provenance_status: input.provenance_status,
                manifest_uri: input.manifest_uri,
                manifest_hash: input.manifest_hash,
                signer: input.signer,
                now: input.now,
            },
        )
        .await
        .map_err(repository_error)
    }
}
