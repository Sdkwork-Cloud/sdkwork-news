import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  AiStoreArtifact,
  AiStoreEntry,
  AiStoreKind,
  AiStoreService,
} from "@sdkwork/news-ai-store-service";

export type AiStoreStatus =
  | "empty"
  | "error"
  | "loading"
  | "ready"
  | "unavailable";

export interface AiStoreSkillInstallerState {
  artifacts: readonly AiStoreArtifact[];
  entry?: AiStoreEntry;
  status: "closed" | "error" | "installing" | "loading" | "ready";
}

export interface AiStoreController {
  canLoadMore: boolean;
  closeSkillInstaller(): void;
  entries: readonly AiStoreEntry[];
  installProduct(entry: AiStoreEntry): Promise<void>;
  installSkill(artifactId: string): Promise<void>;
  loadMore(): Promise<void>;
  loadingMore: boolean;
  mutationError?: string;
  openSkillInstaller(entry: AiStoreEntry): Promise<void>;
  pendingEntryIds: ReadonlySet<string>;
  query?: string;
  retry(): void;
  search(query: string): void;
  selectedKind: AiStoreKind;
  selectKind(kind: AiStoreKind): void;
  skillInstaller: AiStoreSkillInstallerState;
  status: AiStoreStatus;
  uninstallProduct(entry: AiStoreEntry): Promise<void>;
}

const PAGE_SIZE = 20;

