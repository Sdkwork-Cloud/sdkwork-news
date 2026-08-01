export type NewsClientLifecycleEnvironment =
  | "development"
  | "production"
  | "staging"
  | "test";

export interface NewsAgentBootstrapConfig {
  agentsAppApiBaseUrl: string;
  imApiBaseUrl: string;
  imWebsocketBaseUrl: string;
}

export interface NewsAgentBootstrapResolution {
  config?: NewsAgentBootstrapConfig;
  mode: "demo" | "sdk";
}

export type NewsClientRuntimeEnvironment = Readonly<Record<string, unknown>>;

const AGENTS_APP_API_BASE_URL_KEYS = [
  "VITE_SDKWORK_NEWS_AGENTS_APP_API_BASE_URL",
  "VITE_SDKWORK_AGENTS_APP_API_BASE_URL",
] as const;
const IM_API_BASE_URL_KEYS = [
  "VITE_SDKWORK_NEWS_IM_API_BASE_URL",
  "VITE_SDKWORK_IM_API_BASE_URL",
] as const;
const IM_WEBSOCKET_BASE_URL_KEYS = [
  "VITE_SDKWORK_NEWS_IM_WEBSOCKET_URL",
  "VITE_SDKWORK_IM_WEBSOCKET_URL",
] as const;
const PLATFORM_GATEWAY_KEY = "VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL";

export function resolveNewsAgentBootstrap(
  environment: NewsClientRuntimeEnvironment,
): NewsAgentBootstrapResolution {
  const lifecycleEnvironment = resolveLifecycleEnvironment(environment);
  const demoMode = readBoolean(environment.VITE_SDKWORK_NEWS_DEMO_MODE);
  if (demoMode === true) {
    if (lifecycleEnvironment !== "development" && lifecycleEnvironment !== "test") {
      throw new Error("SDKWork News demo mode is allowed only in development or test.");
    }
    return { mode: "demo" };
  }

  const gatewayBaseUrl = readFirst(environment, [PLATFORM_GATEWAY_KEY]);
  const agentsAppApiBaseUrl = readFirst(environment, AGENTS_APP_API_BASE_URL_KEYS)
    ?? gatewayBaseUrl;
  const imApiBaseUrl = readFirst(environment, IM_API_BASE_URL_KEYS)
    ?? gatewayBaseUrl;

  if (!agentsAppApiBaseUrl || !imApiBaseUrl) {
    if (demoMode !== false && lifecycleEnvironment === "development") {
      return { mode: "demo" };
    }
    throw new Error(
      "SDKWork News requires Agents and IM SDK base URLs. Configure the platform gateway or the surface-specific public URL keys.",
    );
  }

  const normalizedAgentsUrl = normalizeUrl(agentsAppApiBaseUrl, ["http:", "https:"], "Agents App API");
  const normalizedImUrl = normalizeUrl(imApiBaseUrl, ["http:", "https:"], "IM API");
  const configuredWebsocketUrl = readFirst(environment, IM_WEBSOCKET_BASE_URL_KEYS);
  const normalizedWebsocketUrl = configuredWebsocketUrl
    ? normalizeUrl(configuredWebsocketUrl, ["ws:", "wss:"], "IM WebSocket")
    : deriveWebsocketBaseUrl(normalizedImUrl);

  return {
    config: {
      agentsAppApiBaseUrl: normalizedAgentsUrl,
      imApiBaseUrl: normalizedImUrl,
      imWebsocketBaseUrl: normalizedWebsocketUrl,
    },
    mode: "sdk",
  };
}

function resolveLifecycleEnvironment(
  environment: NewsClientRuntimeEnvironment,
): NewsClientLifecycleEnvironment {
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

function readFirst(
  environment: NewsClientRuntimeEnvironment,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = readString(environment[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
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

function normalizeUrl(
  value: string,
  protocols: readonly string[],
  label: string,
): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} base URL must be absolute.`);
  }
  if (!protocols.includes(parsed.protocol)) {
    throw new Error(`${label} base URL uses an unsupported protocol.`);
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(`${label} base URL must not contain credentials, a query, or a fragment.`);
  }
  return value.replace(/\/+$/u, "");
}

function deriveWebsocketBaseUrl(imApiBaseUrl: string): string {
  const parsed = new URL(imApiBaseUrl);
  parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
  return parsed.toString().replace(/\/+$/u, "");
}
