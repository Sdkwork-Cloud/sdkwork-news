class NewsAppConfig {
  const NewsAppConfig({
    required this.environment,
    required this.deploymentProfile,
    required this.demoMode,
    required this.applicationPublicHttpUrl,
    required this.applicationPublicWebSocketUrl,
    required this.agentsAppApiUrl,
  });

  final String environment;
  final String deploymentProfile;
  final bool demoMode;
  final String applicationPublicHttpUrl;
  final String applicationPublicWebSocketUrl;
  final String agentsAppApiUrl;

  factory NewsAppConfig.fromEnvironment() {
    const environment =
        String.fromEnvironment('SDKWORK_ENV', defaultValue: 'development');
    const deploymentProfile = String.fromEnvironment(
      'SDKWORK_DEPLOYMENT_PROFILE',
      defaultValue: 'standalone',
    );
    const demoMode =
        bool.fromEnvironment('SDKWORK_NEWS_DEMO_MODE', defaultValue: true);
    const publicHttpUrl = String.fromEnvironment(
      'SDKWORK_APPLICATION_PUBLIC_HTTP_URL',
      defaultValue: '',
    );
    const publicWebSocketUrl = String.fromEnvironment(
      'SDKWORK_APPLICATION_PUBLIC_WEBSOCKET_URL',
      defaultValue: '',
    );
    const agentsAppApiUrl = String.fromEnvironment(
      'SDKWORK_AGENTS_APP_API_URL',
      defaultValue: '',
    );
    final config = NewsAppConfig(
      environment: environment,
      deploymentProfile: deploymentProfile,
      demoMode: demoMode,
      applicationPublicHttpUrl: publicHttpUrl,
      applicationPublicWebSocketUrl: publicWebSocketUrl,
      agentsAppApiUrl: agentsAppApiUrl,
    );
    config.validate();
    return config;
  }

  void validate() {
    if (!const {'development', 'test', 'staging', 'production'}
        .contains(environment)) {
      throw ArgumentError.value(
        environment,
        'environment',
        'must be development, test, staging, or production',
      );
    }
    if (!const {'standalone', 'cloud'}.contains(deploymentProfile)) {
      throw ArgumentError.value(
        deploymentProfile,
        'deploymentProfile',
        'must be standalone or cloud',
      );
    }
    if (demoMode) {
      return;
    }
    _requireHttpUrl(applicationPublicHttpUrl, 'applicationPublicHttpUrl');
    _requireHttpUrl(agentsAppApiUrl, 'agentsAppApiUrl');
    if (applicationPublicWebSocketUrl.isNotEmpty) {
      _requireWebSocketUrl(
        applicationPublicWebSocketUrl,
        'applicationPublicWebSocketUrl',
      );
    }
    if (!agentsAppApiUrl.endsWith('/app/v3/api')) {
      throw ArgumentError.value(
        agentsAppApiUrl,
        'agentsAppApiUrl',
        'must end with /app/v3/api',
      );
    }
  }
}

void _requireWebSocketUrl(String value, String name) {
  final uri = Uri.tryParse(value);
  if (uri == null ||
      !uri.hasScheme ||
      (uri.scheme != 'ws' && uri.scheme != 'wss') ||
      uri.host.isEmpty ||
      uri.hasFragment ||
      uri.hasQuery) {
    throw ArgumentError.value(value, name, 'must be an absolute WS(S) URL');
  }
}

void _requireHttpUrl(String value, String name) {
  final uri = Uri.tryParse(value);
  if (uri == null ||
      !uri.hasScheme ||
      (uri.scheme != 'http' && uri.scheme != 'https') ||
      uri.host.isEmpty ||
      uri.hasFragment ||
      uri.hasQuery) {
    throw ArgumentError.value(value, name, 'must be an absolute HTTP(S) URL');
  }
}
