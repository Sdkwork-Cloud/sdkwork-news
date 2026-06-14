use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DatabaseEngine {
    Sqlite,
    Postgres,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub engine: DatabaseEngine,
    pub url: String,
    pub max_connections: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuntimeConfigProfile {
    Server,
    Desktop,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RuntimeConfigLocation {
    pub config_file: PathBuf,
    pub data_directory: PathBuf,
}

#[derive(Debug, Deserialize)]
struct RuntimeConfigFile {
    database: RuntimeDatabaseConfig,
}

#[derive(Debug, Deserialize)]
struct RuntimeDatabaseConfig {
    engine: Option<String>,
    url: Option<String>,
    host: Option<String>,
    port: Option<u16>,
    database: Option<String>,
    username: Option<String>,
    password: Option<String>,
    password_file: Option<String>,
    ssl_mode: Option<String>,
    max_connections: Option<u32>,
}

impl DatabaseConfig {
    pub const DEFAULT_MAX_CONNECTIONS: u32 = 16;
    pub const DESKTOP_SQLITE_DEFAULT_MAX_CONNECTIONS: u32 = 8;
    pub const ENV_CONFIG_FILE: &'static str = "SDKWORK_NEWS_CONFIG_FILE";
    pub const SERVER_DEFAULT_POSTGRES_HOST: &'static str = "db.example.com";
    pub const SERVER_DEFAULT_POSTGRES_PORT: u16 = 5432;
    pub const SERVER_DEFAULT_POSTGRES_DATABASE: &'static str = "sdkwork_news_prod";
    pub const SERVER_DEFAULT_POSTGRES_USERNAME: &'static str = "sdkworknews@2026++";
    pub const SERVER_DEFAULT_POSTGRES_PASSWORD: &'static str = "change-me";
    pub const SERVER_DEFAULT_POSTGRES_SSL_MODE: &'static str = "require";

    pub fn from_url(url: impl Into<String>) -> Result<Self, String> {
        Self::from_url_with_max_connections(url, Self::DEFAULT_MAX_CONNECTIONS)
    }

    pub fn from_url_with_max_connections(
        url: impl Into<String>,
        max_connections: u32,
    ) -> Result<Self, String> {
        if max_connections == 0 {
            return Err("database max connections must be greater than zero".to_owned());
        }

        let url = url.into();
        let engine = DatabaseEngine::from_url(&url)?;
        Ok(Self {
            engine,
            url,
            max_connections,
        })
    }

    pub fn from_optional_parts(
        database_url: Option<String>,
        max_connections: Option<String>,
    ) -> Result<Option<Self>, String> {
        let Some(database_url) = database_url else {
            return Ok(None);
        };

        let max_connections = match max_connections {
            Some(value) => value.parse::<u32>().map_err(|_| {
                format!("SDKWORK_NEWS_DATABASE_MAX_CONNECTIONS must be a positive integer: {value}")
            })?,
            None => Self::DEFAULT_MAX_CONNECTIONS,
        };

        Self::from_url_with_max_connections(database_url, max_connections).map(Some)
    }

    pub fn from_env() -> Result<Option<Self>, String> {
        let env_config = Self::from_optional_parts(
            std::env::var("SDKWORK_NEWS_DATABASE_URL").ok(),
            std::env::var("SDKWORK_NEWS_DATABASE_MAX_CONNECTIONS").ok(),
        )?;
        if env_config.is_some() {
            return Ok(env_config);
        }

        if let Some(config_file) = explicit_runtime_config_file() {
            return Self::from_config_file(config_file);
        }

        let location =
            RuntimeConfigLocation::for_current_platform(runtime_config_profile_from_env());
        if location.config_file.exists() {
            return Self::from_config_file(location.config_file);
        }

        Ok(None)
    }

    pub fn from_env_or_initialize() -> Result<Option<Self>, String> {
        let profile = RuntimeConfigProfile::from_env();
        let location = Self::runtime_config_location_from_env(profile);
        let env_config = Self::from_optional_parts(
            std::env::var("SDKWORK_NEWS_DATABASE_URL").ok(),
            std::env::var("SDKWORK_NEWS_DATABASE_MAX_CONNECTIONS").ok(),
        )?;
        if let Some(config) = env_config {
            return Ok(Some(config));
        }

        let report = Self::initialize_default_runtime_config_at(profile, &location)?;
        Ok(Some(report.database))
    }

    pub fn runtime_config_location_from_env(
        profile: RuntimeConfigProfile,
    ) -> RuntimeConfigLocation {
        let default_location = RuntimeConfigLocation::for_current_platform(profile);
        if let Some(config_file) = explicit_runtime_config_file() {
            let data_directory = config_file
                .parent()
                .filter(|path| !path.as_os_str().is_empty())
                .map(|path| path.join("Data"))
                .unwrap_or_else(|| default_location.data_directory.clone());
            RuntimeConfigLocation {
                config_file,
                data_directory,
            }
        } else {
            default_location
        }
    }

    pub fn initialize_default_runtime_config(
        profile: RuntimeConfigProfile,
    ) -> Result<RuntimeConfigInitializationReport, String> {
        let location = Self::runtime_config_location_from_env(profile);
        Self::initialize_default_runtime_config_at(profile, &location)
    }

    pub fn initialize_default_runtime_config_at(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<RuntimeConfigInitializationReport, String> {
        if location.config_file.exists() {
            let database = Self::from_config_file(&location.config_file)?.ok_or_else(|| {
                format!(
                    "runtime TOML {} did not contain a database configuration",
                    location.config_file.display()
                )
            })?;
            return Ok(RuntimeConfigInitializationReport {
                profile,
                location: location.clone(),
                action: RuntimeConfigInitializationAction::Existing,
                database,
            });
        }

        if let Some(parent) = location
            .config_file
            .parent()
            .filter(|path| !path.as_os_str().is_empty())
        {
            std::fs::create_dir_all(parent).map_err(|error| {
                format!(
                    "failed to create runtime config directory {}: {error}",
                    parent.display()
                )
            })?;
        }
        std::fs::create_dir_all(&location.data_directory).map_err(|error| {
            format!(
                "failed to create runtime data directory {}: {error}",
                location.data_directory.display()
            )
        })?;

        let database = Self::default_runtime_database_config(profile, location)?;
        let content = Self::default_runtime_config_toml(profile, location)?;
        std::fs::write(&location.config_file, content).map_err(|error| {
            format!(
                "failed to write runtime TOML {}: {error}",
                location.config_file.display()
            )
        })?;

        Ok(RuntimeConfigInitializationReport {
            profile,
            location: location.clone(),
            action: RuntimeConfigInitializationAction::Created,
            database,
        })
    }

    pub fn default_runtime_config_toml(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<String, String> {
        let database = Self::default_runtime_database_config(profile, location)?;
        let engine = match database.engine {
            DatabaseEngine::Sqlite => "sqlite",
            DatabaseEngine::Postgres => "postgresql",
        };
        let deployment_mode = match profile {
            RuntimeConfigProfile::Server => "server",
            RuntimeConfigProfile::Desktop => "desktop",
        };
        let mut lines = vec![
            "# SdkWork News runtime configuration.".to_owned(),
            "# This file was initialized automatically; edit [database] for the target environment.".to_owned(),
            format!(
                "# Runtime config file: {}",
                location.config_file.display()
            ),
            String::new(),
        ];
        if profile == RuntimeConfigProfile::Server {
            lines.push(
                "# Server/service deployments use external PostgreSQL by default.".to_owned(),
            );
            lines.push(String::new());
        } else {
            lines.push("# Desktop deployments default to a local SQLite database.".to_owned());
            lines.push(format!(
                "# Default SQLite file: {}",
                location.sqlite_database_path().display()
            ));
            lines.push(String::new());
        }
        lines.extend(["[database]".to_owned(), format!("engine = \"{engine}\"")]);
        if database.engine == DatabaseEngine::Postgres {
            lines.extend([
                format!("host = \"{}\"", Self::SERVER_DEFAULT_POSTGRES_HOST),
                format!("port = {}", Self::SERVER_DEFAULT_POSTGRES_PORT),
                format!("database = \"{}\"", Self::SERVER_DEFAULT_POSTGRES_DATABASE),
                format!("username = \"{}\"", Self::SERVER_DEFAULT_POSTGRES_USERNAME),
                format!(
                    "# password = \"{}\"",
                    Self::SERVER_DEFAULT_POSTGRES_PASSWORD
                ),
                format!("ssl_mode = \"{}\"", Self::SERVER_DEFAULT_POSTGRES_SSL_MODE),
                format!("max_connections = {}", database.max_connections),
            ]);
        } else {
            lines.extend([
                format!("url = \"{}\"", portable_path(&PathBuf::from(&database.url))),
                format!("max_connections = {}", database.max_connections),
            ]);
        }
        lines.extend([
            String::new(),
            "[paths]".to_owned(),
            format!(
                "data_directory = \"{}\"",
                portable_path(&location.data_directory)
            ),
            String::new(),
            "[runtime]".to_owned(),
            format!("deployment_mode = \"{deployment_mode}\""),
            String::new(),
        ]);
        Ok(lines.join("\n"))
    }

    pub fn default_runtime_database_config(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<Self, String> {
        match profile {
            RuntimeConfigProfile::Server => Self::from_url_with_max_connections(
                format!(
                    "postgresql://{}:{}@{}:{}/{}?sslmode={}",
                    Self::SERVER_DEFAULT_POSTGRES_USERNAME,
                    Self::SERVER_DEFAULT_POSTGRES_PASSWORD,
                    Self::SERVER_DEFAULT_POSTGRES_HOST,
                    Self::SERVER_DEFAULT_POSTGRES_PORT,
                    Self::SERVER_DEFAULT_POSTGRES_DATABASE,
                    Self::SERVER_DEFAULT_POSTGRES_SSL_MODE
                ),
                Self::DEFAULT_MAX_CONNECTIONS,
            ),
            RuntimeConfigProfile::Desktop => Self::from_url_with_max_connections(
                format!(
                    "sqlite://{}",
                    portable_path(&location.sqlite_database_path())
                ),
                Self::DESKTOP_SQLITE_DEFAULT_MAX_CONNECTIONS,
            ),
        }
    }

    pub fn from_config_file(path: impl AsRef<Path>) -> Result<Option<Self>, String> {
        let path = path.as_ref();
        let content = std::fs::read_to_string(path)
            .map_err(|error| format!("failed to read {}: {error}", path.display()))?;
        Self::from_runtime_config_toml(&content).map(Some)
    }

    pub fn from_runtime_config_toml(content: &str) -> Result<Self, String> {
        let runtime_config: RuntimeConfigFile = toml::from_str(content)
            .map_err(|error| format!("invalid runtime config TOML: {error}"))?;
        let database = runtime_config.database;
        let max_connections = database
            .max_connections
            .unwrap_or(Self::DEFAULT_MAX_CONNECTIONS);
        let declared_engine = database
            .engine
            .as_deref()
            .map(normalize_database_engine_name)
            .transpose()?;
        let url = runtime_database_url(database, declared_engine.as_deref())?;

        let config = Self::from_url_with_max_connections(url, max_connections)?;
        if let Some(engine) = declared_engine {
            let expected = match config.engine {
                DatabaseEngine::Sqlite => "sqlite",
                DatabaseEngine::Postgres => "postgresql",
            };
            if engine != expected {
                return Err(format!(
                    "runtime config [database].engine {engine} does not match database url scheme {expected}"
                ));
            }
        }
        Ok(config)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuntimeConfigInitializationAction {
    Existing,
    Created,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RuntimeConfigInitializationReport {
    pub profile: RuntimeConfigProfile,
    pub location: RuntimeConfigLocation,
    pub action: RuntimeConfigInitializationAction,
    pub database: DatabaseConfig,
}

impl DatabaseEngine {
    pub fn from_url(url: &str) -> Result<Self, String> {
        let normalized = url.trim().to_ascii_lowercase();
        if normalized.is_empty() {
            return Err("database url must not be empty".to_owned());
        }
        if normalized.starts_with("sqlite:") {
            return Ok(Self::Sqlite);
        }
        if normalized.starts_with("postgres://") || normalized.starts_with("postgresql://") {
            return Ok(Self::Postgres);
        }
        Err(format!("unsupported database url scheme: {url}"))
    }
}

impl RuntimeConfigProfile {
    pub fn from_env() -> Self {
        let deployment_mode = std::env::var("SDKWORK_NEWS_DEPLOYMENT_MODE")
            .ok()
            .unwrap_or_else(|| "server".to_owned());
        match deployment_mode.trim().to_ascii_lowercase().as_str() {
            "desktop" => Self::Desktop,
            _ => Self::Server,
        }
    }
}

impl RuntimeConfigLocation {
    pub fn for_current_platform(profile: RuntimeConfigProfile) -> Self {
        let platform = if cfg!(windows) {
            "windows"
        } else if cfg!(target_os = "macos") {
            "macos"
        } else {
            "linux"
        };
        Self::for_platform(platform, profile)
    }

    pub fn for_platform(platform: &str, profile: RuntimeConfigProfile) -> Self {
        match (normalize_platform(platform).as_str(), profile) {
            ("windows", RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from("%ProgramData%/sdkwork/news/news.toml"),
                data_directory: PathBuf::from("%ProgramData%/sdkwork/news/Data"),
            },
            ("windows", RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from("%USERPROFILE%/.sdkwork/news/config/news.toml"),
                data_directory: PathBuf::from("%USERPROFILE%/.sdkwork/news/data"),
            },
            ("macos", RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from(
                    "/Library/Application Support/sdkwork/news/news.toml",
                ),
                data_directory: PathBuf::from("/Library/Application Support/sdkwork/news/Data"),
            },
            ("macos", RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from("~/.sdkwork/news/config/news.toml"),
                data_directory: PathBuf::from("~/.sdkwork/news/data"),
            },
            (_, RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from("/etc/sdkwork/news/news.toml"),
                data_directory: PathBuf::from("/var/lib/sdkwork/news"),
            },
            (_, RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from("~/.sdkwork/news/config/news.toml"),
                data_directory: PathBuf::from("~/.sdkwork/news/data"),
            },
        }
    }

    pub fn sqlite_database_path(&self) -> PathBuf {
        PathBuf::from(format!(
            "{}/news.sqlite",
            self.data_directory.to_string_lossy()
        ))
    }
}

fn normalize_database_engine_name(value: &str) -> Result<String, String> {
    match value.trim().to_ascii_lowercase().as_str() {
        "sqlite" => Ok("sqlite".to_owned()),
        "postgres" | "postgresql" => Ok("postgresql".to_owned()),
        other => Err(format!(
            "unsupported runtime config [database].engine: {other}"
        )),
    }
}

fn runtime_database_url(
    database: RuntimeDatabaseConfig,
    declared_engine: Option<&str>,
) -> Result<String, String> {
    if let Some(url) = database.url.as_ref() {
        let url = url.trim().to_owned();
        if url.is_empty() {
            return Err("runtime config [database].url must not be blank".to_owned());
        }
        if has_structured_postgres_fields(&database) {
            return Err(
                "runtime config [database] must use either url or structured PostgreSQL fields, not both"
                    .to_owned(),
            );
        }
        return Ok(url);
    }

    match declared_engine {
        Some("postgresql") => structured_postgres_url(database),
        Some("sqlite") => Err(
            "runtime config [database].url is required when [database].engine is sqlite"
                .to_owned(),
        ),
        Some(other) => Err(format!(
            "runtime config [database].engine {other} is not supported"
        )),
        None => Err(
            "runtime config [database] must declare either url or structured PostgreSQL fields with engine = \"postgresql\""
                .to_owned(),
        ),
    }
}

fn has_structured_postgres_fields(database: &RuntimeDatabaseConfig) -> bool {
    database.host.is_some()
        || database.port.is_some()
        || database.database.is_some()
        || database.username.is_some()
        || database.password.is_some()
        || database.password_file.is_some()
        || database.ssl_mode.is_some()
}

fn structured_postgres_url(database: RuntimeDatabaseConfig) -> Result<String, String> {
    let host = database
        .host
        .ok_or("runtime config [database].host is required")?;
    let port = database.port.unwrap_or(5432);
    let database_name = database
        .database
        .ok_or("runtime config [database].database is required")?;
    let username = database
        .username
        .ok_or("runtime config [database].username is required")?;
    let password = database
        .password
        .or_else(|| {
            database.password_file.and_then(|path| {
                std::fs::read_to_string(&path)
                    .ok()
                    .map(|s| s.trim().to_owned())
            })
        })
        .ok_or("runtime config [database] must provide password or password_file for PostgreSQL")?;

    let ssl_mode = database
        .ssl_mode
        .unwrap_or_else(|| "require".to_owned());

    Ok(format!(
        "postgresql://{}:{}@{}:{}/{}?sslmode={}",
        username, password, host, port, database_name, ssl_mode
    ))
}

fn normalize_platform(platform: &str) -> String {
    match platform.trim().to_ascii_lowercase().as_str() {
        "win32" | "windows" => "windows".to_owned(),
        "darwin" | "mac" | "macos" => "macos".to_owned(),
        _ => "linux".to_owned(),
    }
}

fn portable_path(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn explicit_runtime_config_file() -> Option<PathBuf> {
    std::env::var(DatabaseConfig::ENV_CONFIG_FILE)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .map(PathBuf::from)
}

fn runtime_config_profile_from_env() -> RuntimeConfigProfile {
    RuntimeConfigProfile::from_env()
}
