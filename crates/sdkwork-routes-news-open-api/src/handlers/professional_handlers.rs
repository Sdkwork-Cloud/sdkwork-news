pub struct NewsProfessionalOpenApiHandler;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetrieveStoryRequest {
    pub tenant_id: String,
    pub story_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetrieveSchemaOrgRequest {
    pub tenant_id: String,
    pub item_id: String,
    pub schema_type: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OpenApiStoryResponse {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub story_type: String,
    pub status: String,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OpenApiSchemaOrgResponse {
    pub item_id: String,
    pub schema_type: String,
    pub json_ld: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OpenApiError {
    pub status: i32,
    pub title: String,
    pub detail: String,
}

impl std::fmt::Display for OpenApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}] {}: {}", self.status, self.title, self.detail)
    }
}

impl std::error::Error for OpenApiError {}

impl NewsProfessionalOpenApiHandler {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_retrieve_story(
        &self,
        request: &RetrieveStoryRequest,
    ) -> Result<(), OpenApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(OpenApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.story_id.trim().is_empty() {
            return Err(OpenApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "story_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_retrieve_schema_org(
        &self,
        request: &RetrieveSchemaOrgRequest,
    ) -> Result<(), OpenApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(OpenApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.item_id.trim().is_empty() {
            return Err(OpenApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "item_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn filter_story_for_public(story: &OpenApiStoryResponse) -> OpenApiStoryResponse {
        OpenApiStoryResponse {
            id: story.id.clone(),
            tenant_id: story.tenant_id.clone(),
            slug: story.slug.clone(),
            title: story.title.clone(),
            summary: story.summary.clone(),
            story_type: story.story_type.clone(),
            status: story.status.clone(),
            published_at: story.published_at.clone(),
        }
    }

    pub fn build_cache_headers(is_published: bool) -> &'static str {
        if is_published {
            "public, max-age=300, stale-while-revalidate=60"
        } else {
            "private, no-cache"
        }
    }
}

impl Default for NewsProfessionalOpenApiHandler {
    fn default() -> Self {
        Self::new()
    }
}
