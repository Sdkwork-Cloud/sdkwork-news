import { createEnvironment } from './environment';
import { createIamRuntime } from './iamRuntime';
import { createSdkClients } from './sdkClients';

export interface Runtime {
  environment: ReturnType<typeof createEnvironment>;
  iamRuntime: ReturnType<typeof createIamRuntime>;
  sdkClients: ReturnType<typeof createSdkClients>;
}

export function createRuntime(): Runtime {
  return {
    environment: createEnvironment(),
    iamRuntime: createIamRuntime(),
    sdkClients: createSdkClients(),
  };
}
