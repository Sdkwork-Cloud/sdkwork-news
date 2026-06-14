import { useState, useEffect, useCallback } from 'react';
import type { ConsoleNewsService } from '../services/console-news-service';

export interface UseConsoleNewsOptions {
  consoleNewsService: ConsoleNewsService;
}

export function useConsoleNews(options: UseConsoleNewsOptions) {
  const { consoleNewsService } = options;
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNews = useCallback(async (params?: { status?: string; categoryId?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await consoleNewsService.getNewsList(params);
      setNews(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService]);

  const createNews = useCallback(async (body: any) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.createNewsItem(body);
      await fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchNews]);

  const updateNews = useCallback(async (newsId: string, body: any) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.updateNewsItem(newsId, body);
      await fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchNews]);

  const deleteNews = useCallback(async (newsId: string) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.deleteNewsItem(newsId);
      await fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchNews]);

  const publishNews = useCallback(async (newsId: string) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.publishNewsItem(newsId);
      await fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to publish news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchNews]);

  const archiveNews = useCallback(async (newsId: string) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.archiveNewsItem(newsId);
      await fetchNews();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to archive news'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchNews]);

  return {
    news,
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    publishNews,
    archiveNews,
  };
}

export function useConsoleChannels(options: UseConsoleNewsOptions) {
  const { consoleNewsService } = options;
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consoleNewsService.getChannels();
      setChannels(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService]);

  const createChannel = useCallback(async (body: any) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.createChannel(body);
      await fetchChannels();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create channel'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchChannels]);

  const deleteChannel = useCallback(async (channelId: string) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.deleteChannel(channelId);
      await fetchChannels();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete channel'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchChannels]);

  return {
    channels,
    loading,
    error,
    fetchChannels,
    createChannel,
    deleteChannel,
  };
}

export function useConsoleTopics(options: UseConsoleNewsOptions) {
  const { consoleNewsService } = options;
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consoleNewsService.getTopics();
      setTopics(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch topics'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService]);

  const createTopic = useCallback(async (body: any) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.createTopic(body);
      await fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create topic'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchTopics]);

  const deleteTopic = useCallback(async (topicId: string) => {
    try {
      setLoading(true);
      setError(null);
      await consoleNewsService.deleteTopic(topicId);
      await fetchTopics();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete topic'));
    } finally {
      setLoading(false);
    }
  }, [consoleNewsService, fetchTopics]);

  return {
    topics,
    loading,
    error,
    fetchTopics,
    createTopic,
    deleteTopic,
  };
}
