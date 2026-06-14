# sdkwork-news-pc-commons

Shared UI and runtime package for the News PC application.

## Overview

This package provides shared UI components, hooks, utilities, and i18n helpers for the News PC application.

## Installation

```bash
pnpm add @sdkwork/news-pc-commons
```

## Usage

### Components

```typescript
import { Button, Card, Loading, ErrorMessage } from '@sdkwork/news-pc-commons';

function MyComponent() {
  return (
    <Card>
      <h2>Title</h2>
      <p>Content</p>
      <Button variant="primary" onClick={() => console.log('clicked')}>
        Click me
      </Button>
    </Card>
  );
}
```

### Hooks

```typescript
import { useLocalStorage, useDebounce, useMediaQuery } from '@sdkwork/news-pc-commons';

function MyComponent() {
  const [value, setValue] = useLocalStorage('key', 'default');
  const debouncedValue = useDebounce(value, 500);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <p>Debounced: {debouncedValue}</p>
      {isMobile && <p>Mobile view</p>}
    </div>
  );
}
```

### Utilities

```typescript
import { formatDate, formatTime, truncateText } from '@sdkwork/news-pc-commons';

const date = formatDate('2026-06-13T10:30:00Z'); // 'Jun 13, 2026'
const time = formatTime('2026-06-13T10:30:00Z'); // '10:30 AM'
const truncated = truncateText('Long text here', 10); // 'Long te...'
```

### i18n

```typescript
import { createI18n } from '@sdkwork/news-pc-commons';

const i18n = createI18n('en', {
  'hello': 'Hello',
  'greeting': 'Hello, {name}!',
});

console.log(i18n.t('hello')); // 'Hello'
console.log(i18n.t('greeting', { name: 'World' })); // 'Hello, World!'
```

## API

### Components

- `Button`: Button component with variants (primary, secondary, ghost) and sizes (small, medium, large)
- `Card`: Card container component
- `Loading`: Loading spinner component
- `ErrorMessage`: Error message component with retry button

### Hooks

- `useLocalStorage`: Hook for managing localStorage values
- `useDebounce`: Hook for debouncing values
- `useMediaQuery`: Hook for media query matching

### Utilities

- `formatDate`: Formats a date string
- `formatTime`: Formats a time string
- `formatDateTime`: Formats a datetime string
- `truncateText`: Truncates text to a specified length
- `debounce`: Debounces a function
- `throttle`: Throttles a function

### i18n

- `createI18n`: Creates an i18n instance

## Development

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck
```