export function useAiStoreController(
  service?: AiStoreService,
): AiStoreController {
  const [selectedKind, setSelectedKind] = useState<AiStoreKind>("product");
  const [query, setQuery] = useState<string>();
  const [entries, setEntries] = useState<readonly AiStoreEntry[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [loading, setLoading] = useState(Boolean(service));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>();
  const [mutationError, setMutationError] = useState<string>();
  const [pendingEntryIds, setPendingEntryIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [skillInstaller, setSkillInstaller] = useState<AiStoreSkillInstallerState>({
    artifacts: [],
    status: "closed",
  });
  const [retryKey, setRetryKey] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    setEntries([]);
    setHasMore(false);
    setNextCursor(undefined);
    setError(undefined);
    setMutationError(undefined);
    if (!service) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void service.list({
      kind: selectedKind,
      pageSize: PAGE_SIZE,
      ...(query ? { q: query } : {}),
    }).then(
      (page) => {
        if (currentRequestId !== requestId.current) {
          return;
        }
        setEntries(page.items);
        setHasMore(page.hasMore);
        setNextCursor(page.nextCursor);
        setLoading(false);
      },
      () => {
        if (currentRequestId !== requestId.current) {
          return;
        }
        setError("AI Store 暂不可用");
        setLoading(false);
      },
    );
  }, [query, retryKey, selectedKind, service]);

  const selectKind = useCallback((kind: AiStoreKind) => {
    setQuery(undefined);
    setSelectedKind(kind);
    setSkillInstaller({ artifacts: [], status: "closed" });
  }, []);

  const search = useCallback((value: string) => {
    setQuery(value.trim() || undefined);
  }, []);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!service || loadingMore || !hasMore || !nextCursor) {
      return;
    }
    setLoadingMore(true);
    setMutationError(undefined);
    try {
      const page = await service.list({
        cursor: nextCursor,
        kind: selectedKind,
        pageSize: PAGE_SIZE,
        ...(query ? { q: query } : {}),
      });
      setEntries((current) => mergeById(current, page.items));
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch {
      setMutationError("更多条目加载失败，请重试");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, query, selectedKind, service]);

  const installProduct = useCallback(async (entry: AiStoreEntry) => {
    if (!service || pendingEntryIds.has(entry.id) || entry.action !== "install-product") {
      return;
    }
    setPendingEntryIds((current) => withSetValue(current, entry.id, true));
    setMutationError(undefined);
    try {
      const result = await service.installProduct(entry.id);
      setEntries((current) => current.map((item) => item.id === entry.id
        ? { ...item, action: "uninstall-product", libraryItemId: result.libraryItemId }
        : item));
    } catch {
      setMutationError("产品安装失败，请重试");
    } finally {
      setPendingEntryIds((current) => withSetValue(current, entry.id, false));
    }
  }, [pendingEntryIds, service]);

  const uninstallProduct = useCallback(async (entry: AiStoreEntry) => {
    if (
      !service
      || pendingEntryIds.has(entry.id)
      || entry.action !== "uninstall-product"
      || !entry.libraryItemId
    ) {
      return;
    }
    setPendingEntryIds((current) => withSetValue(current, entry.id, true));
    setMutationError(undefined);
    try {
      await service.uninstallProduct(entry.libraryItemId);
      setEntries((current) => current.map((item) => {
        if (item.id !== entry.id) {
          return item;
        }
        const { libraryItemId: _removed, ...rest } = item;
        return { ...rest, action: "install-product" };
      }));
    } catch {
      setMutationError("产品卸载失败，请重试");
    } finally {
      setPendingEntryIds((current) => withSetValue(current, entry.id, false));
    }
  }, [pendingEntryIds, service]);

  const openSkillInstaller = useCallback(async (entry: AiStoreEntry) => {
    if (!service || !entry.packageId || entry.action !== "select-skill-artifact") {
      return;
    }
    setMutationError(undefined);
    setSkillInstaller({ artifacts: [], entry, status: "loading" });
    try {
      const artifacts = await service.listSkillArtifacts(entry.packageId);
      setSkillInstaller({ artifacts, entry, status: "ready" });
    } catch {
      setSkillInstaller({ artifacts: [], entry, status: "error" });
    }
  }, [service]);

  const closeSkillInstaller = useCallback(() => {
    setSkillInstaller({ artifacts: [], status: "closed" });
  }, []);

  const installSkill = useCallback(async (artifactId: string) => {
    const entry = skillInstaller.entry;
    const artifact = skillInstaller.artifacts.find((item) => item.id === artifactId);
    if (!service || !entry?.packageId || artifact?.status !== "published") {
      setMutationError("请选择已发布的 Skill 版本");
      return;
    }
    setSkillInstaller((current) => ({ ...current, status: "installing" }));
    setMutationError(undefined);
    try {
      await service.installSkill(entry.packageId, artifact.id);
      setEntries((current) => current.map((item) => item.id === entry.id
        ? { ...item, action: "installed-skill" }
        : item));
      setSkillInstaller({ artifacts: [], status: "closed" });
    } catch {
      setSkillInstaller((current) => ({ ...current, status: "ready" }));
      setMutationError("Skill 安装失败，请重试");
    }
  }, [service, skillInstaller.artifacts, skillInstaller.entry]);

  const status = useMemo<AiStoreStatus>(() => {
    if (!service) {
      return "unavailable";
    }
    if (loading) {
      return "loading";
    }
    if (error) {
      return "error";
    }
    return entries.length > 0 ? "ready" : "empty";
  }, [entries.length, error, loading, service]);

  return {
    canLoadMore: hasMore && Boolean(nextCursor),
    closeSkillInstaller,
    entries,
    installProduct,
    installSkill,
    loadMore,
    loadingMore,
    ...(mutationError ? { mutationError } : {}),
    openSkillInstaller,
    pendingEntryIds,
    ...(query ? { query } : {}),
    retry,
    search,
    selectedKind,
    selectKind,
    skillInstaller,
    status,
    uninstallProduct,
  };
}

function mergeById(
  current: readonly AiStoreEntry[],
  incoming: readonly AiStoreEntry[],
) {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !seen.has(item.id))];
}

function withSetValue(
  current: ReadonlySet<string>,
  value: string,
  present: boolean,
): ReadonlySet<string> {
  const next = new Set(current);
  if (present) {
    next.add(value);
  } else {
    next.delete(value);
  }
  return next;
}
