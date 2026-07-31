import type { AgentRecord, SdkworkAppClient } from "@sdkwork/agents-app-sdk";
import {
  createDefaultNewsReadingSchedule,
  type CreateNewsReadingAgentInput,
  type NewsAgentPageInfo,
  type NewsAgentProfilePort,
  type NewsAgentReadingScope,
  type NewsAgentStatus,
  type NewsAgentTone,
  type NewsReadingAgent,
  type NewsReadingSchedule,
  type UpdateNewsReadingAgentInput,
} from "@sdkwork/news-agent-contracts";

const MANIFEST_KIND = "sdkwork.news.reader-agent";
const MANIFEST_VERSION = 1;

interface NewsReaderManifestValue {
  accent: string;
  conversationId?: string;
  lastDigestAt?: string;
  lastDigestSummary?: string;
  readingScope: NewsAgentReadingScope;
  schedule: NewsReadingSchedule;
  status: NewsAgentStatus;
  tone: NewsAgentTone;
}

interface NewsReaderManifest extends Record<string, unknown> {
  kind: typeof MANIFEST_KIND;
  newsReader: NewsReaderManifestValue;
  schemaVersion: typeof MANIFEST_VERSION;
}

export interface NewsAgentSdkAdapterOptions {
  idFactory?: () => string;
  now?: () => string;
}

export function createSdkworkNewsAgentProfilePort(
  client: SdkworkAppClient,
  options: NewsAgentSdkAdapterOptions = {},
): NewsAgentProfilePort {
  const now = options.now ?? (() => new Date().toISOString());
  const idFactory = options.idFactory ?? createAgentId;

  return {
    async create(input) {
      const agentId = idFactory();
      const requestedAt = now();
      const record = await client.ai.agents.create({
        agentId,
        code: agentId,
        description: input.description.trim(),
        displayName: input.name.trim(),
        manifest: buildManifest(input),
        requestedAt,
        tags: ["news-reader"],
        visibility: "private",
      });
      return mapAgentRecord(record);
    },
    async get(agentId) {
      return mapAgentRecord(await client.ai.agents.retrieve(agentId));
    },
    async list(query = {}) {
      if (query.cursor) {
        throw new Error("SDKWork Agents uses offset pagination for managed agent lists.");
      }
      const response = await client.ai.agents.list({
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20,
        ...(query.q?.trim() ? { q: query.q.trim() } : {}),
        scope: "mine",
      });
      return {
        items: response.items
          .filter(isNewsReaderAgent)
          .map(mapAgentRecord),
        pageInfo: mapPageInfo(response.pageInfo, query.pageSize ?? 20),
      };
    },
    async update(agentId, input) {
      const current = await client.ai.agents.retrieve(agentId);
      const currentProfile = mapAgentRecord(current);
      const next: NewsReadingAgent = {
        ...currentProfile,
        ...input,
        readingScope: input.readingScope ?? currentProfile.readingScope,
        schedule: input.schedule ?? currentProfile.schedule,
      };
      const updated = await client.ai.agents.update(agentId, {
        description: next.description,
        displayName: next.name,
        expectedVersion: current.version,
        manifest: buildManifest(next),
        requestedAt: now(),
        tags: current.tags.includes("news-reader") ? current.tags : [...current.tags, "news-reader"],
      });
      return mapAgentRecord(updated);
    },
  };
}

function buildManifest(
  input: CreateNewsReadingAgentInput | NewsReadingAgent,
): NewsReaderManifest {
  const value = input as CreateNewsReadingAgentInput & Partial<NewsReadingAgent>;
  return {
    kind: MANIFEST_KIND,
    newsReader: {
      accent: input.accent,
      ...(value.conversationId ? { conversationId: value.conversationId } : {}),
      ...(value.lastDigestAt ? { lastDigestAt: value.lastDigestAt } : {}),
      ...(value.lastDigestSummary ? { lastDigestSummary: value.lastDigestSummary } : {}),
      readingScope: input.readingScope,
      schedule: input.schedule,
      status: value.status ?? "active",
      tone: input.tone,
    },
    schemaVersion: MANIFEST_VERSION,
  };
}

