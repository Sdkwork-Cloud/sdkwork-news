# sdkwork-news-pc-feed

News feed functionality package for the News PC application.

## Overview

This package provides the news feed functionality for the News PC application, including:

- News service for SDK integration
- News components (cards, etc.)
- News pages (home, detail, search, etc.)
- News hooks
- News state management
- News types
- News routes
- News i18n

## Installation

```bash
pnpm add @sdkwork/news-pc-feed
```

## Usage

### News Service

```typescript
import { createNewsService } from '@sdkwork/news-pc-feed';

const newsService = createNewsService(newsApi);

// Get categories
const categories = await newsService.getCategories();

// Get items
const items = await newsService.getItems({ status: 'published' });

// Get item by slug
const item = await newsService.getItemBySlug('breaking-news');
```

### News Card

```typescript
import { NewsCard } from '@sdkwork/news-pc-feed';

function NewsList({ items }) {
  return (
    <div>
      {items.map(item => (
        <NewsCard
          key={item.id}
          item={item}
          onFavorite={(itemId) => console.log('Favorite:', itemId)}
          onShare={(itemId) => console.log('Share:', itemId)}
          onClick={(item) => console.log('Click:', item)}
        />
      ))}
    </div>
  );
}
```

### Home Page

```typescript
import { HomePage } from '@sdkwork/news-pc-feed';

function App() {
  return (
    <HomePage
      newsService={newsService}
      onItemSelect={(item) => console.log('Selected:', item)}
      onCategorySelect={(category) => console.log('Category:', category)}
      onSearch={(query) => console.log('Search:', query)}
    />
  );
}
```

### News Hook

```typescript
import { useNews } from '@sdkwork/news-pc-feed';

function MyComponent() {
  const { categories, items, loading, error, fetchCategories, fetchItems } = useNews({
    newsService,
  });

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>{category.title}</div>
      ))}
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## API

### Services

- `createNewsService`: Creates a news service
- `NewsService`: News service class

### Components

- `NewsCard`: News card component

### Pages

- `HomePage`: Home page component

### Hooks

- `useNews`: Hook for news operations

### State

- `useNewsState`: Hook for news state management

### Types

- `NewsCategory`: News category type
- `NewsItem`: News item type
- `NewsFeedItem`: News feed item type
- And more...

### Routes

- `NEWS_ROUTES`: News route constants
- `buildNewsRoute`: Builds a news route

### i18n

- `newsI18n`: News i18n instance
- `createNewsI18n`: Creates a news i18n instance

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
