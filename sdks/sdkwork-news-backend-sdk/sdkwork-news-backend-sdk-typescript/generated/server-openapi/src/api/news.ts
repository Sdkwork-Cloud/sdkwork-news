import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { MediaResource, NewsAuthor, NewsBreakingAlert, NewsBreakingAlertCommand, NewsCategory, NewsCategoryCommand, NewsChannel, NewsComment, NewsCorrectionNotice, NewsCorrectionNoticeCommand, NewsDigestIssue, NewsDigestIssueCommand, NewsDigestItemCommand, NewsEditorialReadiness, NewsExperiment, NewsFactCheck, NewsFactCheckCommand, NewsFeedCandidate, NewsFeedCandidateCommand, NewsGenericCommand, NewsItem, NewsItemCommand, NewsItemMetricSnapshot, NewsItemTrustSnapshot, NewsItemTrustSnapshotCommand, NewsLiveEvent, NewsLiveEventCommand, NewsLiveEventItemCommand, NewsLiveUpdate, NewsLiveUpdateCommand, NewsModerationCase, NewsScheduleCommand, NewsSearchEvent, NewsSearchSuggestion, NewsSearchSuggestionCommand, NewsSource, NewsSourceTrustProfile, NewsSourceTrustProfileCommand, NewsTopic, NewsTrendingMetric, PageInfo, SdkWorkCommandData, SdkWorkPageData } from '../types';


export class NewsLiveItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News live.items.attach */
  async attach(eventId: string, body: NewsLiveEventItemCommand): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/items`), body, undefined, undefined, 'application/json');
  }
}

export class NewsLiveUpdatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News live.updates.create */
  async create(eventId: string, body: NewsLiveUpdateCommand): Promise<NewsLiveUpdate> {
    return this.client.post<NewsLiveUpdate>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/updates`), body, undefined, undefined, 'application/json');
  }

/** News live.updates.update */
  async update(eventId: string, updateId: string, body: NewsLiveUpdateCommand): Promise<NewsLiveUpdate> {
    return this.client.patch<NewsLiveUpdate>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/updates/${serializePathParameter(updateId, { name: 'updateId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News live.updates.publish */
  async publish(eventId: string, updateId: string): Promise<NewsLiveUpdate> {
    return this.client.post<NewsLiveUpdate>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/updates/${serializePathParameter(updateId, { name: 'updateId', style: 'simple', explode: false })}/publish`));
  }
}

export interface NewsLiveEventsManagementListParams {
  eventType?: string;
  region?: string;
  locale?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsLiveEventsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News live.events.management.list */
  async list(params?: NewsLiveEventsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'event_type', value: params?.eventType, style: 'form', explode: true, allowReserved: false },
      { name: 'region', value: params?.region, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/live/events`), query));
  }
}

export class NewsLiveEventsApi {
  private client: HttpClient;
  public readonly management: NewsLiveEventsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsLiveEventsManagementApi(client);
  }


/** News live.events.create */
  async create(body: NewsLiveEventCommand): Promise<NewsLiveEvent> {
    return this.client.post<NewsLiveEvent>(backendApiPath(`/news/live/events`), body, undefined, undefined, 'application/json');
  }

/** News live.events.update */
  async update(eventId: string, body: NewsLiveEventCommand): Promise<NewsLiveEvent> {
    return this.client.patch<NewsLiveEvent>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News live.events.publish */
  async publish(eventId: string): Promise<NewsLiveEvent> {
    return this.client.post<NewsLiveEvent>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/publish`));
  }

/** News live.events.close */
  async close(eventId: string): Promise<NewsLiveEvent> {
    return this.client.post<NewsLiveEvent>(backendApiPath(`/news/live/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}/close`));
  }
}

export class NewsLiveApi {
  private client: HttpClient;
  public readonly events: NewsLiveEventsApi;
  public readonly updates: NewsLiveUpdatesApi;
  public readonly items: NewsLiveItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.events = new NewsLiveEventsApi(client);
    this.updates = new NewsLiveUpdatesApi(client);
    this.items = new NewsLiveItemsApi(client);
  }

}

export interface NewsCorrectionsManagementListParams {
  itemId?: string;
  correctionType?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsCorrectionsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News corrections.management.list */
  async list(params?: NewsCorrectionsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
      { name: 'correction_type', value: params?.correctionType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/corrections`), query));
  }
}

