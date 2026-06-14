import { useState, useEffect, useCallback } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';

export interface UseAdminNewsOptions {
  adminNewsService: AdminNewsService;
}

export function useAdminUsers(options: UseAdminNewsOptions) {
  const { adminNewsService } = options;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async (params?: { status?: string; role?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminNewsService.getUsers(params);
      setUsers(response.users || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService]);

  const createUser = useCallback(async (body: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.createUser(body);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create user'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchUsers]);

  const updateUser = useCallback(async (userId: string, body: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.updateUser(userId, body);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete user'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchUsers]);

  const suspendUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.suspendUser(userId);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to suspend user'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
  };
}

export function useAdminTenants(options: UseAdminNewsOptions) {
  const { adminNewsService } = options;
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminNewsService.getTenants();
      setTenants(response.tenants || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tenants'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService]);

  const createTenant = useCallback(async (body: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.createTenant(body);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create tenant'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchTenants]);

  const updateTenant = useCallback(async (tenantId: string, body: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.updateTenant(tenantId, body);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update tenant'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchTenants]);

  const deleteTenant = useCallback(async (tenantId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.deleteTenant(tenantId);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete tenant'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchTenants]);

  return {
    tenants,
    loading,
    error,
    fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
  };
}

export function useAdminModeration(options: UseAdminNewsOptions) {
  const { adminNewsService } = options;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModerationQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminNewsService.getModerationQueue();
      setItems(response || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch moderation queue'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService]);

  const approveItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.approveModerationItem(itemId);
      await fetchModerationQueue();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to approve item'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchModerationQueue]);

  const rejectItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.rejectModerationItem(itemId);
      await fetchModerationQueue();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reject item'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchModerationQueue]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminNewsService.deleteModerationItem(itemId);
      await fetchModerationQueue();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete item'));
    } finally {
      setLoading(false);
    }
  }, [adminNewsService, fetchModerationQueue]);

  return {
    items,
    loading,
    error,
    fetchModerationQueue,
    approveItem,
    rejectItem,
    deleteItem,
  };
}
