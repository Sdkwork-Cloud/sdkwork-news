import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CategoriesListResponse, ChannelsListResponse, ItemsListResponse, NewsApiResult, NewsBreakingAlertListResponse, NewsComment, NewsCommentCommand, NewsCommentPage, NewsCorrectionNoticeListResponse, NewsDigestIssueListResponse, NewsFactCheckListResponse, NewsFavorite, NewsFavoritePage, NewsFeedPage, NewsFollow, NewsFollowCommand, NewsFollowPage, NewsItem, NewsItemPage, NewsItemTrustSnapshot, NewsLiveEvent, NewsLiveEventListResponse, NewsLiveUpdateListResponse, NewsNotificationSubscription, NewsNotificationSubscriptionCommand, NewsNotificationSubscriptionListResponse, NewsOverview, NewsReaction, NewsReactionCommand, NewsRecommendationEventCommand, NewsReportCommand, NewsSearchResultPage, NewsSearchSuggestionListResponse, NewsUserFeedbackCommand, NewsUserInterestCommand, NewsUserInterestSignal, NewsUserInterestSignalListResponse, TopicsListResponse, TrendingListResponse } from '../types';


export interface NewsLiveUpdatesListParams {
  cursor?: string;
  limit?: string;
}

export class NewsLiveUpdatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News live.updates.list */
  async list(eventId: string, params?: NewsLiveUpdatesListParams): Promise<NewsLiveUpdateListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsLiveUpdateListResponse>(appendQueryString(appApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/updates`), query));
  }
}

export interface NewsLiveEventsListParams {
  eventType?: string;
  region?: string;
  locale?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsLiveEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News live.events.list */
  async list(params?: NewsLiveEventsListParams): Promise<NewsLiveEventListResponse> {
    const query = buildQueryString([
      { name: 'event_type', value: params?.eventType, style: 'form', explode: true, allowReserved: false },
      { name: 'region', value: params?.region, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsLiveEventListResponse>(appendQueryString(appApiPath(`/news/live/events`), query));
  }

/** News live.events.retrieve */
  async retrieve(eventId: string): Promise<NewsLiveEvent> {
    return this.client.get<NewsLiveEvent>(appApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}`));
  }
}

export class NewsLiveApi {
  private client: HttpClient;
  public readonly events: NewsLiveEventsApi;
  public readonly updates: NewsLiveUpdatesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.events = new NewsLiveEventsApi(client);
    this.updates = new NewsLiveUpdatesApi(client);
  }

}