export class NewsCorrectionsApi {
  private client: HttpClient;
  public readonly management: NewsCorrectionsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsCorrectionsManagementApi(client);
  }


/** News corrections.create */
  async create(body: NewsCorrectionNoticeCommand): Promise<NewsCorrectionNotice> {
    return this.client.post<NewsCorrectionNotice>(backendApiPath(`/news/corrections`), body, undefined, undefined, 'application/json');
  }

/** News corrections.publish */
  async publish(correctionId: string): Promise<NewsCorrectionNotice> {
    return this.client.post<NewsCorrectionNotice>(backendApiPath(`/news/corrections/${serializePathParameter(correctionId, { name: 'correctionId', style: 'simple', explode: false })}/publish`));
  }

/** News corrections.archive */
  async archive(correctionId: string): Promise<NewsCorrectionNotice> {
    return this.client.post<NewsCorrectionNotice>(backendApiPath(`/news/corrections/${serializePathParameter(correctionId, { name: 'correctionId', style: 'simple', explode: false })}/archive`));
  }
}

export interface NewsFactChecksManagementListParams {
  itemId?: string;
  verdict?: string;
  status?: string;
  cursor?: string;
  limit?: string;
}

export class NewsFactChecksManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News factChecks.management.list */
  async list(params?: NewsFactChecksManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
      { name: 'verdict', value: params?.verdict, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/fact_checks`), query));
  }
}

export class NewsFactChecksApi {
  private client: HttpClient;
  public readonly management: NewsFactChecksManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsFactChecksManagementApi(client);
  }


/** News factChecks.create */
  async create(body: NewsFactCheckCommand): Promise<NewsFactCheck> {
    return this.client.post<NewsFactCheck>(backendApiPath(`/news/fact_checks`), body, undefined, undefined, 'application/json');
  }

/** News factChecks.publish */
  async publish(factCheckId: string): Promise<NewsFactCheck> {
    return this.client.post<NewsFactCheck>(backendApiPath(`/news/fact_checks/${serializePathParameter(factCheckId, { name: 'factCheckId', style: 'simple', explode: false })}/publish`));
  }

/** News factChecks.archive */
  async archive(factCheckId: string): Promise<NewsFactCheck> {
    return this.client.post<NewsFactCheck>(backendApiPath(`/news/fact_checks/${serializePathParameter(factCheckId, { name: 'factCheckId', style: 'simple', explode: false })}/archive`));
  }
}

export class NewsTrustItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News trust.items.retrieve */
  async retrieve(itemId: string): Promise<NewsItemTrustSnapshot> {
    return this.client.get<NewsItemTrustSnapshot>(backendApiPath(`/news/trust/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
  }

/** News trust.items.upsert */
  async upsert(itemId: string, body: NewsItemTrustSnapshotCommand): Promise<NewsItemTrustSnapshot> {
    return this.client.put<NewsItemTrustSnapshot>(backendApiPath(`/news/trust/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsTrustSourcesManagementListParams {
  sourceId?: string;
  credibilityStatus?: string;
  trustTier?: string;
  cursor?: string;
  limit?: string;
}

export class NewsTrustSourcesManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News trust.sources.management.list */
  async list(params?: NewsTrustSourcesManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'source_id', value: params?.sourceId, style: 'form', explode: true, allowReserved: false },
      { name: 'credibility_status', value: params?.credibilityStatus, style: 'form', explode: true, allowReserved: false },
      { name: 'trust_tier', value: params?.trustTier, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/trust/sources`), query));
  }
}

export class NewsTrustSourcesApi {
  private client: HttpClient;
  public readonly management: NewsTrustSourcesManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsTrustSourcesManagementApi(client);
  }


/** News trust.sources.upsert */
  async upsert(body: NewsSourceTrustProfileCommand): Promise<NewsSourceTrustProfile> {
    return this.client.put<NewsSourceTrustProfile>(backendApiPath(`/news/trust/sources`), body, undefined, undefined, 'application/json');
  }
}

