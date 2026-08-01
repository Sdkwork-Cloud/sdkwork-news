export interface AiStoreBootstrapConfig {
  appStoreApplicationPublicHttpUrl: string;
  mcpApplicationPublicHttpUrl: string;
  skillsApplicationPublicHttpUrl: string;
}

export interface AiStoreBootstrapResolution {
  config?: AiStoreBootstrapConfig;
  mode: "demo" | "sdk";
}

export type AiStoreRuntimeEnvironment = Readonly<Record<string, unknown>>;

export function resolveAiStoreBootstrap(
  environment: AiStoreRuntimeEnvironment,
): AiStoreBootstrapResolution {
  const lifecycle = resolveLifecycle(environment);
  const demoMode = readBoolean(environment.VITE_SDKWORK_NEWS_DEMO_MODE);
  if (demoMode === true) {
    if (lifecycle !== "development" && lifecycle !== "test") {
      throw new Error("SDKWork News demo mode is allowed only in development or test.");
    }
    return { mode: "demo" };
  }

  const gateway = readString(
    environment.VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL,
  );
  const appStoreUrl = readString(
    environment.VITE_SDKWORK_APPSTORE_APPLICATION_PUBLIC_HTTP_URL,
  ) ?? gateway;
  const skillsUrl = readString(
    environment.VITE_SDKWORK_SKILLS_APPLICATION_PUBLIC_HTTP_URL,
  ) ?? gateway;
  const mcpUrl = readString(
    environment.VITE_SDKWORK_MCP_APPLICATION_PUBLIC_HTTP_URL,
  ) ?? gateway;

  if (!appStoreUrl || !skillsUrl || !mcpUrl) {
    if (demoMode !== false && lifecycle === "development") {
      return { mode: "demo" };
    }
    throw new Error(
      "SDKWork News AI Store requires AppStore, Skills, and MCP application public HTTP URLs or a platform gateway URL.",
    );
  }

  return {
    config: {
      appStoreApplicationPublicHttpUrl: normalizeHttpUrl(appStoreUrl, "AppStore"),
      mcpApplicationPublicHttpUrl: normalizeHttpUrl(mcpUrl, "MCP"),
      skillsApplicationPublicHttpUrl: normalizeHttpUrl(skillsUrl, "Skills"),
    },
    mode: "sdk",
  };
}

function resolveLifecycle(environment: AiStoreRuntimeEnvironment) {
  const configured = readString(environment.VITE_SDKWORK_NEWS_ENVIRONMENT)
    ?? readString(environment.MODE);
  if (configured) {
    const normalized = configured.toLowerCase();
    if (["development", "production", "staging", "test"].includes(normalized)) {
      return normalized;
    }
    throw new Error(
      "VITE_SDKWORK_NEWS_ENVIRONMENT must be development, test, staging, or production.",
    );
  }
  return environment.PROD === true || environment.PROD === "true"
    ? "production"
    : "development";
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  if (value === true || value === "true") {
    return true;
  }
  if (value === false || value === "false") {
    return false;
  }
  if (value === undefined || value === "") {
    return undefined;
  }
  throw new Error("VITE_SDKWORK_NEWS_DEMO_MODE must be true or false when configured.");
}

function normalizeHttpUrl(value: string, label: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} application public HTTP URL must be absolute.`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label} application public HTTP URL uses an unsupported protocol.`);
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(
      `${label} application public HTTP URL must not contain credentials, a query, or a fragment.`,
    );
  }
  return value.replace(/\/+$/u, "");
}
