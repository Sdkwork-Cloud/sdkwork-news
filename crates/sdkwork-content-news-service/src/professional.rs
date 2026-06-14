#[derive(Clone, Debug, Eq, PartialEq)]
pub enum NewsProfessionalUseCase {
    StoryPackaging,
    EditorialWorkflow,
    TrustAndCorrections,
    ImportExport,
    MediaAttachment,
    Personalization,
    SearchProjection,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalTodoMethod {
    pub name: &'static str,
    pub todo: &'static str,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalServicePlan {
    pub domain: &'static str,
    pub capability: &'static str,
    pub use_cases: Vec<NewsProfessionalUseCase>,
    pub todo_methods: Vec<NewsProfessionalTodoMethod>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoryCommand {
    pub tenant_id: String,
    pub title: String,
    pub slug: Option<String>,
    pub summary: Option<String>,
    pub story_type: Option<String>,
    pub organization_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsImportCommand {
    pub tenant_id: String,
    pub format: String,
    pub provider: Option<String>,
    pub source_id: Option<String>,
    pub payload: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalResult {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalTodoError {
    pub message: &'static str,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalServiceError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for NewsProfessionalServiceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for NewsProfessionalServiceError {}

pub trait NewsStoryServicePort {
    fn create_story(
        &self,
        command: NewsStoryCommand,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn attach_story_item(
        &self,
        story_id: &str,
        item_id: &str,
        relation_type: &str,
        rank: i64,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn publish_story(
        &self,
        story_id: &str,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
}

pub trait NewsEditorialWorkflowServicePort {
    fn create_assignment(
        &self,
        assignee_user_id: &str,
        assignment_role: &str,
        item_id: Option<&str>,
        story_id: Option<&str>,
        due_at: Option<&str>,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn update_review_task(
        &self,
        task_id: &str,
        decision: &str,
        decision_reason: Option<&str>,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
}

pub trait NewsTrustServicePort {
    fn upsert_item_rights(
        &self,
        item_id: &str,
        rights_status: &str,
        license_code: Option<&str>,
        embargo_until: Option<&str>,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn upsert_c2pa_provenance(
        &self,
        item_id: &str,
        provenance_status: &str,
        manifest_hash: Option<&str>,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
}

pub trait NewsImportExportServicePort {
    fn import_ninjs(
        &self,
        command: NewsImportCommand,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn import_newsml_g2(
        &self,
        command: NewsImportCommand,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn export_schema_org(
        &self,
        tenant_id: &str,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
}

pub trait NewsMediaAttachmentServicePort {
    fn attach_drive_media(
        &self,
        item_id: &str,
        media_id: &str,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
    fn resolve_media_resource(
        &self,
        media_id: &str,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError>;
}

pub struct NewsProfessionalService;

impl NewsProfessionalService {
    pub fn new() -> Self {
        Self
    }

    pub fn create_story(
        &self,
        command: NewsStoryCommand,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError> {
        if command.tenant_id.is_empty() {
            return Err(NewsProfessionalServiceError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.title.trim().is_empty() {
            return Err(NewsProfessionalServiceError {
                code: "validation/missing-title",
                message: "title is required".to_string(),
            });
        }

        let slug = command.slug.unwrap_or_else(|| {
            command
                .title
                .to_ascii_lowercase()
                .replace(' ', "-")
                .chars()
                .filter(|c| c.is_alphanumeric() || *c == '-')
                .collect::<String>()
        });

        let _story_type = command
            .story_type
            .unwrap_or_else(|| "developing".to_string());
        let _organization_id = command.organization_id.unwrap_or_default();
        let _summary = command.summary.unwrap_or_default();

        let id = format!("story_{}_{}", command.tenant_id, slug);

        Ok(NewsProfessionalResult {
            id,
            status: "draft".to_string(),
            message: Some(format!(
                "Story '{}' created with slug '{}' in tenant '{}'",
                command.title, slug, command.tenant_id
            )),
        })
    }

    pub fn import_ninjs(
        &self,
        command: NewsImportCommand,
    ) -> Result<NewsProfessionalResult, NewsProfessionalServiceError> {
        if command.tenant_id.is_empty() {
            return Err(NewsProfessionalServiceError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.format != "ninjs" && command.format != "newsml-g2" {
            return Err(NewsProfessionalServiceError {
                code: "validation/unsupported-format",
                message: format!("unsupported import format: {}", command.format),
            });
        }

        let id = format!(
            "import_{}_{}_{}",
            command.tenant_id,
            command.format,
            chrono_placeholder_now()
        );

        Ok(NewsProfessionalResult {
            id,
            status: "pending".to_string(),
            message: Some(format!(
                "Import job created for format '{}' in tenant '{}'",
                command.format, command.tenant_id
            )),
        })
    }
}

impl Default for NewsProfessionalService {
    fn default() -> Self {
        Self::new()
    }
}

pub fn news_professional_service_plan() -> NewsProfessionalServicePlan {
    NewsProfessionalServicePlan {
        domain: "content",
        capability: "news",
        use_cases: vec![
            NewsProfessionalUseCase::StoryPackaging,
            NewsProfessionalUseCase::EditorialWorkflow,
            NewsProfessionalUseCase::TrustAndCorrections,
            NewsProfessionalUseCase::ImportExport,
            NewsProfessionalUseCase::MediaAttachment,
            NewsProfessionalUseCase::Personalization,
            NewsProfessionalUseCase::SearchProjection,
        ],
        todo_methods: vec![
            method(
                "create_story",
                "TODO(news-service): validate tenant context, slug uniqueness, canonical item linkage, and audit events.",
            ),
            method(
                "attach_story_item",
                "TODO(news-service): persist ranked story-item relation and rebuild story projection.",
            ),
            method(
                "publish_story",
                "TODO(news-service): publish story, rebuild public projections, and enqueue CDN invalidation.",
            ),
            method(
                "create_assignment",
                "TODO(news-service): check editor permissions and create assignment with due-date policy.",
            ),
            method(
                "update_review_task",
                "TODO(news-service): persist review decision, reason, and audit metadata.",
            ),
            method(
                "upsert_item_rights",
                "TODO(news-trust): validate license, embargo, and geography scope before persistence.",
            ),
            method(
                "upsert_c2pa_provenance",
                "TODO(news-trust): verify manifest hash and signer before updating provenance state.",
            ),
            method(
                "import_ninjs",
                "TODO(news-integration): parse ninjs, dedupe payload hash, and create normalized news facts.",
            ),
            method(
                "import_newsml_g2",
                "TODO(news-integration): parse NewsML-G2 packages and preserve provider identities.",
            ),
            method(
                "export_schema_org",
                "TODO(news-integration): export JSON-LD snapshots for public reviewed fields.",
            ),
            method(
                "attach_drive_media",
                "TODO(news-media): accept Drive references only and never persist presigned URLs.",
            ),
            method(
                "resolve_media_resource",
                "TODO(news-media): request fresh Drive grants and redact provider object keys.",
            ),
        ],
    }
}

fn method(name: &'static str, todo: &'static str) -> NewsProfessionalTodoMethod {
    NewsProfessionalTodoMethod { name, todo }
}

fn chrono_placeholder_now() -> String {
    "2026-01-01T00:00:00Z".to_string()
}
