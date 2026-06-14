export interface ConsoleNewsItem {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  body?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  authorName?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsoleChannel {
  id: string;
  title: string;
  slug: string;
  channelType: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsoleTopic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsoleComment {
  id: string;
  itemId: string;
  userId: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsoleAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  topItems: ConsoleAnalyticsItem[];
}

export interface ConsoleAnalyticsItem {
  itemId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ConsoleDashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalChannels: number;
  totalTopics: number;
  pendingComments: number;
  totalViews: number;
}

