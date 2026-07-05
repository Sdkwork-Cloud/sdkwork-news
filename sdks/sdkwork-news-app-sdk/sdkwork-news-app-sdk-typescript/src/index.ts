import {
  createClient as createGeneratedNewsAppClient,
  SdkworkAppClient,
} from '../generated/server-openapi/src/index';
import type { SdkworkAppConfig } from '../generated/server-openapi/src/types/common';

export { SdkworkAppClient, createGeneratedNewsAppClient };
export type { SdkworkAppConfig };
export * from '../generated/server-openapi/src/types';
export * from '../generated/server-openapi/src/api';
export * from '../generated/server-openapi/src/http';
export * from '../generated/server-openapi/src/auth';

export type SdkworkNewsAppClient = SdkworkAppClient;

export function createNewsAppClient(config: SdkworkAppConfig): SdkworkNewsAppClient {
  return createGeneratedNewsAppClient(config);
}

export function createClient(config: SdkworkAppConfig): SdkworkNewsAppClient {
  return createNewsAppClient(config);
}
