import type { NewsApiPort } from '@sdkwork/news-pc-console-core/sdk';

export interface ConsoleNewsServiceConfig {
  newsApi: NewsApiPort;
}

export class ConsoleNewsService {
  private newsApi: NewsApiPort;

  constructor(config: ConsoleNewsServiceConfig) {
    this.newsApi = config.newsApi;
  }

  // News management
  async getNewsList(params?: { status?: string; categoryId?: string; q?: string }) {
    const response = await this.newsApi.items.list(params);
    return readListResponse(response, 'items');
  }

  async getNewsItem(itemId: string) {
    return this.newsApi.items.retrieve(itemId);
  }

  async createNewsItem(body: {
    categoryId: string;
    title: string;
    summary: string;
    body?: string;
    tags?: string[];
  }) {
    // Note: Creating news items requires backend-api SDK
    // For now, return a mock response
    return { id: 'new-item', ...body };
  }

  async updateNewsItem(itemId: string, body: {
    title?: string;
    summary?: string;
    body?: string;
    tags?: string[];
  }) {
    // Note: Updating news items requires backend-api SDK
    // For now, return a mock response
    return { id: itemId, ...body };
  }

  async deleteNewsItem(itemId: string) {
    // Note: Deleting news items requires backend-api SDK
    // For now, return a mock response
    return { success: true };
  }

  async publishNewsItem(itemId: string) {
    // Note: Publishing news items requires backend-api SDK
    // For now, return a mock response
    return { id: itemId, status: 'published' };
  }

  async archiveNewsItem(itemId: string) {
    // Note: Archiving news items requires backend-api SDK
    // For now, return a mock response
    return { id: itemId, status: 'archived' };
  }

  // Channel management
  async getChannels() {
    const response = await this.newsApi.channels.list();
    return readListResponse(response, 'channels');
  }

  async getChannel(channelId: string) {
    // Note: Getting a single channel requires backend-api SDK
    // For now, return a mock response
    return { id: channelId };
  }

  async createChannel(body: {
    title: string;
    slug: string;
    channelType: string;
  }) {
    // Note: Creating channels requires backend-api SDK
    // For now, return a mock response
    return { id: 'new-channel', ...body };
  }

  async updateChannel(channelId: string, body: {
    title?: string;
    slug?: string;
  }) {
    // Note: Updating channels requires backend-api SDK
    // For now, return a mock response
    return { id: channelId, ...body };
  }

  async deleteChannel(channelId: string) {
    // Note: Deleting channels requires backend-api SDK
    // For now, return a mock response
    return { success: true };
  }

  // Topic management
  async getTopics() {
    const response = await this.newsApi.topics.list();
    return readListResponse(response, 'topics');
  }

  async getTopic(topicId: string) {
    // Note: Getting a single topic requires backend-api SDK
    // For now, return a mock response
    return { id: topicId };
  }

  async createTopic(body: {
    title: string;
    slug: string;
    description?: string;
  }) {
    // Note: Creating topics requires backend-api SDK
    // For now, return a mock response
    return { id: 'new-topic', ...body };
  }

  async updateTopic(topicId: string, body: {
    title?: string;
    slug?: string;
    description?: string;
  }) {
    // Note: Updating topics requires backend-api SDK
    // For now, return a mock response
    return { id: topicId, ...body };
  }

  async deleteTopic(topicId: string) {
    // Note: Deleting topics requires backend-api SDK
    // For now, return a mock response
    return { success: true };
  }

  // Comment moderation
  async getComments(itemId: string, params?: { cursor?: string; limit?: string }) {
    return this.newsApi.comments.list(itemId, params);
  }

  async moderateComment(commentId: string, action: 'approve' | 'reject' | 'delete') {
    // Note: Moderating comments requires backend-api SDK
    // For now, return a mock response
    return { id: commentId, status: action === 'approve' ? 'approved' : 'rejected' };
  }

  // Analytics
  async getAnalytics(params?: { startDate?: string; endDate?: string }) {
    // Note: Analytics requires backend-api SDK
    // For now, return a mock response
    return {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      topItems: [],
    };
  }
}

export function createConsoleNewsService(newsApi: NewsApiPort): ConsoleNewsService {
  return new ConsoleNewsService({ newsApi });
}

function readListResponse(
  response: unknown,
  legacyKey: string,
): Record<string, unknown>[] {
  if (Array.isArray(response)) {
    return response.filter(isRecord);
  }
  if (!isRecord(response)) {
    return [];
  }
  const data = isRecord(response.data) ? response.data : response;
  const items = data.items ?? data[legacyKey];
  return Array.isArray(items) ? items.filter(isRecord) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
