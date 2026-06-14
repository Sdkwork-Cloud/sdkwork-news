import { useState, useCallback } from 'react';
import type { NewsCategory, NewsItem } from '../types';

export interface NewsState {
  categories: NewsCategory[];
  items: NewsItem[];
  currentItem: NewsItem | null;
  loading: boolean;
  error: Error | null;
}

export const initialNewsState: NewsState = {
  categories: [],
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

export function useNewsState() {
  const [state, setState] = useState<NewsState>(initialNewsState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setCategories = useCallback((categories: NewsCategory[]) => {
    setState(prev => ({ ...prev, categories }));
  }, []);

  const setItems = useCallback((items: NewsItem[]) => {
    setState(prev => ({ ...prev, items }));
  }, []);

  const setCurrentItem = useCallback((currentItem: NewsItem | null) => {
    setState(prev => ({ ...prev, currentItem }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialNewsState);
  }, []);

  return {
    state,
    setLoading,
    setError,
    setCategories,
    setItems,
    setCurrentItem,
    resetState,
  };
}
