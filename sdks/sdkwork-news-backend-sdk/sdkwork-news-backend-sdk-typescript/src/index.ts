import {
  createClient as createGeneratedNewsBackendClient,
  SdkworkBackendClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkBackendConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkBackendClient, createGeneratedNewsBackendClient };
export type { SdkworkBackendConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type SdkworkNewsBackendClient = SdkworkBackendClient;

export function createNewsBackendClient(
  config: SdkworkBackendConfig,
): SdkworkNewsBackendClient {
  return createGeneratedNewsBackendClient(config);
}

export function createClient(config: SdkworkBackendConfig): SdkworkNewsBackendClient {
  return createNewsBackendClient(config);
}
