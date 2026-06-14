import { useState, useCallback } from 'react';
import type { ConsoleNewsItem, ConsoleChannel, ConsoleTopic, ConsoleComment } from '../types';

export interface ConsoleState {
  news: ConsoleNewsItem[];
  channels: ConsoleChannel[];
  topics: ConsoleTopic[];
  comments: ConsoleComment[];
  loading: boolean;
  error: Error | null;
}

export const initialConsoleState: ConsoleState = {
  news: [],
  channels: [],
  topics: [],
  comments: [],
  loading: false,
  error: null,
};

export function useConsoleState() {
  const [state, setState] = useState<ConsoleState>(initialConsoleState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setNews = useCallback((news: ConsoleNewsItem[]) => {
    setState(prev => ({ ...prev, news }));
  }, []);

  const setChannels = useCallback((channels: ConsoleChannel[]) => {
    setState(prev => ({ ...prev, channels }));
  }, []);

  const setTopics = useCallback((topics: ConsoleTopic[]) => {
    setState(prev => ({ ...prev, topics }));
  }, []);

  const setComments = useCallback((comments: ConsoleComment[]) => {
    setState(prev => ({ ...prev, comments }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialConsoleState);
  }, []);

  return {
    state,
    setLoading,
    setError,
    setNews,
    setChannels,
    setTopics,
    setComments,
    resetState,
  };
}
