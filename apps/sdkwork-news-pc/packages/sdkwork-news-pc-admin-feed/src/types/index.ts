export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'deleted';
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminTenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'deleted';
  userCount: number;
  newsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNewsItem {
  id: string;
  tenantId: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured: boolean;
  authorName?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminModerationItem {
  id: string;
  itemType: 'comment' | 'news' | 'user';
  itemId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  reportedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalTenants: number;
  totalNews: number;
  totalViews: number;
  topTenants: AdminTenantAnalytics[];
  topItems: AdminItemAnalytics[];
}

export interface AdminTenantAnalytics {
  tenantId: string;
  tenantName: string;
  userCount: number;
  newsCount: number;
  viewCount: number;
}

export interface AdminItemAnalytics {
  itemId: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
  ipAddress?: string;
  createdAt?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalNews: number;
  pendingModeration: number;
  totalViews: number;
  activeUsers: number;
}

