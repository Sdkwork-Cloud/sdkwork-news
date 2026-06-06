import { customApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ChannelsListResponse, ItemsListResponse, NewsFeedPage, NewsItem, NewsItemPage, NewsSearchResultPage, TopicsListResponse, TrendingListResponse } from '../types';


export interface NewsSearchListParams {
  q?: string;
  cursor?: string;
  limit?: string;
}

export class NewsSearchApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News search.list */
  async list(params?: NewsSearchListParams): Promise<NewsSearchResultPage> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsSearchResultPage>(appendQueryString(customApiPath(`/news/search`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TrendingListResponse>(appendQueryString(customApiPath(`/news/trending`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'trace_id', value: params?.traceId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsItemPage>(appendQueryString(customApiPath(`/news/topics/${serializePathParameter(topicId, { name: 'topicId', style: 'simple', explode: false })}/items`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TopicsListResponse>(appendQueryString(customApiPath(`/news/topics`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
      { name: 'trace_id', value: params?.traceId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsFeedPage>(appendQueryString(customApiPath(`/news/channels/${serializePathParameter(channelId, { name: 'channelId', style: 'simple', explode: false })}/feed`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChannelsListResponse>(appendQueryString(customApiPath(`/news/channels`), query));
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
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<NewsItemPage>(appendQueryString(customApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}/related`), query));
  }
}

export class NewsItemsBySlugApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** News items.bySlug.retrieve */
  async retrieve(slug: string): Promise<NewsItem> {
    return this.client.get<NewsItem>(customApiPath(`/news/items/by_slug/${serializePathParameter(slug, { name: 'slug', style: 'simple', explode: false })}`));
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
    return this.client.get<ItemsListResponse>(appendQueryString(customApiPath(`/news/items`), query));
  }

/** News items.retrieve */
  async retrieve(itemId: string): Promise<NewsItem> {
    return this.client.get<NewsItem>(customApiPath(`/news/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
  }
}

export class NewsApi {
  private client: HttpClient;
  public readonly items: NewsItemsApi;
  public readonly channels: NewsChannelsApi;
  public readonly topics: NewsTopicsApi;
  public readonly trending: NewsTrendingApi;
  public readonly search: NewsSearchApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new NewsItemsApi(client);
    this.channels = new NewsChannelsApi(client);
    this.topics = new NewsTopicsApi(client);
    this.trending = new NewsTrendingApi(client);
    this.search = new NewsSearchApi(client);
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
