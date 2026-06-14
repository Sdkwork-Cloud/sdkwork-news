# sdkwork-news-pc-shell

Application shell package for the News PC application.

## Overview

This package provides the application shell for the News PC application, including:

- Layout components
- Navigation components
- Route configuration

## Installation

```bash
pnpm add @sdkwork/news-pc-shell
```

## Usage

### Layout

```typescript
import { Layout } from '@sdkwork/news-pc-shell';

function App() {
  return (
    <Layout>
      <h1>Content</h1>
      <p>Page content goes here</p>
    </Layout>
  );
}
```

### Navigation

```typescript
import { Navigation } from '@sdkwork/news-pc-shell';

const navItems = [
  { label: 'Home', href: '/news', icon: '🏠' },
  { label: 'Channels', href: '/news/channels', icon: '📺' },
  { label: 'Topics', href: '/news/topics', icon: '📚' },
  { label: 'Trending', href: '/news/trending', icon: '🔥' },
  { label: 'Live', href: '/news/live', icon: '📡' },
];

function MyNavigation() {
  return <Navigation items={navItems} />;
}
```

### Routes

```typescript
import { createRouteConfig } from '@sdkwork/news-pc-shell';

const routeConfig = createRouteConfig([
  { path: '/news', component: HomePage },
  { path: '/news/:itemSlug', component: ItemDetailPage },
  { path: '/news/search', component: SearchPage },
]);
```

## API

### Layout

- `Layout`: Main layout component with header, main content, and footer

### Navigation

- `Navigation`: Navigation component with items

### Routes

- `createRouteConfig`: Creates a route configuration
- `Route`: Route interface

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