export class NewsTrustApi {
  private client: HttpClient;
  public readonly sources: NewsTrustSourcesApi;
  public readonly items: NewsTrustItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.sources = new NewsTrustSourcesApi(client);
    this.items = new NewsTrustItemsApi(client);
  }

}

export class NewsDigestsItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News digests.items.attach */
  async attach(digestId: string, body: NewsDigestItemCommand): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/news/digests/${serializePathParameter(digestId, { name: 'digestId', style: 'simple', explode: false })}/items`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsDigestsManagementListParams {
  digestType?: string;
  locale?: string;
  cursor?: string;
  limit?: string;
}

export class NewsDigestsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News digests.management.list */
  async list(params?: NewsDigestsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'digest_type', value: params?.digestType, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/digests`), query));
  }
}

export class NewsDigestsApi {
  private client: HttpClient;
  public readonly management: NewsDigestsManagementApi;
  public readonly items: NewsDigestsItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsDigestsManagementApi(client);
    this.items = new NewsDigestsItemsApi(client);
  }


/** News digests.create */
  async create(body: NewsDigestIssueCommand): Promise<NewsDigestIssue> {
    return this.client.post<NewsDigestIssue>(backendApiPath(`/news/digests`), body, undefined, undefined, 'application/json');
  }

/** News digests.publish */
  async publish(digestId: string): Promise<NewsDigestIssue> {
    return this.client.post<NewsDigestIssue>(backendApiPath(`/news/digests/${serializePathParameter(digestId, { name: 'digestId', style: 'simple', explode: false })}/publish`));
  }
}

export interface NewsAlertsBreakingManagementListParams {
  severity?: string;
  targetType?: string;
  targetId?: string;
  cursor?: string;
  limit?: string;
}

export class NewsAlertsBreakingManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News alerts.breaking.management.list */
  async list(params?: NewsAlertsBreakingManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'severity', value: params?.severity, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_id', value: params?.targetId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/alerts/breaking`), query));
  }
}

export class NewsAlertsBreakingApi {
  private client: HttpClient;
  public readonly management: NewsAlertsBreakingManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsAlertsBreakingManagementApi(client);
  }


/** News alerts.breaking.create */
  async create(body: NewsBreakingAlertCommand): Promise<NewsBreakingAlert> {
    return this.client.post<NewsBreakingAlert>(backendApiPath(`/news/alerts/breaking`), body, undefined, undefined, 'application/json');
  }

/** News alerts.breaking.update */
  async update(alertId: string, body: NewsBreakingAlertCommand): Promise<NewsBreakingAlert> {
    return this.client.patch<NewsBreakingAlert>(backendApiPath(`/news/alerts/breaking/${serializePathParameter(alertId, { name: 'alertId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News alerts.breaking.publish */
  async publish(alertId: string): Promise<NewsBreakingAlert> {
    return this.client.post<NewsBreakingAlert>(backendApiPath(`/news/alerts/breaking/${serializePathParameter(alertId, { name: 'alertId', style: 'simple', explode: false })}/publish`));
  }

/** News alerts.breaking.cancel */
  async cancel(alertId: string): Promise<NewsBreakingAlert> {
    return this.client.post<NewsBreakingAlert>(backendApiPath(`/news/alerts/breaking/${serializePathParameter(alertId, { name: 'alertId', style: 'simple', explode: false })}/cancel`));
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

export interface NewsNotificationSubscriptionsManagementListParams {
  userId?: string;
  targetType?: string;
  targetId?: string;
  channel?: string;
  cursor?: string;
  limit?: string;
}

export class NewsNotificationSubscriptionsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News notification.subscriptions.management.list */
  async list(params?: NewsNotificationSubscriptionsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'target_id', value: params?.targetId, style: 'form', explode: true, allowReserved: false },
      { name: 'channel', value: params?.channel, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/notification/subscriptions`), query));
  }
}

export class NewsNotificationSubscriptionsApi {
  private client: HttpClient;
  public readonly management: NewsNotificationSubscriptionsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsNotificationSubscriptionsManagementApi(client);
  }


