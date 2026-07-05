import type { NewsApi } from '@sdkwork/news-app-sdk';

export interface NewsServiceConfig {
  newsApi: NewsApi;
}

export class NewsService {
  private newsApi: NewsApi;

  constructor(config: NewsServiceConfig) {
    this.newsApi = config.newsApi;
  }

  async getCategories() {
    return this.newsApi.categories.list();
  }

  async getItems(params?: { categoryId?: string; q?: string; status?: string }) {
    return this.newsApi.items.list(params);
  }

  async getItem(itemId: string) {
    return this.newsApi.items.retrieve(itemId);
  }

  async getItemBySlug(slug: string) {
    return this.newsApi.items.bySlug.retrieve(slug);
  }

  async getRelatedItems(itemId: string, params?: { cursor?: string; limit?: string }) {
    return this.newsApi.items.related.list(itemId, params);
  }

  async getOverview() {
    return this.newsApi.overview.retrieve();
  }

  async getChannels(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.channels.list(params);
  }

  async getChannelFeed(channelId: string, params?: { cursor?: string; limit?: string; traceId?: string }) {
    return this.newsApi.channels.feed.list(channelId, params);
  }

  async getTopics(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.topics.list(params);
  }

  async getTopicItems(topicId: string, params?: { cursor?: string; limit?: string; traceId?: string }) {
    return this.newsApi.topics.items.list(topicId, params);
  }

  async getPersonalizedFeed(params?: { cursor?: string; limit?: string; traceId?: string }) {
    return this.newsApi.feed.personalized.list(params);
  }

  async getTrending(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.trending.list(params);
  }

  async search(params?: { q?: string; cursor?: string; limit?: string }) {
    return this.newsApi.search.list(params);
  }

  async getSearchSuggestions(params?: { q?: string; cursor?: string; limit?: string; locale?: string }) {
    return this.newsApi.search.suggestions.list(params);
  }

  async createEvent(body: { itemId: string; eventType: 'impression' | 'click' | 'dwell' | 'complete' | 'dismiss' | 'share'; dwellMs?: number; traceId?: string }) {
    return this.newsApi.events.create({
      ...body,
      occurredAt: new Date().toISOString(),
    });
  }

  async getFavorites(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.favorites.list(params);
  }

  async createFavorite(itemId: string) {
    return this.newsApi.favorites.create(itemId);
  }

  async deleteFavorite(itemId: string) {
    return this.newsApi.favorites.delete(itemId);
  }

  async upsertReaction(itemId: string, body: { reactionType: 'like' | 'dislike' | 'laugh' | 'sad' | 'angry' | 'wow' }) {
    return this.newsApi.reactions.upsert(itemId, body);
  }

  async getComments(itemId: string, params?: { cursor?: string; limit?: string }) {
    return this.newsApi.comments.list(itemId, params);
  }

  async createComment(itemId: string, body: { body: string; parentId?: string }) {
    return this.newsApi.comments.create(itemId, body);
  }

  async createReport(body: { targetType: 'item' | 'comment' | 'media' | 'source'; targetId: string; reason: string }) {
    return this.newsApi.reports.create(body);
  }

  async createFeedback(body: { targetType: 'item' | 'source' | 'author' | 'topic' | 'channel'; targetId: string; feedbackType: 'not_interested' | 'block_source' | 'less_like_this' | 'more_like_this' | 'quality'; reason?: string }) {
    return this.newsApi.feedback.create(body);
  }

  async getHistory(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.history.list(params);
  }

  async getFollows(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.follows.list(params);
  }

  async createFollow(body: { targetType: 'source' | 'author' | 'topic' | 'channel'; targetId: string }) {
    return this.newsApi.follows.create(body);
  }

  async deleteFollow(followId: string) {
    return this.newsApi.follows.delete(followId);
  }

  async getInterests(params?: { cursor?: string; limit?: string }) {
    return this.newsApi.interests.list(params);
  }

  async upsertInterest(body: { targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag'; targetId: string; affinityScore: number; confidence: number; source: 'explicit' | 'behavior' | 'editorial' | 'imported' }) {
    return this.newsApi.interests.upsert(body);
  }

  async getNotificationSubscriptions(params?: { userId?: string; targetType?: string; targetId?: string; channel?: string; cursor?: string; limit?: string }) {
    return this.newsApi.notification.subscriptions.list(params);
  }

  async upsertNotificationSubscription(body: { targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag'; targetId: string; channel: 'push' | 'email' | 'in_app' | 'sms'; frequency: 'breaking' | 'daily' | 'weekly' | 'silent' }) {
    return this.newsApi.notification.subscriptions.upsert(body);
  }

  async deleteNotificationSubscription(subscriptionId: string) {
    return this.newsApi.notification.subscriptions.delete(subscriptionId);
  }

  async getBreakingAlerts(params?: { severity?: string; targetType?: string; targetId?: string; cursor?: string; limit?: string }) {
    return this.newsApi.alerts.breaking.list(params);
  }

  async getDigests(params?: { digestType?: string; locale?: string; cursor?: string; limit?: string }) {
    return this.newsApi.digests.list(params);
  }

  async getItemTrust(itemId: string) {
    return this.newsApi.trust.item.retrieve(itemId);
  }

  async getFactChecks(params?: { itemId?: string; verdict?: string; status?: string; cursor?: string; limit?: string }) {
    return this.newsApi.factChecks.list(params);
  }

  async getCorrections(params?: { itemId?: string; correctionType?: string; status?: string; cursor?: string; limit?: string }) {
    return this.newsApi.corrections.list(params);
  }

  async getLiveEvents(params?: { eventType?: string; region?: string; locale?: string; status?: string; cursor?: string; limit?: string }) {
    return this.newsApi.live.events.list(params);
  }

  async getLiveEvent(eventId: string) {
    return this.newsApi.live.events.retrieve(eventId);
  }

  async getLiveUpdates(eventId: string, params?: { cursor?: string; limit?: string }) {
    return this.newsApi.live.updates.list(eventId, params);
  }
}

export function createNewsService(newsApi: NewsApi): NewsService {
  return new NewsService({ newsApi });
}

