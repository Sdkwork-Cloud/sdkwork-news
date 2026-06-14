# sdkwork-news-pc-admin-core

Core runtime package for the News Admin.

## Overview

This package provides the core runtime functionality for the News Admin, including:

- Admin SDK providers
- Admin session management
- Permission and role checking

## Installation

```bash
pnpm add @sdkwork/news-pc-admin-core
```

## Usage

```typescript
import { createAdminSessionManager, ADMIN_PERMISSIONS, ADMIN_ROLES } from '@sdkwork/news-pc-admin-core';

// Create session manager
const sessionManager = createAdminSessionManager();

// Set session
sessionManager.setSession({
  userId: 'admin1',
  tenantId: 'tenant1',
  accessToken: 'token1',
  refreshToken: 'refresh1',
  expiresAt: Date.now() + 3600000,
  permissions: [ADMIN_PERMISSIONS.USER_VIEW, ADMIN_PERMISSIONS.USER_CREATE],
  roles: [ADMIN_ROLES.ADMIN],
});

// Check permission
if (sessionManager.hasPermission(ADMIN_PERMISSIONS.USER_VIEW)) {
  // User has permission
}

// Check role
if (sessionManager.hasRole(ADMIN_ROLES.ADMIN)) {
  // User has admin role
}
```

## API

- `createAdminSessionManager()`: Creates an admin session manager
- `ADMIN_PERMISSIONS`: Admin permission constants
- `ADMIN_ROLES`: Admin role constants
- `createAdminPermissionChecker()`: Creates an admin permission checker

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
