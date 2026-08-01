import type {
  AppStoreClient,
  ListingSummary,
  UserLibraryItem,
} from "@sdkwork/appstore-app-sdk";
import type {
  McpServerRecord,
  SdkworkMcpAppClient,
} from "@sdkwork/mcp-app-sdk";
import type {
  AiStoreEntry,
  AiStorePage,
  AiStorePort,
} from "@sdkwork/news-ai-store-service";
import type {
  SdkworkSkillsAppClient,
  SkillArtifactRecord,
  SkillInstallationRecord,
  SkillRecord,
} from "@sdkwork/skills-app-sdk";

export interface AiStoreSdkClients {
  appStore: AppStoreClient;
  mcp: SdkworkMcpAppClient;
  skills: SdkworkSkillsAppClient;
}

export interface AiStoreSdkAdapterOptions {
  platform: string;
}

export function createSdkworkAiStorePort(
  clients: AiStoreSdkClients,
  options: AiStoreSdkAdapterOptions,
): AiStorePort {
  return {
    async installProduct(listingId) {
      const result = await clients.appStore.library.install({
        listingId,
        platform: options.platform,
      });
      return { libraryItemId: result.libraryItem.id };
    },
    async installSkill(packageId, artifactId) {
      await clients.skills.skills.skillPackages.installations.create(packageId, {
        artifactId,
      });
    },
    async list(input) {
      if (input.kind === "product") {
        return listProducts(clients.appStore, input);
      }
      if (input.kind === "skill") {
        return listSkills(clients.skills, input);
      }
      return listMcpServers(clients.mcp, input);
    },
    async listSkillArtifacts(packageId) {
      const page = await clients.skills.skills.skillPackages.artifacts.list(packageId, {
        pageSize: 50,
      });
      return page.items.map(mapSkillArtifact);
    },
    async uninstallProduct(libraryItemId) {
      await clients.appStore.library.uninstall({ libraryItemId });
    },
  };
}

async function listProducts(
  client: AppStoreClient,
  input: Parameters<AiStorePort["list"]>[0],
): Promise<AiStorePage> {
  const [page, libraryPage] = await Promise.all([
    client.catalog.searchListings({
      cursor: input.cursor,
      limit: input.pageSize,
      q: input.q,
    }),
    client.library.listItems({ limit: 200 }),
  ]);
  const installedByListingId = new Map(
    libraryPage.items
      .filter(isInstalledLibraryItem)
      .map((item) => [item.listingId, item] as const),
  );
  return {
    hasMore: page.pageInfo.hasMore,
    items: page.items.map((item) => mapProduct(item, installedByListingId.get(item.id))),
    ...(optionalString(page.pageInfo.nextCursor)
      ? { nextCursor: optionalString(page.pageInfo.nextCursor) }
      : {}),
  };
}

async function listSkills(
  client: SdkworkSkillsAppClient,
  input: Parameters<AiStorePort["list"]>[0],
): Promise<AiStorePage> {
  const [page, installationsPage] = await Promise.all([
    client.skills.marketplace.list({
      cursor: input.cursor,
      pageSize: input.pageSize,
      q: input.q,
    }),
    client.skills.skillInstallations.list({ pageSize: 200 }),
  ]);
  const installedPackageIds = new Set(
    installationsPage.items
      .filter(isEnabledSkillInstallation)
      .map((item) => item.packageId),
  );
  return {
    hasMore: page.pageInfo.hasMore === true,
    items: page.items.map((item) => mapSkill(item, installedPackageIds.has(item.packageId))),
    ...(optionalString(page.pageInfo.nextCursor)
      ? { nextCursor: optionalString(page.pageInfo.nextCursor) }
      : {}),
  };
}

async function listMcpServers(
  client: SdkworkMcpAppClient,
  input: Parameters<AiStorePort["list"]>[0],
): Promise<AiStorePage> {
  const page = readPage<McpServerRecord>(
    await client.mcp.listServers({
      cursor: input.cursor,
      pageSize: input.pageSize,
      q: input.q,
    }),
    "mcp.listServers",
  );
  return {
    hasMore: page.hasMore,
    items: page.items.map(mapMcpServer),
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
  };
}

function mapProduct(
  item: ListingSummary,
  libraryItem?: UserLibraryItem,
): AiStoreEntry {
  return {
    action: libraryItem ? "uninstall-product" : "install-product",
    description: item.subtitle ?? "",
    ...(item.icon?.url ? { iconUrl: item.icon.url } : {}),
    id: item.id,
    kind: "product",
    ...(libraryItem ? { libraryItemId: libraryItem.id } : {}),
    name: item.displayName,
    pricing: item.pricingModel,
    ...(item.averageRating ? { rating: item.averageRating } : {}),
    tags: [],
  };
}

function mapSkill(item: SkillRecord, installed: boolean): AiStoreEntry {
  return {
    action: installed ? "installed-skill" : "select-skill-artifact",
    description: item.summary ?? item.description ?? "",
    id: item.id,
    installCount: item.installCount,
    kind: "skill",
    name: item.name,
    packageId: item.packageId,
    tags: item.tags,
  };
}

function mapMcpServer(item: McpServerRecord): AiStoreEntry {
  return {
    action: "view-only",
    description: item.description ?? "",
    healthStatus: item.health_status,
    id: item.id,
    kind: "mcp",
    name: item.name,
    tags: item.tags ?? [],
    transport: item.transport,
  };
}

function mapSkillArtifact(item: SkillArtifactRecord) {
  return {
    id: item.id,
    invocationKind: item.invocationKind,
    ...(item.publishedAt ? { publishedAt: item.publishedAt } : {}),
    status: item.status,
    version: item.versionLabel,
  };
}

function isInstalledLibraryItem(item: UserLibraryItem): boolean {
  const status = item.libraryStatus.toLowerCase();
  return !item.removedAt && status !== "removed" && status !== "uninstalled";
}

function isEnabledSkillInstallation(item: SkillInstallationRecord): boolean {
  return item.enabled && item.installStatus.toLowerCase() !== "removed";
}

interface ParsedPage<T> {
  hasMore: boolean;
  items: T[];
  nextCursor?: string;
}

function readPage<T>(value: unknown, operation: string): ParsedPage<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${operation} returned an invalid page.`);
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.items)) {
    throw new Error(`${operation} returned a page without items.`);
  }
  const pageInfo = record.pageInfo;
  if (!pageInfo || typeof pageInfo !== "object" || Array.isArray(pageInfo)) {
    throw new Error(`${operation} returned a page without pageInfo.`);
  }
  const info = pageInfo as Record<string, unknown>;
  const nextCursor = optionalString(info.nextCursor);
  return {
    hasMore: info.hasMore === true,
    items: record.items as T[],
    ...(nextCursor ? { nextCursor } : {}),
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