/** News notification.subscriptions.delete */
  async delete(subscriptionId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/notification/subscriptions/${serializePathParameter(subscriptionId, { name: 'subscriptionId', style: 'simple', explode: false })}`));
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

export interface NewsExperimentsManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsExperimentsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News experiments.management.list */
  async list(params?: NewsExperimentsManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/experiments`), query));
  }
}

export class NewsExperimentsApi {
  private client: HttpClient;
  public readonly management: NewsExperimentsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsExperimentsManagementApi(client);
  }


/** News experiments.create */
  async create(body: NewsGenericCommand): Promise<NewsExperiment> {
    return this.client.post<NewsExperiment>(backendApiPath(`/news/experiments`), body, undefined, undefined, 'application/json');
  }

/** News experiments.update */
  async update(experimentId: string, body: NewsGenericCommand): Promise<NewsExperiment> {
    return this.client.patch<NewsExperiment>(backendApiPath(`/news/experiments/${serializePathParameter(experimentId, { name: 'experimentId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News experiments.archive */
  async archive(experimentId: string): Promise<NewsExperiment> {
    return this.client.post<NewsExperiment>(backendApiPath(`/news/experiments/${serializePathParameter(experimentId, { name: 'experimentId', style: 'simple', explode: false })}/archive`));
  }
}

export class NewsSearchProjectionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News search.projections.rebuild */
  async rebuild(): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/news/search/projections/rebuild`));
  }
}

export interface NewsSearchEventsListParams {
  q?: string;
  userId?: string;
  cursor?: string;
  limit?: string;
}

export class NewsSearchEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News search.events.list */
  async list(params?: NewsSearchEventsListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/search/events`), query));
  }
}

export interface NewsSearchSuggestionsManagementListParams {
  q?: string;
  cursor?: string;
  limit?: string;
  locale?: string;
}

export class NewsSearchSuggestionsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News search.suggestions.management.list */
  async list(params?: NewsSearchSuggestionsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/search/suggestions`), query));
  }
}

export class NewsSearchSuggestionsApi {
  private client: HttpClient;
  public readonly management: NewsSearchSuggestionsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsSearchSuggestionsManagementApi(client);
  }


/** News search.suggestions.upsert */
  async upsert(body: NewsSearchSuggestionCommand): Promise<NewsSearchSuggestion> {
    return this.client.put<NewsSearchSuggestion>(backendApiPath(`/news/search/suggestions`), body, undefined, undefined, 'application/json');
  }

/** News search.suggestions.delete */
  async delete(suggestionId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/search/suggestions/${serializePathParameter(suggestionId, { name: 'suggestionId', style: 'simple', explode: false })}`));
  }
}

export class NewsSearchApi {
  private client: HttpClient;
  public readonly suggestions: NewsSearchSuggestionsApi;
  public readonly events: NewsSearchEventsApi;
  public readonly projections: NewsSearchProjectionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.suggestions = new NewsSearchSuggestionsApi(client);
    this.events = new NewsSearchEventsApi(client);
    this.projections = new NewsSearchProjectionsApi(client);
  }

}

export interface NewsInterestsManagementListParams {
  userId?: string;
  targetType?: string;
  cursor?: string;
  limit?: string;
}

export class NewsInterestsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News interests.management.list */
  async list(params?: NewsInterestsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/interests`), query));
  }
}

export class NewsInterestsApi {
  private client: HttpClient;
  public readonly management: NewsInterestsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsInterestsManagementApi(client);
  }


/** News interests.rebuild */
  async rebuild(body: NewsGenericCommand): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/news/interests/rebuild`), body, undefined, undefined, 'application/json');
  }

/** News interests.delete */
  async delete(interestId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/interests/${serializePathParameter(interestId, { name: 'interestId', style: 'simple', explode: false })}`));
  }
}

export interface NewsFeedCandidatesListParams {
  streamKey?: string;
  userId?: string;
  cursor?: string;
  limit?: string;
}

export class NewsFeedCandidatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News feed.candidates.list */
  async list(params?: NewsFeedCandidatesListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'stream_key', value: params?.streamKey, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/feed/candidates`), query));
  }

/** News feed.candidates.upsert */
  async upsert(body: NewsFeedCandidateCommand): Promise<NewsFeedCandidate> {
    return this.client.put<NewsFeedCandidate>(backendApiPath(`/news/feed/candidates`), body, undefined, undefined, 'application/json');
  }

/** News feed.candidates.delete */
  async delete(candidateId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/feed/candidates/${serializePathParameter(candidateId, { name: 'candidateId', style: 'simple', explode: false })}`));
  }
}

