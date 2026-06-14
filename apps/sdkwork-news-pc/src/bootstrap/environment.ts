export interface Environment {
  environment: 'development' | 'test' | 'staging' | 'production';
  deploymentMode: 'web' | 'desktop' | 'tablet-ipados' | 'tablet-android';
  runtimeTarget: 'browser' | 'desktop' | 'tablet-ipados' | 'tablet-android';
}

export function createEnvironment(): Environment {
  return {
    environment: 'development',
    deploymentMode: 'web',
    runtimeTarget: 'browser',
  };
}
