import { useCallback, useState } from "react";

export type NewsAccountAppearance = "dark" | "light" | "system";
export type NewsAccountLanguage = "en-US" | "zh-CN";

export interface NewsAccountStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface NewsAccountContentItem {
  id: string;
  meta: string;
  source: string;
  title: string;
}

export interface NewsAccountDevice {
  current: boolean;
  id: string;
  lastActive: string;
  location: string;
  name: string;
}

export interface NewsAccountLocalState {
  appearance: NewsAccountAppearance;
  demoDisplayName: string;
  devices: readonly NewsAccountDevice[];
  history: readonly NewsAccountContentItem[];
  language: NewsAccountLanguage;
  notifications: {
    agentDigests: boolean;
    breakingNews: boolean;
    enabled: boolean;
    quietHours: boolean;
  };
  offlineItems: readonly NewsAccountContentItem[];
  offlineWifiOnly: boolean;
  privacy: {
    agentLearning: boolean;
    analytics: boolean;
    personalizedNews: boolean;
  };
  savedItems: readonly NewsAccountContentItem[];
}

const STORAGE_KEY_PREFIX = "sdkwork.news.account.local-state";
const LEGACY_H5_STORAGE_KEY_PREFIX = "sdkwork.news.h5.account.local-state";

const DEMO_STATE: NewsAccountLocalState = {
  appearance: "system",
  demoDisplayName: "林然",
  devices: [
    { current: true, id: "current", lastActive: "当前在线", location: "上海", name: "Chrome · Windows" },
    { current: false, id: "mobile-backup", lastActive: "昨天 21:18", location: "上海", name: "SDKWork News · iPhone" },
  ],
  history: [
    { id: "history-1", meta: "今天 09:42", source: "SDKWork 研究院", title: "从信息流到智能体：新闻阅读正在发生结构性变化" },
    { id: "history-2", meta: "今天 08:31", source: "MIT Technology Review", title: "AI Agent 开始进入企业核心工作流，评估标准正在改变" },
    { id: "history-3", meta: "昨天 19:06", source: "第一财经", title: "资金面延续宽松，市场关注下一阶段政策信号" },
  ],
  language: "zh-CN",
  notifications: {
    agentDigests: true,
    breakingNews: true,
    enabled: true,
    quietHours: true,
  },
  offlineItems: [
    { id: "offline-1", meta: "1.8 MB", source: "Bloomberg", title: "企业软件定价从席位转向结果" },
    { id: "offline-2", meta: "2.3 MB", source: "Reuters", title: "全球供应链继续区域化" },
  ],
  offlineWifiOnly: true,
  privacy: {
    agentLearning: true,
    analytics: false,
    personalizedNews: true,
  },
  savedItems: [
    { id: "saved-1", meta: "42 分钟前", source: "MIT Technology Review", title: "AI Agent 开始进入企业核心工作流，评估标准正在改变" },
    { id: "saved-2", meta: "2 小时前", source: "Bloomberg", title: "企业软件定价从席位转向结果，新的商业模型浮出水面" },
    { id: "saved-3", meta: "3 小时前", source: "Reuters", title: "全球供应链继续区域化，制造企业重新校准库存策略" },
  ],
};

const PRODUCTION_STATE: NewsAccountLocalState = {
  ...DEMO_STATE,
  devices: [],
  history: [],
  offlineItems: [],
  savedItems: [],
};

export interface NewsAccountLocalStateController {
  clearHistory(): void;
  removeDevice(id: string): void;
  removeOfflineItem(id: string): void;
  removeSavedItem(id: string): void;
  state: NewsAccountLocalState;
  update(updater: (current: NewsAccountLocalState) => NewsAccountLocalState): void;
}

export function useNewsAccountLocalState(
  storage?: NewsAccountStorage,
  demoMode = false,
): NewsAccountLocalStateController {
  const [state, setState] = useState<NewsAccountLocalState>(() => readState(storage, demoMode));
  const update = useCallback((updater: (current: NewsAccountLocalState) => NewsAccountLocalState) => {
    setState((current) => {
      const next = updater(current);
      storage?.setItem(storageKey(demoMode), JSON.stringify(next));
      return next;
    });
  }, [demoMode, storage]);
  return {
    clearHistory: () => update((current) => ({ ...current, history: [] })),
    removeDevice: (id) => update((current) => ({
      ...current,
      devices: current.devices.filter((device) => device.current || device.id !== id),
    })),
    removeOfflineItem: (id) => update((current) => ({
      ...current,
      offlineItems: current.offlineItems.filter((item) => item.id !== id),
    })),
    removeSavedItem: (id) => update((current) => ({
      ...current,
      savedItems: current.savedItems.filter((item) => item.id !== id),
    })),
    state,
    update,
  };
}

function readState(
  storage: NewsAccountStorage | undefined,
  demoMode: boolean,
): NewsAccountLocalState {
  const fallback = demoMode ? DEMO_STATE : PRODUCTION_STATE;
  if (!storage) {
    return fallback;
  }
  const key = storageKey(demoMode);
  const legacyKey = `${LEGACY_H5_STORAGE_KEY_PREFIX}.${demoMode ? "demo" : "production"}.v1`;
  try {
    const raw = storage.getItem(key) ?? storage.getItem(legacyKey);
    if (!raw) {
      return fallback;
    }
    const normalized = normalizeState(JSON.parse(raw) as Partial<NewsAccountLocalState>, fallback);
    storage.setItem(key, JSON.stringify(normalized));
    return normalized;
  } catch {
    storage.removeItem(key);
    storage.removeItem(legacyKey);
    return fallback;
  }
}

function normalizeState(
  value: Partial<NewsAccountLocalState>,
  fallback: NewsAccountLocalState,
): NewsAccountLocalState {
  const notifications = value.notifications;
  const privacy = value.privacy;
  return {
    appearance: value.appearance === "dark" || value.appearance === "light" ? value.appearance : "system",
    demoDisplayName: readText(value.demoDisplayName) ?? fallback.demoDisplayName,
    devices: Array.isArray(value.devices) ? value.devices : fallback.devices,
    history: Array.isArray(value.history) ? value.history : fallback.history,
    language: value.language === "en-US" ? "en-US" : "zh-CN",
    notifications: {
      agentDigests: readBoolean(notifications?.agentDigests, fallback.notifications.agentDigests),
      breakingNews: readBoolean(notifications?.breakingNews, fallback.notifications.breakingNews),
      enabled: readBoolean(notifications?.enabled, fallback.notifications.enabled),
      quietHours: readBoolean(notifications?.quietHours, fallback.notifications.quietHours),
    },
    offlineItems: Array.isArray(value.offlineItems) ? value.offlineItems : fallback.offlineItems,
    offlineWifiOnly: readBoolean(value.offlineWifiOnly, fallback.offlineWifiOnly),
    privacy: {
      agentLearning: readBoolean(privacy?.agentLearning, fallback.privacy.agentLearning),
      analytics: readBoolean(privacy?.analytics, fallback.privacy.analytics),
      personalizedNews: readBoolean(privacy?.personalizedNews, fallback.privacy.personalizedNews),
    },
    savedItems: Array.isArray(value.savedItems) ? value.savedItems : fallback.savedItems,
  };
}

function storageKey(demoMode: boolean): string {
  return `${STORAGE_KEY_PREFIX}.${demoMode ? "demo" : "production"}.v1`;
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function readText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
