use crate::repository::professional_repository::NewsProfessionalRepository;

pub struct NewsMediaAttachmentService {
    repo: NewsProfessionalRepository,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AttachDriveMediaCommand {
    pub tenant_id: String,
    pub item_id: String,
    pub media_id: String,
    pub media_role: Option<String>,
    pub sort_order: Option<i64>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MediaResult {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MediaError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for MediaError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for MediaError {}

const VALID_MEDIA_ROLES: &[&str] = &[
    "hero",
    "thumbnail",
    "inline",
    "gallery",
    "video",
    "audio",
    "document",
    "embed",
];

impl NewsMediaAttachmentService {
    pub fn new(repo: NewsProfessionalRepository) -> Self {
        Self { repo }
    }

    pub fn validate_attach_drive_media(
        &self,
        command: &AttachDriveMediaCommand,
    ) -> Result<(), MediaError> {
        if command.tenant_id.trim().is_empty() {
            return Err(MediaError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.item_id.trim().is_empty() {
            return Err(MediaError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        if command.media_id.trim().is_empty() {
            return Err(MediaError {
                code: "validation/missing-media",
                message: "media_id is required (must be a Drive reference)".to_string(),
            });
        }
        if let Some(ref role) = command.media_role {
            if !VALID_MEDIA_ROLES.contains(&role.as_str()) {
                return Err(MediaError {
                    code: "validation/invalid-media-role",
                    message: format!(
                        "media_role must be one of: {}",
                        VALID_MEDIA_ROLES.join(", ")
                    ),
                });
            }
        }
        Ok(())
    }

    pub fn validate_resolve_media(&self, media_id: &str) -> Result<(), MediaError> {
        if media_id.trim().is_empty() {
            return Err(MediaError {
                code: "validation/missing-media",
                message: "media_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_media_reference(media_id: &str) -> bool {
        !media_id.trim().is_empty() && !media_id.starts_with("http")
    }

    pub fn repo(&self) -> &NewsProfessionalRepository {
        &self.repo
    }
}
