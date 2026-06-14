# sdkwork-news-pc-core

Core runtime package for the News PC application.

## Overview

This package provides the core runtime functionality for the News PC application, including:

- SDK client factories
- TokenManager binding
- Session management
- Environment configuration
- Host adapter contracts

## Installation

```bash
pnpm add @sdkwork/news-pc-core
```

## Usage

```typescript
import { createSessionManager, createAppConfig } from '@sdkwork/news-pc-core';

// Create session manager
const sessionManager = createSessionManager();

// Set session
sessionManager.setSession({
  userId: 'user1',
  tenantId: 'tenant1',
  accessToken: 'token1',
  refreshToken: 'refresh1',
  expiresAt: Date.now() + 3600000,
});

// Check if authenticated
if (sessionManager.isAuthenticated()) {
  // User is authenticated
}

// Create app config
const appConfig = createAppConfig();
console.log(appConfig.appName); // 'sdkwork-news'
```

## API

### Session Management

- `createSessionManager()`: Creates a new session manager
- `sessionManager.getSession()`: Gets the current session
- `sessionManager.setSession(session)`: Sets the current session
- `sessionManager.clearSession()`: Clears the current session
- `sessionManager.isAuthenticated()`: Checks if the session is authenticated

### Configuration

- `createAppConfig()`: Creates the application configuration
- `createRuntimeConfig()`: Creates the runtime configuration
- `createEnvironment()`: Creates the environment configuration

### SDK

- `createSdkClients()`: Creates the SDK clients

### Host

- `createHostAdapter()`: Creates the host adapter

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