export class NewsFeedApi {
  private client: HttpClient;
  public readonly candidates: NewsFeedCandidatesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.candidates = new NewsFeedCandidatesApi(client);
  }

}

export interface NewsTrendingMetricsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsTrendingMetricsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News trending.metrics.list */
  async list(params?: NewsTrendingMetricsListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/trending/metrics`), query));
  }

/** News trending.metrics.upsert */
  async upsert(body: NewsGenericCommand): Promise<NewsTrendingMetric> {
    return this.client.put<NewsTrendingMetric>(backendApiPath(`/news/trending/metrics`), body, undefined, undefined, 'application/json');
  }
}

export class NewsTrendingApi {
  private client: HttpClient;
  public readonly metrics: NewsTrendingMetricsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.metrics = new NewsTrendingMetricsApi(client);
  }

}

export interface NewsReportsManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsReportsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News reports.management.list */
  async list(params?: NewsReportsManagementListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(backendApiPath(`/news/reports`), query));
  }
}

export class NewsReportsApi {
  private client: HttpClient;
  public readonly management: NewsReportsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsReportsManagementApi(client);
  }


/** News reports.update */
  async update(reportId: string, body: NewsGenericCommand): Promise<Record<string, unknown>> {
    return this.client.patch<Record<string, unknown>>(backendApiPath(`/news/reports/${serializePathParameter(reportId, { name: 'reportId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface NewsCommentsModerationListParams {
  cursor?: string;
  limit?: string;
}

export class NewsCommentsModerationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News comments.moderation.list */
  async list(params?: NewsCommentsModerationListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/comments/moderation`), query));
  }

/** News comments.moderation.update */
  async update(commentId: string, body: NewsGenericCommand): Promise<NewsComment> {
    return this.client.patch<NewsComment>(backendApiPath(`/news/comments/${serializePathParameter(commentId, { name: 'commentId', style: 'simple', explode: false })}/moderation`), body, undefined, undefined, 'application/json');
  }
}

export class NewsCommentsApi {
  private client: HttpClient;
  public readonly moderation: NewsCommentsModerationApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.moderation = new NewsCommentsModerationApi(client);
  }

}

export interface NewsModerationCasesListParams {
  cursor?: string;
  limit?: string;
}

export class NewsModerationCasesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News moderation.cases.list */
  async list(params?: NewsModerationCasesListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/moderation/cases`), query));
  }

/** News moderation.cases.retrieve */
  async retrieve(caseId: string): Promise<NewsModerationCase> {
    return this.client.get<NewsModerationCase>(backendApiPath(`/news/moderation/cases/${serializePathParameter(caseId, { name: 'caseId', style: 'simple', explode: false })}`));
  }

/** News moderation.cases.update */
  async update(caseId: string, body: NewsGenericCommand): Promise<NewsModerationCase> {
    return this.client.patch<NewsModerationCase>(backendApiPath(`/news/moderation/cases/${serializePathParameter(caseId, { name: 'caseId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class NewsModerationApi {
  private client: HttpClient;
  public readonly cases: NewsModerationCasesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.cases = new NewsModerationCasesApi(client);
  }

}

export interface NewsTopicsManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsTopicsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News topics.management.list */
  async list(params?: NewsTopicsManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/topics`), query));
  }
}

export class NewsTopicsApi {
  private client: HttpClient;
  public readonly management: NewsTopicsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsTopicsManagementApi(client);
  }


/** News topics.create */
  async create(body: NewsGenericCommand): Promise<NewsTopic> {
    return this.client.post<NewsTopic>(backendApiPath(`/news/topics`), body, undefined, undefined, 'application/json');
  }

/** News topics.update */
  async update(topicId: string, body: NewsGenericCommand): Promise<NewsTopic> {
    return this.client.patch<NewsTopic>(backendApiPath(`/news/topics/${serializePathParameter(topicId, { name: 'topicId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News topics.delete */
  async delete(topicId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/topics/${serializePathParameter(topicId, { name: 'topicId', style: 'simple', explode: false })}`));
  }
}