function mapAgentRecord(record: AgentRecord): NewsReadingAgent {
  const manifest = readManifest(record.manifest);
  return {
    accent: manifest.accent,
    ...(manifest.conversationId ? { conversationId: manifest.conversationId } : {}),
    createdAt: record.createdAt,
    description: record.description ?? "",
    id: record.agentId,
    ...(manifest.lastDigestAt ? { lastDigestAt: manifest.lastDigestAt } : {}),
    ...(manifest.lastDigestSummary ? { lastDigestSummary: manifest.lastDigestSummary } : {}),
    name: record.displayName,
    readingScope: manifest.readingScope,
    schedule: manifest.schedule,
    status: manifest.status,
    tone: manifest.tone,
    unreadCount: 0,
    updatedAt: record.updatedAt,
    version: record.version,
  };
}

function readManifest(value: Record<string, unknown>): NewsReaderManifestValue {
  const candidate = asRecord(value.newsReader);
  const readingScope = asRecord(candidate?.readingScope);
  const schedule = asRecord(candidate?.schedule);
  return {
    accent: readString(candidate?.accent) ?? "#0f8a64",
    ...(readString(candidate?.conversationId) ? { conversationId: readString(candidate?.conversationId)! } : {}),
    ...(readString(candidate?.lastDigestAt) ? { lastDigestAt: readString(candidate?.lastDigestAt)! } : {}),
    ...(readString(candidate?.lastDigestSummary) ? { lastDigestSummary: readString(candidate?.lastDigestSummary)! } : {}),
    readingScope: {
      categories: readStringArray(readingScope?.categories),
      keywords: readStringArray(readingScope?.keywords),
      languages: readStringArray(readingScope?.languages),
      regions: readStringArray(readingScope?.regions),
      trustedSources: readStringArray(readingScope?.trustedSources),
    },
    schedule: isReadingSchedule(schedule)
      ? schedule
      : createDefaultNewsReadingSchedule("UTC"),
    status: readStatus(candidate?.status),
    tone: readTone(candidate?.tone),
  };
}

function isNewsReaderAgent(record: AgentRecord): boolean {
  return record.manifest.kind === MANIFEST_KIND || record.tags.includes("news-reader");
}

function mapPageInfo(
  pageInfo: { hasMore?: boolean; mode: "cursor" | "offset"; nextCursor?: string | null; page?: number; pageSize?: number; totalItems?: string },
  fallbackPageSize: number,
): NewsAgentPageInfo {
  const totalItems = pageInfo.totalItems === undefined ? undefined : Number(pageInfo.totalItems);
  return {
    hasMore: pageInfo.hasMore === true,
    mode: pageInfo.mode,
    ...(pageInfo.nextCursor ? { nextCursor: pageInfo.nextCursor } : {}),
    ...(pageInfo.page !== undefined ? { page: pageInfo.page } : {}),
    pageSize: pageInfo.pageSize ?? fallbackPageSize,
    ...(Number.isSafeInteger(totalItems) ? { totalItems } : {}),
  };
}

function createAgentId(): string {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `news-reader-${suffix.toLowerCase()}`;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function readStatus(value: unknown): NewsAgentStatus {
  return value === "paused" || value === "attention" ? value : "active";
}

function readTone(value: unknown): NewsAgentTone {
  return value === "brief" || value === "executive" ? value : "analytical";
}

function isReadingSchedule(
  value: Record<string, unknown> | undefined,
): value is Record<string, unknown> & NewsReadingSchedule {
  return Boolean(
    value &&
    typeof value.enabled === "boolean" &&
    typeof value.timezone === "string" &&
    Array.isArray(value.daily) &&
    asRecord(value.weekly) &&
    asRecord(value.monthly),
  );
}
