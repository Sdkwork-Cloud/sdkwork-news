import { describe, it, expect, vi } from 'vitest';
import {
  createNewsService,
} from '../src/services/news-service';
import type { NewsApiPort } from '@sdkwork/news-pc-core/sdk';

function createMockNewsApi(): NewsApiPort {
  return {
    categories: { list: vi.fn() },
    items: { list: vi.fn(), retrieve: vi.fn(), bySlug: { retrieve: vi.fn() }, related: { list: vi.fn() } },
    overview: { retrieve: vi.fn() },
    channels: { list: vi.fn(), feed: { list: vi.fn() } },
    topics: { list: vi.fn(), items: { list: vi.fn() } },
    feed: { personalized: { list: vi.fn() } },
    trending: { list: vi.fn() },
    search: { list: vi.fn(), suggestions: { list: vi.fn() } },
    events: { create: vi.fn() },
    favorites: { list: vi.fn(), create: vi.fn(), delete: vi.fn() },
    reactions: { upsert: vi.fn() },
    comments: { list: vi.fn(), create: vi.fn() },
    reports: { create: vi.fn() },
    feedback: { create: vi.fn() },
    history: { list: vi.fn() },
    follows: { list: vi.fn(), create: vi.fn(), delete: vi.fn() },
    interests: { list: vi.fn(), upsert: vi.fn() },
    notification: { subscriptions: { list: vi.fn(), upsert: vi.fn(), delete: vi.fn() } },
    alerts: { breaking: { list: vi.fn() } },
    digests: { list: vi.fn() },
    trust: { item: { retrieve: vi.fn() } },
    factChecks: { list: vi.fn() },
    corrections: { list: vi.fn() },
    live: { events: { list: vi.fn(), retrieve: vi.fn() }, updates: { list: vi.fn() } },
  };
}

describe('NewsService', () => {
  it('should create a news service', () => {
    const mockNewsApi = createMockNewsApi();

    const newsService = createNewsService(mockNewsApi);
    expect(newsService).toBeDefined();
  });

  it('should call getCategories', async () => {
    const mockCategories = [{ id: 'cat1', title: 'Category 1' }];
    const mockNewsApi = createMockNewsApi();
    const listCategories = vi.fn().mockResolvedValue({ categories: mockCategories });
    mockNewsApi.categories.list = listCategories;

    const newsService = createNewsService(mockNewsApi);
    const result = await newsService.getCategories();
    expect(result).toEqual(mockCategories);
    expect(listCategories).toHaveBeenCalled();
  });

  it('should call getItems', async () => {
    const mockItems = [{ id: 'item1', title: 'Item 1' }];
    const mockNewsApi = createMockNewsApi();
    const listItems = vi.fn().mockResolvedValue({ items: mockItems });
    mockNewsApi.items.list = listItems;

    const newsService = createNewsService(mockNewsApi);
    const result = await newsService.getItems();
    expect(result).toEqual(mockItems);
    expect(listItems).toHaveBeenCalled();
  });
});