export interface NewsCorrectionsListParams {
  itemId?: string;
  correctionType?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsCorrectionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News corrections.list */
  async list(params?: NewsCorrectionsListParams): Promise<NewsCorrectionNoticeListResponse> {
    const query = buildQueryString([
      { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
      { name: 'correction_type', value: params?.correctionType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsCorrectionNoticeListResponse>(appendQueryString(appApiPath(`/news/corrections`), query));
  }
}

export interface NewsFactChecksListParams {
  itemId?: string;
  verdict?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsFactChecksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News factChecks.list */
  async list(params?: NewsFactChecksListParams): Promise<NewsFactCheckListResponse> {
    const query = buildQueryString([
      { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
      { name: 'verdict', value: params?.verdict, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFactCheckListResponse>(appendQueryString(appApiPath(`/news/fact_checks`), query));
  }
}

export class NewsTrustItemApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News trust.item.retrieve */
  async retrieve(itemId: string): Promise<NewsItemTrustSnapshot> {
    return this.client.get<NewsItemTrustSnapshot>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/trust`));
  }
}

export class NewsTrustApi {
  private client: HttpClient;
  public readonly item: NewsTrustItemApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.item = new NewsTrustItemApi(client);
  }

}

export interface NewsDigestsListParams {
  digestType?: string;
  locale?: string;
  cursor?: string;
  limit?: string;
}

export class NewsDigestsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News digests.list */
  async list(params?: NewsDigestsListParams): Promise<NewsDigestIssueListResponse> {
    const query = buildQueryString([
      { name: 'digest_type', value: params?.digestType, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsDigestIssueListResponse>(appendQueryString(appApiPath(`/news/digests`), query));
  }
}

export interface NewsAlertsBreakingListParams {
  severity?: string;
  targetType?: string;
  targetId?: string;
  cursor?: string;
  limit?: string;
}

export class NewsAlertsBreakingApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News alerts.breaking.list */
  async list(params?: NewsAlertsBreakingListParams): Promise<NewsBreakingAlertListResponse> {
    const query = buildQueryString([
      { name: 'severity', value: params?.severity, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_id', value: params?.targetId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsBreakingAlertListResponse>(appendQueryString(appApiPath(`/news/alerts/breaking`), query));
  }
}

export class NewsAlertsApi {
  private client: HttpClient;
  public readonly breaking: NewsAlertsBreakingApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.breaking = new NewsAlertsBreakingApi(client);
  }

}

export interface NewsNotificationSubscriptionsListParams {
  userId?: string;
  targetType?: string;
  targetId?: string;
  channel?: string;
  cursor?: string;
  limit?: string;
}

export class NewsNotificationSubscriptionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News notification.subscriptions.list */
  async list(params?: NewsNotificationSubscriptionsListParams): Promise<NewsNotificationSubscriptionListResponse> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_id', value: params?.targetId, style: 'form', explode: true, allowReserved: false },
      { name: 'channel', value: params?.channel, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsNotificationSubscriptionListResponse>(appendQueryString(appApiPath(`/news/notification/subscriptions`), query));
  }

/** News notification.subscriptions.upsert */
  async upsert(body: NewsNotificationSubscriptionCommand): Promise<NewsNotificationSubscription> {
    return this.client.put<NewsNotificationSubscription>(appApiPath(`/news/notification/subscriptions`), body, undefined, undefined, 'application/json');
  }

/** News notification.subscriptions.delete */
  async delete(subscriptionId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(appApiPath(`/news/notification/subscriptions/${serializePathParameter(subscriptionId, { name: 'subscriptionId', style: 'simple', explode: false })}`));
  }
}

export class NewsNotificationApi {
  private client: HttpClient;
  public readonly subscriptions: NewsNotificationSubscriptionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.subscriptions = new NewsNotificationSubscriptionsApi(client);
  }

}

export interface NewsInterestsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsInterestsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News interests.list */
  async list(params?: NewsInterestsListParams): Promise<NewsUserInterestSignalListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsUserInterestSignalListResponse>(appendQueryString(appApiPath(`/news/interests`), query));
  }

/** News interests.upsert */
  async upsert(body: NewsUserInterestCommand): Promise<NewsUserInterestSignal> {
    return this.client.put<NewsUserInterestSignal>(appApiPath(`/news/interests`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsFollowsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsFollowsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News follows.list */
  async list(params?: NewsFollowsListParams): Promise<NewsFollowPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFollowPage>(appendQueryString(appApiPath(`/news/follows`), query));
  }

/** News follows.create */
  async create(body: NewsFollowCommand): Promise<NewsFollow> {
    return this.client.post<NewsFollow>(appApiPath(`/news/follows`), body, undefined, undefined, 'application/json');
  }

/** News follows.delete */
  async delete(followId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(appApiPath(`/news/follows/${serializePathParameter(followId, { name: 'followId', style: 'simple', explode: false })}`));
  }
}

export interface NewsHistoryListParams {
  cursor?: string;
  limit?: string;
}

export class NewsHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News history.list */
  async list(params?: NewsHistoryListParams): Promise<NewsItemPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsItemPage>(appendQueryString(appApiPath(`/news/history`), query));
  }
}

export class NewsFeedbackApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News feedback.create */
  async create(body: NewsUserFeedbackCommand): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(appApiPath(`/news/feedback`), body, undefined, undefined, 'application/json');
  }
}

export class NewsReportsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News reports.create */
  async create(body: NewsReportCommand): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(appApiPath(`/news/reports`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsCommentsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsCommentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News comments.list */
  async list(itemId: string, params?: NewsCommentsListParams): Promise<NewsCommentPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsCommentPage>(appendQueryString(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/comments`), query));
  }

/** News comments.create */
  async create(itemId: string, body: NewsCommentCommand): Promise<NewsComment> {
    return this.client.post<NewsComment>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/comments`), body, undefined, undefined, 'application/json');
  }
}

export class NewsReactionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News reactions.upsert */
  async upsert(itemId: string, body: NewsReactionCommand): Promise<NewsReaction> {
    return this.client.put<NewsReaction>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/reactions`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsFavoritesListParams {
  cursor?: string;
  limit?: string;
}

export class NewsFavoritesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News favorites.list */
  async list(params?: NewsFavoritesListParams): Promise<NewsFavoritePage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFavoritePage>(appendQueryString(appApiPath(`/news/favorites`), query));
  }

/** News favorites.create */
  async create(itemId: string): Promise<NewsFavorite> {
    return this.client.post<NewsFavorite>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/favorites`));
  }

/** News favorites.delete */
  async delete(itemId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/favorites`));
  }
}

export class NewsEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News events.create */
  async create(body: NewsRecommendationEventCommand): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(appApiPath(`/news/events`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsSearchSuggestionsListParams {
  q?: string;
  cursor?: string;
  limit?: string;
  locale?: string;
}

export class NewsSearchSuggestionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News search.suggestions.list */
  async list(params?: NewsSearchSuggestionsListParams): Promise<NewsSearchSuggestionListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsSearchSuggestionListResponse>(appendQueryString(appApiPath(`/news/search/suggestions`), query));
  }
}

export interface NewsSearchListParams {
  q?: string;
  cursor?: string;
  limit?: string;
}

export class NewsSearchApi {
  private client: HttpClient;
  public readonly suggestions: NewsSearchSuggestionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.suggestions = new NewsSearchSuggestionsApi(client);
  }


/** News search.list */
  async list(params?: NewsSearchListParams): Promise<NewsSearchResultPage> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsSearchResultPage>(appendQueryString(appApiPath(`/news/search`), query));
  }
}

