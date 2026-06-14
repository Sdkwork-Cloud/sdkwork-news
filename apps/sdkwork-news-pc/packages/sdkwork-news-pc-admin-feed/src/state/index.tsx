import { useState, useCallback } from 'react';
import type { AdminUser, AdminTenant, AdminNewsItem, AdminModerationItem } from '../types';

export interface AdminState {
  users: AdminUser[];
  tenants: AdminTenant[];
  news: AdminNewsItem[];
  moderation: AdminModerationItem[];
  loading: boolean;
  error: Error | null;
}

export const initialAdminState: AdminState = {
  users: [],
  tenants: [],
  news: [],
  moderation: [],
  loading: false,
  error: null,
};

export function useAdminState() {
  const [state, setState] = useState<AdminState>(initialAdminState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setUsers = useCallback((users: AdminUser[]) => {
    setState(prev => ({ ...prev, users }));
  }, []);

  const setTenants = useCallback((tenants: AdminTenant[]) => {
    setState(prev => ({ ...prev, tenants }));
  }, []);

  const setNews = useCallback((news: AdminNewsItem[]) => {
    setState(prev => ({ ...prev, news }));
  }, []);

  const setModeration = useCallback((moderation: AdminModerationItem[]) => {
    setState(prev => ({ ...prev, moderation }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialAdminState);
  }, []);

  return {
    state,
    setLoading,
    setError,
    setUsers,
    setTenants,
    setNews,
    setModeration,
    resetState,
  };
}
