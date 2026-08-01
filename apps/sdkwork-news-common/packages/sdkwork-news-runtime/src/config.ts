export type NewsRuntimeLifecycleEnvironment =
  | "development"
  | "production"
  | "staging"
  | "test";

export interface NewsFeedBootstrapConfig {
  newsApplicationPublicHttpUrl: string;
}

export interface NewsFeedBootstrapResolution {
  config?: NewsFeedBootstrapConfig;
  mode: "demo" | "sdk";
}

export type NewsRuntimeEnvironment = Readonly<Record<string, unknown>>;

const NEWS_APPLICATION_PUBLIC_HTTP_URL =
  "VITE_SDKWORK_NEWS_APPLICATION_PUBLIC_HTTP_URL";
const PLATFORM_GATEWAY_HTTP_URL =
  "VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL";

export function resolveNewsFeedBootstrap(
  environment: NewsRuntimeEnvironment,
): NewsFeedBootstrapResolution {
  const lifecycleEnvironment = resolveLifecycleEnvironment(environment);
  const demoMode = readBoolean(environment.VITE_SDKWORK_NEWS_DEMO_MODE);
  if (demoMode === true) {
    if (lifecycleEnvironment !== "development" && lifecycleEnvironment !== "test") {
      throw new Error("SDKWork News demo mode is allowed only in development or test.");
    }
    return { mode: "demo" };
  }

  const configuredUrl = readString(environment[NEWS_APPLICATION_PUBLIC_HTTP_URL])
    ?? readString(environment[PLATFORM_GATEWAY_HTTP_URL]);
  if (!configuredUrl) {
    if (demoMode !== false && lifecycleEnvironment === "development") {
      return { mode: "demo" };
    }
    throw new Error(
      "SDKWork News requires the News application public HTTP URL or platform gateway URL.",
    );
  }

  return {
    config: {
      newsApplicationPublicHttpUrl: normalizeHttpUrl(configuredUrl),
    },
    mode: "sdk",
  };
}

function resolveLifecycleEnvironment(
  environment: NewsRuntimeEnvironment,
): NewsRuntimeLifecycleEnvironment {
  const configured = readString(environment.VITE_SDKWORK_NEWS_ENVIRONMENT)
    ?? readString(environment.MODE);
  if (configured) {
    const normalized = configured.toLowerCase();
    if (
      normalized === "development"
      || normalized === "production"
      || normalized === "staging"
      || normalized === "test"
    ) {
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

function normalizeHttpUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("News application public HTTP URL must be absolute.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("News application public HTTP URL uses an unsupported protocol.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(
      "News application public HTTP URL must not contain credentials, a query, or a fragment.",
    );
  }
  return value.replace(/\/+$/u, "");
}
