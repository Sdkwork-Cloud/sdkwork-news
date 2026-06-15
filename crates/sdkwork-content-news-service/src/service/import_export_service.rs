use crate::repository::professional_repository::{NewsProfessionalRepository, NewNewsImportJob, NewNewsExportJob};

pub struct NewsImportExportService {
    repo: NewsProfessionalRepository,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ImportNinjsCommand {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub source_id: Option<String>,
    pub provider: Option<String>,
    pub payload: String,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ImportNewsmlG2Command {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub source_id: Option<String>,
    pub provider: Option<String>,
    pub payload: String,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExportCommand {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub format: String,
    pub filter_json: Option<String>,
    pub destination_uri: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ImportExportResult {
    pub id: String,
    pub status: String,
    pub item_count: i64,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ImportExportError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for ImportExportError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for ImportExportError {}

impl NewsImportExportService {
    pub fn new(repo: NewsProfessionalRepository) -> Self {
        Self { repo }
    }

    pub fn validate_import_ninjs(
        &self,
        command: &ImportNinjsCommand,
    ) -> Result<(), ImportExportError> {
        if command.tenant_id.trim().is_empty() {
            return Err(ImportExportError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.payload.trim().is_empty() {
            return Err(ImportExportError {
                code: "validation/missing-payload",
                message: "payload is required".to_string(),
            });
        }
        Ok(())
    }

    pub async fn import_ninjs(
        &self,
        command: ImportNinjsCommand,
        now: &str,
    ) -> Result<ImportExportResult, ImportExportError> {
        self.validate_import_ninjs(&command)?;

        let payload_hash = Self::compute_payload_hash(&command.payload);
        let idempotency_key =
            Self::compute_idempotency_key(&command.tenant_id, "ninjs", &payload_hash);
        let id = uuid::Uuid::new_v4().to_string();

        let input = NewNewsImportJob {
            id: id.clone(),
            tenant_id: command.tenant_id,
            organization_id: command.organization_id.unwrap_or_default(),
            source_id: command.source_id,
            import_format: "ninjs".to_string(),
            provider: command.provider.unwrap_or_else(|| "manual".to_string()),
            idempotency_key,
            provider_payload_hash: payload_hash,
            now: now.to_string(),
        };

        self.repo
            .create_import_job(input)
            .await
            .map_err(|e| ImportExportError {
                code: "storage/error",
                message: e.to_string(),
            })?;

        Ok(ImportExportResult {
            id,
            status: "pending".to_string(),
            item_count: 0,
            message: Some("Import job created successfully".to_string()),
        })
    }

    pub fn validate_import_newsml_g2(
        &self,
        command: &ImportNewsmlG2Command,
    ) -> Result<(), ImportExportError> {
        if command.tenant_id.trim().is_empty() {
            return Err(ImportExportError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.payload.trim().is_empty() {
            return Err(ImportExportError {
                code: "validation/missing-payload",
                message: "payload is required".to_string(),
            });
        }
        Ok(())
    }

    pub async fn import_newsml_g2(
        &self,
        command: ImportNewsmlG2Command,
        now: &str,
    ) -> Result<ImportExportResult, ImportExportError> {
        self.validate_import_newsml_g2(&command)?;

        let payload_hash = Self::compute_payload_hash(&command.payload);
        let idempotency_key =
            Self::compute_idempotency_key(&command.tenant_id, "newsml_g2", &payload_hash);
        let id = uuid::Uuid::new_v4().to_string();

        let input = NewNewsImportJob {
            id: id.clone(),
            tenant_id: command.tenant_id,
            organization_id: command.organization_id.unwrap_or_default(),
            source_id: command.source_id,
            import_format: "newsml_g2".to_string(),
            provider: command.provider.unwrap_or_else(|| "manual".to_string()),
            idempotency_key,
            provider_payload_hash: payload_hash,
            now: now.to_string(),
        };

        self.repo
            .create_import_job(input)
            .await
            .map_err(|e| ImportExportError {
                code: "storage/error",
                message: e.to_string(),
            })?;

        Ok(ImportExportResult {
            id,
            status: "pending".to_string(),
            item_count: 0,
            message: Some("Import job created successfully".to_string()),
        })
    }

    pub fn validate_export(&self, command: &ExportCommand) -> Result<(), ImportExportError> {
        if command.tenant_id.trim().is_empty() {
            return Err(ImportExportError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if !["ninjs", "schema_org", "newsml_g2"].contains(&command.format.as_str()) {
            return Err(ImportExportError {
                code: "validation/unsupported-format",
                message: format!("unsupported export format: {}", command.format),
            });
        }
        Ok(())
    }

    pub async fn export_data(
        &self,
        command: ExportCommand,
        now: &str,
    ) -> Result<ImportExportResult, ImportExportError> {
        self.validate_export(&command)?;

        let id = uuid::Uuid::new_v4().to_string();

        let input = NewNewsExportJob {
            id: id.clone(),
            tenant_id: command.tenant_id,
            organization_id: command.organization_id.unwrap_or_default(),
            export_format: command.format,
            filter_json: command.filter_json,
            destination_uri: command.destination_uri,
            requested_by_user_id: command.actor_user_id,
            now: now.to_string(),
        };

        self.repo
            .create_export_job(input)
            .await
            .map_err(|e| ImportExportError {
                code: "storage/error",
                message: e.to_string(),
            })?;

        Ok(ImportExportResult {
            id,
            status: "pending".to_string(),
            item_count: 0,
            message: Some("Export job created successfully".to_string()),
        })
    }

    pub fn compute_payload_hash(payload: &str) -> String {
        let mut hash: u64 = 0xcbf29ce484222325;
        for byte in payload.bytes() {
            hash ^= byte as u64;
            hash = hash.wrapping_mul(0x100000001b3);
        }
        format!("{:016x}", hash)
    }

    pub fn compute_idempotency_key(tenant_id: &str, format: &str, payload_hash: &str) -> String {
        format!("import_{}_{}_{}", tenant_id, format, payload_hash)
    }
}
