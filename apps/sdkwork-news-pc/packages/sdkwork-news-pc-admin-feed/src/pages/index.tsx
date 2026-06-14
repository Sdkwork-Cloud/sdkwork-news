import React, { useEffect, useState } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';
import type { AdminDashboardStats } from '../types';

export interface AdminDashboardPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminDashboardPage({ adminNewsService }: AdminDashboardPageProps) {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalTenants: 0,
    totalNews: 0,
    pendingModeration: 0,
    totalViews: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [usersResponse, tenantsResponse, newsResponse, moderationResponse] = await Promise.all([
        adminNewsService.getUsers(),
        adminNewsService.getTenants(),
        adminNewsService.getNewsList(),
        adminNewsService.getModerationQueue(),
      ]);

      setStats({
        totalUsers: (usersResponse as any)?.users?.length || (Array.isArray(usersResponse) ? usersResponse.length : 0),
        totalTenants: (tenantsResponse as any)?.tenants?.length || (Array.isArray(tenantsResponse) ? tenantsResponse.length : 0),
        totalNews: Array.isArray(newsResponse) ? newsResponse.length : ((newsResponse as any)?.items?.length || 0),
        pendingModeration: Array.isArray(moderationResponse) ? moderationResponse.length : ((moderationResponse as any)?.items?.length || 0),
        totalViews: 0,
        activeUsers: 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-dashboard__loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.totalUsers}</div>
          <div className="admin-dashboard__stat-label">Total Users</div>
        </div>
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.totalTenants}</div>
          <div className="admin-dashboard__stat-label">Total Tenants</div>
        </div>
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.totalNews}</div>
          <div className="admin-dashboard__stat-label">Total News</div>
        </div>
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.pendingModeration}</div>
          <div className="admin-dashboard__stat-label">Pending Moderation</div>
        </div>
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.totalViews}</div>
          <div className="admin-dashboard__stat-label">Total Views</div>
        </div>
        <div className="admin-dashboard__stat">
          <div className="admin-dashboard__stat-value">{stats.activeUsers}</div>
          <div className="admin-dashboard__stat-label">Active Users</div>
        </div>
      </div>
    </div>
  );
}

export interface AdminUserListPageProps {
  adminNewsService: AdminNewsService;
  onCreateUser?: () => void;
  onEditUser?: (userId: string) => void;
}

export function AdminUserListPage({ adminNewsService, onCreateUser, onEditUser }: AdminUserListPageProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminNewsService.getUsers();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      await adminNewsService.suspendUser(userId);
      await loadUsers();
    } catch (err) {
      console.error('Failed to suspend user:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await adminNewsService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (loading) {
    return <div className="admin-user-list__loading">Loading...</div>;
  }

  return (
    <div className="admin-user-list">
      <div className="admin-user-list__header">
        <h1>Users</h1>
        <button className="admin-user-list__create" onClick={onCreateUser}>
          Create User
        </button>
      </div>
      <div className="admin-user-list__table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => onEditUser?.(user.id)}>Edit</button>
                  {user.status === 'active' && (
                    <button onClick={() => handleSuspend(user.id)}>Suspend</button>
                  )}
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface AdminTenantListPageProps {
  adminNewsService: AdminNewsService;
  onCreateTenant?: () => void;
  onEditTenant?: (tenantId: string) => void;
}

export function AdminTenantListPage({ adminNewsService, onCreateTenant, onEditTenant }: AdminTenantListPageProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const response = await adminNewsService.getTenants();
      setTenants(response.tenants || []);
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tenantId: string) => {
    try {
      await adminNewsService.deleteTenant(tenantId);
      await loadTenants();
    } catch (err) {
      console.error('Failed to delete tenant:', err);
    }
  };

  if (loading) {
    return <div className="admin-tenant-list__loading">Loading...</div>;
  }

  return (
    <div className="admin-tenant-list">
      <div className="admin-tenant-list__header">
        <h1>Tenants</h1>
        <button className="admin-tenant-list__create" onClick={onCreateTenant}>
          Create Tenant
        </button>
      </div>
      <div className="admin-tenant-list__table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Users</th>
              <th>News</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant.id}>
                <td>{tenant.name}</td>
                <td>{tenant.domain}</td>
                <td>{tenant.status}</td>
                <td>{tenant.userCount}</td>
                <td>{tenant.newsCount}</td>
                <td>
                  <button onClick={() => onEditTenant?.(tenant.id)}>Edit</button>
                  <button onClick={() => handleDelete(tenant.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface AdminModerationPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminModerationPage({ adminNewsService }: AdminModerationPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModerationQueue();
  }, []);

  const loadModerationQueue = async () => {
    try {
      setLoading(true);
      const response = await adminNewsService.getModerationQueue();
      setItems(Array.isArray(response) ? response : ((response as any)?.items || []));
    } catch (err) {
      console.error('Failed to load moderation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId: string) => {
    try {
      await adminNewsService.approveModerationItem(itemId);
      await loadModerationQueue();
    } catch (err) {
      console.error('Failed to approve item:', err);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      await adminNewsService.rejectModerationItem(itemId);
      await loadModerationQueue();
    } catch (err) {
      console.error('Failed to reject item:', err);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await adminNewsService.deleteModerationItem(itemId);
      await loadModerationQueue();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  if (loading) {
    return <div className="admin-moderation__loading">Loading...</div>;
  }

  return (
    <div className="admin-moderation">
      <h1>Moderation Queue</h1>
      <div className="admin-moderation__table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Item ID</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.itemType}</td>
                <td>{item.itemId}</td>
                <td>{item.status}</td>
                <td>{item.reason}</td>
                <td>
                  {item.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(item.id)}>Approve</button>
                      <button onClick={() => handleReject(item.id)}>Reject</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
