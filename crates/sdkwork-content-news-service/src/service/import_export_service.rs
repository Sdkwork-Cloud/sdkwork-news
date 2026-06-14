pub struct NewsImportExportService;

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
    pub fn new() -> Self {
        Self
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

impl Default for NewsImportExportService {
    fn default() -> Self {
        Self::new()
    }
}
