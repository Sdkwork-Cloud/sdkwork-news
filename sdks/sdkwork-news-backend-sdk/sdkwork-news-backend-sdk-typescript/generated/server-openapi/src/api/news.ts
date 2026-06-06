import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AuthorsManagementListResponse, CategoriesManagementListResponse, ChannelsManagementListResponse, CommentsModerationListResponse, ExperimentsManagementListResponse, ItemsManagementListResponse, ItemsMediaListResponse, ItemsMetricsListResponse, ItemsVersionsListResponse, MediaResource, ModerationCasesListResponse, NewsApiResult, NewsAuthor, NewsCategory, NewsCategoryCommand, NewsChannel, NewsComment, NewsEditorialReadiness, NewsExperiment, NewsFeedCandidate, NewsFeedCandidateCommand, NewsFeedCandidateListResponse, NewsGenericCommand, NewsItem, NewsItemCommand, NewsItemMetricSnapshot, NewsModerationCase, NewsScheduleCommand, NewsSearchSuggestion, NewsSearchSuggestionCommand, NewsSearchSuggestionListResponse, NewsSource, NewsTopic, NewsTrendingMetric, NewsUserInterestSignalListResponse, SearchEventsListResponse, SourcesManagementListResponse, TopicsManagementListResponse, TrendingMetricsListResponse } from '../types';


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
  async list(params?: NewsExperimentsManagementListParams): Promise<ExperimentsManagementListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ExperimentsManagementListResponse>(appendQueryString(backendApiPath(`/news/experiments`), query));
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
  async rebuild(): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(backendApiPath(`/news/search/projections/rebuild`));
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
  async list(params?: NewsSearchEventsListParams): Promise<SearchEventsListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SearchEventsListResponse>(appendQueryString(backendApiPath(`/news/search/events`), query));
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
  async list(params?: NewsSearchSuggestionsManagementListParams): Promise<NewsSearchSuggestionListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsSearchSuggestionListResponse>(appendQueryString(backendApiPath(`/news/search/suggestions`), query));
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
  async delete(suggestionId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/search/suggestions/${serializePathParameter(suggestionId, { name: 'suggestionId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsInterestsManagementListParams): Promise<NewsUserInterestSignalListResponse> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsUserInterestSignalListResponse>(appendQueryString(backendApiPath(`/news/interests`), query));
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
  async rebuild(body: NewsGenericCommand): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(backendApiPath(`/news/interests/rebuild`), body, undefined, undefined, 'application/json');
  }

/** News interests.delete */
  async delete(interestId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/interests/${serializePathParameter(interestId, { name: 'interestId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsFeedCandidatesListParams): Promise<NewsFeedCandidateListResponse> {
    const query = buildQueryString([
      { name: 'stream_key', value: params?.streamKey, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFeedCandidateListResponse>(appendQueryString(backendApiPath(`/news/feed/candidates`), query));
  }

/** News feed.candidates.upsert */
  async upsert(body: NewsFeedCandidateCommand): Promise<NewsFeedCandidate> {
    return this.client.put<NewsFeedCandidate>(backendApiPath(`/news/feed/candidates`), body, undefined, undefined, 'application/json');
  }

/** News feed.candidates.delete */
  async delete(candidateId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/feed/candidates/${serializePathParameter(candidateId, { name: 'candidateId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsTrendingMetricsListParams): Promise<TrendingMetricsListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TrendingMetricsListResponse>(appendQueryString(backendApiPath(`/news/trending/metrics`), query));
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
  async list(params?: NewsReportsManagementListParams): Promise<NewsApiResult> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsApiResult>(appendQueryString(backendApiPath(`/news/reports`), query));
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
  async update(reportId: string, body: NewsGenericCommand): Promise<NewsApiResult> {
    return this.client.patch<NewsApiResult>(backendApiPath(`/news/reports/${serializePathParameter(reportId, { name: 'reportId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
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
  async list(params?: NewsCommentsModerationListParams): Promise<CommentsModerationListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommentsModerationListResponse>(appendQueryString(backendApiPath(`/news/comments/moderation`), query));
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
  async list(params?: NewsModerationCasesListParams): Promise<ModerationCasesListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ModerationCasesListResponse>(appendQueryString(backendApiPath(`/news/moderation/cases`), query));
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
  async list(params?: NewsTopicsManagementListParams): Promise<TopicsManagementListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TopicsManagementListResponse>(appendQueryString(backendApiPath(`/news/topics`), query));
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
  async delete(topicId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/topics/${serializePathParameter(topicId, { name: 'topicId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsChannelsManagementListParams): Promise<ChannelsManagementListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChannelsManagementListResponse>(appendQueryString(backendApiPath(`/news/channels`), query));
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
  async delete(channelId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsAuthorsManagementListParams): Promise<AuthorsManagementListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AuthorsManagementListResponse>(appendQueryString(backendApiPath(`/news/authors`), query));
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
  async delete(authorId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/authors/${serializePathParameter(authorId, { name: 'authorId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsSourcesManagementListParams): Promise<SourcesManagementListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SourcesManagementListResponse>(appendQueryString(backendApiPath(`/news/sources`), query));
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
  async delete(sourceId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/sources/${serializePathParameter(sourceId, { name: 'sourceId', style: 'simple', explode: false })}`));
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
  async list(params?: NewsItemsMetricsListParams): Promise<ItemsMetricsListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ItemsMetricsListResponse>(appendQueryString(backendApiPath(`/news/items/metrics`), query));
  }

/** News items.metrics.retrieve */
  async retrieve(itemId: string): Promise<NewsItemMetricSnapshot> {
    return this.client.get<NewsItemMetricSnapshot>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/metrics`));
  }

/** News items.metrics.rebuild */
  async rebuild(body: NewsGenericCommand): Promise<NewsApiResult> {
    return this.client.post<NewsApiResult>(backendApiPath(`/news/items/metrics/rebuild`), body, undefined, undefined, 'application/json');
  }
}

export class NewsItemsMediaApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.media.list */
  async list(itemId: string): Promise<ItemsMediaListResponse> {
    return this.client.get<ItemsMediaListResponse>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media`));
  }

/** News items.media.attach */
  async attach(itemId: string, body: MediaResource): Promise<MediaResource> {
    return this.client.post<MediaResource>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media`), body, undefined, undefined, 'application/json');
  }

/** News items.media.delete */
  async delete(itemId: string, mediaId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/media/${serializePathParameter(mediaId, { name: 'mediaId', style: 'simple', explode: false })}`));
  }
}

export class NewsItemsVersionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.versions.list */
  async list(itemId: string): Promise<ItemsVersionsListResponse> {
    return this.client.get<ItemsVersionsListResponse>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/versions`));
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
  async list(params?: NewsItemsManagementListParams): Promise<ItemsManagementListResponse> {
    const query = buildQueryString([
      { name: 'categoryId', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ItemsManagementListResponse>(appendQueryString(backendApiPath(`/news/items`), query));
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
  async delete(itemId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
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
  async list(): Promise<CategoriesManagementListResponse> {
    return this.client.get<CategoriesManagementListResponse>(backendApiPath(`/news/categories`));
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
  async delete(categoryId: string): Promise<NewsApiResult> {
    return this.client.delete<NewsApiResult>(backendApiPath(`/news/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`));
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