export interface NewsTrendingListParams {
  cursor?: string;
  limit?: string;
}

export class NewsTrendingApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News trending.list */
  async list(params?: NewsTrendingListParams): Promise<TrendingListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TrendingListResponse>(appendQueryString(appApiPath(`/news/trending`), query));
  }
}

export interface NewsFeedPersonalizedListParams {
  cursor?: string;
  limit?: string;
  traceId?: string;
}

export class NewsFeedPersonalizedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News feed.personalized.list */
  async list(params?: NewsFeedPersonalizedListParams): Promise<NewsFeedPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'trace_id', value: params?.traceId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFeedPage>(appendQueryString(appApiPath(`/news/feed/personalized`), query));
  }
}

export class NewsFeedApi {
  private client: HttpClient;
  public readonly personalized: NewsFeedPersonalizedApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.personalized = new NewsFeedPersonalizedApi(client);
  }

}

export interface NewsTopicsItemsListParams {
  cursor?: string;
  limit?: string;
  traceId?: string;
}

export class NewsTopicsItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News topics.items.list */
  async list(topicId: string, params?: NewsTopicsItemsListParams): Promise<NewsItemPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'trace_id', value: params?.traceId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsItemPage>(appendQueryString(appApiPath(`/news/topics/${serializePathParameter(topicId, { name: 'topicId', style: 'simple', explode: false })}/items`), query));
  }
}

export interface NewsTopicsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsTopicsApi {
  private client: HttpClient;
  public readonly items: NewsTopicsItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new NewsTopicsItemsApi(client);
  }


/** News topics.list */
  async list(params?: NewsTopicsListParams): Promise<TopicsListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TopicsListResponse>(appendQueryString(appApiPath(`/news/topics`), query));
  }
}

export interface NewsChannelsFeedListParams {
  cursor?: string;
  limit?: string;
  traceId?: string;
}

export class NewsChannelsFeedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News channels.feed.list */
  async list(channelId: string, params?: NewsChannelsFeedListParams): Promise<NewsFeedPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'trace_id', value: params?.traceId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFeedPage>(appendQueryString(appApiPath(`/news/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}/feed`), query));
  }
}

export interface NewsChannelsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsChannelsApi {
  private client: HttpClient;
  public readonly feed: NewsChannelsFeedApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.feed = new NewsChannelsFeedApi(client);
  }


/** News channels.list */
  async list(params?: NewsChannelsListParams): Promise<ChannelsListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChannelsListResponse>(appendQueryString(appApiPath(`/news/channels`), query));
  }
}

