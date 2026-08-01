use std::sync::Arc;

use async_trait::async_trait;

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
pub struct NewsRepositoryError {
    pub message: String,
}

impl NewsRepositoryError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl std::fmt::Display for NewsRepositoryError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(&self.message)
    }
}

impl std::error::Error for NewsRepositoryError {}

pub type NewsRepositoryResult<T> = Result<T, NewsRepositoryError>;
pub type SharedNewsProfessionalRepository = Arc<dyn NewsProfessionalRepositoryPort>;

pub fn shared_news_professional_repository<R>(repository: R) -> SharedNewsProfessionalRepository
where
    R: NewsProfessionalRepositoryPort + 'static,
{
    Arc::new(repository)
}

#[async_trait]
pub trait NewsProfessionalRepositoryPort: Send + Sync {
    async fn create_story(&self, input: NewNewsStory) -> NewsRepositoryResult<NewsStoredStory>;

    async fn retrieve_story(
        &self,
        tenant_id: &str,
        story_id: &str,
    ) -> NewsRepositoryResult<Option<NewsStoredStory>>;

    async fn list_stories(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> NewsRepositoryResult<Vec<NewsStoredStory>>;

    async fn update_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        title: &str,
        summary: &str,
        expected_version: i64,
        now: &str,
    ) -> NewsRepositoryResult<bool>;

    async fn delete_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> NewsRepositoryResult<()>;

    async fn publish_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> NewsRepositoryResult<()>;

    async fn attach_story_item(&self, input: NewNewsStoryItem) -> NewsRepositoryResult<()>;

    async fn create_assignment(
        &self,
        input: NewNewsEditorialAssignment,
    ) -> NewsRepositoryResult<()>;

    async fn update_assignment(
        &self,
        tenant_id: &str,
        assignment_id: &str,
        status: &str,
        now: &str,
    ) -> NewsRepositoryResult<()>;

    async fn create_review_task(&self, input: NewNewsReviewTask) -> NewsRepositoryResult<()>;

    async fn update_review_task(
        &self,
        tenant_id: &str,
        task_id: &str,
        decision: &str,
        decision_reason: Option<&str>,
        now: &str,
    ) -> NewsRepositoryResult<()>;

    async fn create_import_job(&self, input: NewNewsImportJob) -> NewsRepositoryResult<()>;

    async fn create_export_job(&self, input: NewNewsExportJob) -> NewsRepositoryResult<()>;

    async fn upsert_item_rights(&self, input: NewNewsItemRights) -> NewsRepositoryResult<()>;

    async fn upsert_c2pa_provenance(
        &self,
        input: NewNewsC2paProvenance,
    ) -> NewsRepositoryResult<()>;
}
