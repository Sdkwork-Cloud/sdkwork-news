export interface RuntimeConfig {
  environment: 'development' | 'test' | 'staging' | 'production';
  deploymentMode: 'web' | 'desktop' | 'tablet-ipados' | 'tablet-android';
  runtimeTarget: 'browser' | 'desktop' | 'tablet-ipados' | 'tablet-android';
}

export function createRuntimeConfig(): RuntimeConfig {
  return {
    environment: 'development',
    deploymentMode: 'web',
    runtimeTarget: 'browser',
  };
}
