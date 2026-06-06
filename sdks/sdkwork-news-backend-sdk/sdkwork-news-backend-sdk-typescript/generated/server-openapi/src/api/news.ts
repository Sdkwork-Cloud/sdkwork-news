import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CategoriesManagementListResponse, ItemsManagementListResponse, NewsApiResult, NewsCategory, NewsCategoryCommand, NewsEditorialReadiness, NewsItem, NewsItemCommand, NewsScheduleCommand } from '../types';


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
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new NewsItemsManagementApi(client);
    this.editorialReadiness = new NewsItemsEditorialReadinessApi(client); 
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
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.categories = new NewsCategoriesApi(client);
    this.items = new NewsItemsApi(client); 
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
