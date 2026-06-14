import { useState, useEffect, useCallback } from 'react';
import type { NewsService } from '../services/news-service';

export interface UseNewsOptions {
  newsService: NewsService;
}

export function useNews(options: UseNewsOptions) {
  const { newsService } = options;
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getCategories();
      setCategories(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
    } finally {
      setLoading(false);
    }
  }, [newsService]);

  const fetchItems = useCallback(async (params?: { categoryId?: string; q?: string; status?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getItems(params);
      setItems(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
    } finally {
      setLoading(false);
    }
  }, [newsService]);

  return {
    categories,
    items,
    loading,
    error,
    fetchCategories,
    fetchItems,
  };
}