export interface NewsChannelsManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsChannelsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News channels.management.list */
  async list(params?: NewsChannelsManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/channels`), query));
  }
}

export class NewsChannelsApi {
  private client: HttpClient;
  public readonly management: NewsChannelsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsChannelsManagementApi(client);
  }


/** News channels.create */
  async create(body: NewsGenericCommand): Promise<NewsChannel> {
    return this.client.post<NewsChannel>(backendApiPath(`/news/channels`), body, undefined, undefined, 'application/json');
  }

/** News channels.update */
  async update(channelId: string, body: NewsGenericCommand): Promise<NewsChannel> {
    return this.client.patch<NewsChannel>(backendApiPath(`/news/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News channels.delete */
  async delete(channelId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}`));
  }
}

export interface NewsAuthorsManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsAuthorsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News authors.management.list */
  async list(params?: NewsAuthorsManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/authors`), query));
  }
}

export class NewsAuthorsApi {
  private client: HttpClient;
  public readonly management: NewsAuthorsManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsAuthorsManagementApi(client);
  }


/** News authors.create */
  async create(body: NewsGenericCommand): Promise<NewsAuthor> {
    return this.client.post<NewsAuthor>(backendApiPath(`/news/authors`), body, undefined, undefined, 'application/json');
  }

/** News authors.update */
  async update(authorId: string, body: NewsGenericCommand): Promise<NewsAuthor> {
    return this.client.patch<NewsAuthor>(backendApiPath(`/news/authors/${serializePathParameter(authorId, { name: 'authorId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News authors.delete */
  async delete(authorId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/authors/${serializePathParameter(authorId, { name: 'authorId', style: 'simple', explode: false })}`));
  }
}

export interface NewsSourcesManagementListParams {
  cursor?: string;
  limit?: string;
}

export class NewsSourcesManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News sources.management.list */
  async list(params?: NewsSourcesManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/sources`), query));
  }
}

export class NewsSourcesApi {
  private client: HttpClient;
  public readonly management: NewsSourcesManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsSourcesManagementApi(client);
  }


/** News sources.create */
  async create(body: NewsGenericCommand): Promise<NewsSource> {
    return this.client.post<NewsSource>(backendApiPath(`/news/sources`), body, undefined, undefined, 'application/json');
  }

/** News sources.update */
  async update(sourceId: string, body: NewsGenericCommand): Promise<NewsSource> {
    return this.client.patch<NewsSource>(backendApiPath(`/news/sources/${serializePathParameter(sourceId, { name: 'sourceId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News sources.delete */
  async delete(sourceId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/sources/${serializePathParameter(sourceId, { name: 'sourceId', style: 'simple', explode: false })}`));
  }
}

export interface NewsItemsMetricsListParams {
  cursor?: string;
  limit?: string;
}

export class NewsItemsMetricsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.metrics.list */
  async list(params?: NewsItemsMetricsListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/items/metrics`), query));
  }

/** News items.metrics.retrieve */
  async retrieve(itemId: string): Promise<NewsItemMetricSnapshot> {
    return this.client.get<NewsItemMetricSnapshot>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/metrics`));
  }

/** News items.metrics.rebuild */
  async rebuild(body: NewsGenericCommand): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/news/items/metrics/rebuild`), body, undefined, undefined, 'application/json');
  }
}

export class NewsItemsMediaApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.media.list */
  async list(itemId: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media`));
  }

/** News items.media.attach */
  async attach(itemId: string, body: MediaResource): Promise<MediaResource> {
    return this.client.post<MediaResource>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media`), body, undefined, undefined, 'application/json');
  }

/** News items.media.delete */
  async delete(itemId: string, mediaId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media/${serializePathParameter(mediaId, { name: 'mediaId', style: 'simple', explode: false })}`));
  }
}

export class NewsItemsVersionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.versions.list */
  async list(itemId: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/versions`));
  }

/** News items.versions.create */
  async create(itemId: string, body: NewsItemCommand): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/versions`), body, undefined, undefined, 'application/json');
  }
}

export class NewsItemsEditorialReadinessApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.editorialReadiness.retrieve */
  async retrieve(itemId: string): Promise<NewsEditorialReadiness> {
    return this.client.get<NewsEditorialReadiness>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/editorial_readiness`));
  }
}

