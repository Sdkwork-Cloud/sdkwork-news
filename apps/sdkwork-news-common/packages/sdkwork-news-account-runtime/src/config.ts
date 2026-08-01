export type NewsIamDeploymentMode = "local" | "private" | "saas";
export type NewsIamEnvironment = "dev" | "prod" | "test";

export interface NewsAccountBootstrapConfig {
  appId: string;
  deploymentMode: NewsIamDeploymentMode;
  environment: NewsIamEnvironment;
  iamApplicationPublicHttpUrl: string;
}

export interface NewsAccountBootstrapResolution {
  config?: NewsAccountBootstrapConfig;
  mode: "demo" | "sdk";
}

export type NewsAccountRuntimeEnvironment = Readonly<Record<string, unknown>>;

export function resolveNewsAccountBootstrap(
  environment: NewsAccountRuntimeEnvironment,
): NewsAccountBootstrapResolution {
  const lifecycle = resolveLifecycle(environment);
  const demoMode = readBoolean(environment.VITE_SDKWORK_NEWS_DEMO_MODE);
  if (demoMode === true) {
    if (lifecycle !== "development" && lifecycle !== "test") {
      throw new Error("SDKWork News demo mode is allowed only in development or test.");
    }
    return { mode: "demo" };
  }

  const iamUrl = readString(
    environment.VITE_SDKWORK_IAM_APPLICATION_PUBLIC_HTTP_URL,
  ) ?? readString(environment.VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL);
  if (!iamUrl) {
    if (demoMode !== false && lifecycle === "development") {
      return { mode: "demo" };
    }
    throw new Error(
      "SDKWork News Account requires the IAM application public HTTP URL or platform gateway URL.",
    );
  }

  return {
    config: {
      appId: readString(environment.VITE_SDKWORK_NEWS_APP_ID) ?? "sdkwork-news",
      deploymentMode: resolveDeploymentMode(
        environment.VITE_SDKWORK_IAM_DEPLOYMENT_MODE,
        lifecycle,
      ),
      environment: lifecycle === "production" || lifecycle === "staging"
        ? "prod"
        : lifecycle === "test" ? "test" : "dev",
      iamApplicationPublicHttpUrl: normalizeHttpUrl(iamUrl),
    },
    mode: "sdk",
  };
}

function resolveLifecycle(environment: NewsAccountRuntimeEnvironment) {
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

function resolveDeploymentMode(
  value: unknown,
  lifecycle: string,
): NewsIamDeploymentMode {
  const configured = readString(value)?.toLowerCase();
  if (configured === "local" || configured === "private" || configured === "saas") {
    return configured;
  }
  if (configured) {
    throw new Error("VITE_SDKWORK_IAM_DEPLOYMENT_MODE must be local, private, or saas.");
  }
  return lifecycle === "development" || lifecycle === "test" ? "local" : "saas";
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (value === undefined || value === "") return undefined;
  throw new Error("VITE_SDKWORK_NEWS_DEMO_MODE must be true or false when configured.");
}

function normalizeHttpUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("IAM application public HTTP URL must be absolute.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("IAM application public HTTP URL uses an unsupported protocol.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(
      "IAM application public HTTP URL must not contain credentials, a query, or a fragment.",
    );
  }
  return value.replace(/\/+$/u, "");
}
