# sdkwork-news-pc-console-core

Core runtime package for the News Console.

## Overview

This package provides the core runtime functionality for the News Console, including:

- Console SDK providers
- Console session management
- Permission checking

## Installation

```bash
pnpm add @sdkwork/news-pc-console-core
```

## Usage

```typescript
import { createConsoleSessionManager, CONSOLE_PERMISSIONS } from '@sdkwork/news-pc-console-core';

// Create session manager
const sessionManager = createConsoleSessionManager();

// Set session
sessionManager.setSession({
  userId: 'user1',
  tenantId: 'tenant1',
  organizationId: 'org1',
  accessToken: 'token1',
  refreshToken: 'refresh1',
  expiresAt: Date.now() + 3600000,
  permissions: [CONSOLE_PERMISSIONS.NEWS_VIEW, CONSOLE_PERMISSIONS.NEWS_CREATE],
});

// Check permission
if (sessionManager.hasPermission(CONSOLE_PERMISSIONS.NEWS_VIEW)) {
  // User has permission
}
```

## API

- `createConsoleSessionManager()`: Creates a console session manager
- `CONSOLE_PERMISSIONS`: Console permission constants
- `createPermissionChecker()`: Creates a permission checker

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