export interface NewsItemsManagementListParams {
  categoryId?: string;
  q?: string;
  status?: string;
}

export class NewsItemsManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.management.list */
  async list(params?: NewsItemsManagementListParams): Promise<Record<string, unknown>> {
    const query = buildQueryString([
      { name: 'categoryId', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<Record<string, unknown>>(appendQueryString(backendApiPath(`/news/items`), query));
  }
}

export class NewsItemsApi {
  private client: HttpClient;
  public readonly management: NewsItemsManagementApi;
  public readonly editorialReadiness: NewsItemsEditorialReadinessApi;
  public readonly versions: NewsItemsVersionsApi;
  public readonly media: NewsItemsMediaApi;
  public readonly metrics: NewsItemsMetricsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsItemsManagementApi(client);
    this.editorialReadiness = new NewsItemsEditorialReadinessApi(client);
    this.versions = new NewsItemsVersionsApi(client);
    this.media = new NewsItemsMediaApi(client);
    this.metrics = new NewsItemsMetricsApi(client);
  }


/** News items.create */
  async create(body: NewsItemCommand): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items`), body, undefined, undefined, 'application/json');
  }

/** News items.update */
  async update(itemId: string, body: NewsItemCommand): Promise<NewsItem> {
    return this.client.patch<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News items.delete */
  async delete(itemId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
  }

/** News items.publish */
  async publish(itemId: string): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/publish`));
  }

/** News items.schedule */
  async schedule(itemId: string, body: NewsScheduleCommand): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/schedule`), body, undefined, undefined, 'application/json');
  }

/** News items.archive */
  async archive(itemId: string): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/archive`));
  }

/** News items.feature */
  async feature(itemId: string): Promise<NewsItem> {
    return this.client.post<NewsItem>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/feature`));
  }
}

export class NewsCategoriesManagementApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News categories.management.list */
  async list(): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(backendApiPath(`/news/categories`));
  }
}

export class NewsCategoriesApi {
  private client: HttpClient;
  public readonly management: NewsCategoriesManagementApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.management = new NewsCategoriesManagementApi(client);
  }


/** News categories.create */
  async create(body: NewsCategoryCommand): Promise<NewsCategory> {
    return this.client.post<NewsCategory>(backendApiPath(`/news/categories`), body, undefined, undefined, 'application/json');
  }

/** News categories.update */
  async update(categoryId: string, body: NewsCategoryCommand): Promise<NewsCategory> {
    return this.client.patch<NewsCategory>(backendApiPath(`/news/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** News categories.delete */
  async delete(categoryId: string): Promise<SdkWorkCommandData> {
    return this.client.delete<SdkWorkCommandData>(backendApiPath(`/news/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`));
  }
}

export class NewsApi {
  private client: HttpClient;
  public readonly categories: NewsCategoriesApi;
  public readonly items: NewsItemsApi;
  public readonly sources: NewsSourcesApi;
  public readonly authors: NewsAuthorsApi;
  public readonly channels: NewsChannelsApi;
  public readonly topics: NewsTopicsApi;
  public readonly moderation: NewsModerationApi;
  public readonly comments: NewsCommentsApi;
  public readonly reports: NewsReportsApi;
  public readonly trending: NewsTrendingApi;
  public readonly feed: NewsFeedApi;
  public readonly interests: NewsInterestsApi;
  public readonly search: NewsSearchApi;
  public readonly experiments: NewsExperimentsApi;
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
    this.sources = new NewsSourcesApi(client);
    this.authors = new NewsAuthorsApi(client);
    this.channels = new NewsChannelsApi(client);
    this.topics = new NewsTopicsApi(client);
    this.moderation = new NewsModerationApi(client);
    this.comments = new NewsCommentsApi(client);
    this.reports = new NewsReportsApi(client);
    this.trending = new NewsTrendingApi(client);
    this.feed = new NewsFeedApi(client);
    this.interests = new NewsInterestsApi(client);
    this.search = new NewsSearchApi(client);
    this.experiments = new NewsExperimentsApi(client);
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