export class NewsOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News overview.retrieve */
  async retrieve(): Promise<NewsOverview> {
    return this.client.get<NewsOverview>(appApiPath(`/news/overview`));
  }
}

export interface NewsItemsRelatedListParams {
  cursor?: string;
  limit?: string;
}

export class NewsItemsRelatedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.related.list */
  async list(itemId: string, params?: NewsItemsRelatedListParams): Promise<NewsItemPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsItemPage>(appendQueryString(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/related`), query));
  }
}

export class NewsItemsBySlugApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.bySlug.retrieve */
  async retrieve(slug: string): Promise<NewsItem> {
    return this.client.get<NewsItem>(appApiPath(`/news/items/by_slug/${serializePathParameter(slug, { name: 'slug', style: 'simple', explode: false })}`));
  }
}

export interface NewsItemsListParams {
  categoryId?: string;
  q?: string;
  status?: string;
}

export class NewsItemsApi {
  private client: HttpClient;
  public readonly bySlug: NewsItemsBySlugApi;
  public readonly related: NewsItemsRelatedApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.bySlug = new NewsItemsBySlugApi(client);
    this.related = new NewsItemsRelatedApi(client);
  }


/** News items.list */
  async list(params?: NewsItemsListParams): Promise<ItemsListResponse> {
    const query = buildQueryString([
      { name: 'categoryId', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ItemsListResponse>(appendQueryString(appApiPath(`/news/items`), query));
  }

/** News items.retrieve */
  async retrieve(itemId: string): Promise<NewsItem> {
    return this.client.get<NewsItem>(appApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
  }
}

export class NewsCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News categories.list */
  async list(): Promise<CategoriesListResponse> {
    return this.client.get<CategoriesListResponse>(appApiPath(`/news/categories`));
  }
}

export class NewsApi {
  private client: HttpClient;
  public readonly categories: NewsCategoriesApi;
  public readonly items: NewsItemsApi;
  public readonly overview: NewsOverviewApi;
  public readonly channels: NewsChannelsApi;
  public readonly topics: NewsTopicsApi;
  public readonly feed: NewsFeedApi;
  public readonly trending: NewsTrendingApi;
  public readonly search: NewsSearchApi;
  public readonly events: NewsEventsApi;
  public readonly favorites: NewsFavoritesApi;
  public readonly reactions: NewsReactionsApi;
  public readonly comments: NewsCommentsApi;
  public readonly reports: NewsReportsApi;
  public readonly feedback: NewsFeedbackApi;
  public readonly history: NewsHistoryApi;
  public readonly follows: NewsFollowsApi;
  public readonly interests: NewsInterestsApi;
  public readonly notification: NewsNotificationApi;
  public readonly alerts: NewsAlertsApi;
  public readonly digests: NewsDigestsApi;
  public readonly trust: NewsTrustApi;
  public readonly factChecks: NewsFactChecksApi;
  public readonly corrections: NewsCorrectionsApi;
  public readonly live: NewsLiveApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.categories = new NewsCategoriesApi(client);
    this.items = new NewsItemsApi(client);
    this.overview = new NewsOverviewApi(client);
    this.channels = new NewsChannelsApi(client);
    this.topics = new NewsTopicsApi(client);
    this.feed = new NewsFeedApi(client);
    this.trending = new NewsTrendingApi(client);
    this.search = new NewsSearchApi(client);
    this.events = new NewsEventsApi(client);
    this.favorites = new NewsFavoritesApi(client);
    this.reactions = new NewsReactionsApi(client);
    this.comments = new NewsCommentsApi(client);
    this.reports = new NewsReportsApi(client);
    this.feedback = new NewsFeedbackApi(client);
    this.history = new NewsHistoryApi(client);
    this.follows = new NewsFollowsApi(client);
    this.interests = new NewsInterestsApi(client);
    this.notification = new NewsNotificationApi(client);
    this.alerts = new NewsAlertsApi(client);
    this.digests = new NewsDigestsApi(client);
    this.trust = new NewsTrustApi(client);
    this.factChecks = new NewsFactChecksApi(client);
    this.corrections = new NewsCorrectionsApi(client);
    this.live = new NewsLiveApi(client);
  }

}

export function createNewsApi(client: HttpClient): NewsApi {
  return new NewsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
