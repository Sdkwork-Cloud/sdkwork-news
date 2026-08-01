import { useEffect, useState } from "react";
import { NewsPcAccount } from "@sdkwork/news-pc-account";
import { NewsPcAiStore } from "@sdkwork/news-pc-ai-store";
import { NewsPcAssistant } from "@sdkwork/news-pc-assistant";
import { NewsPcNews } from "@sdkwork/news-pc-news";
import {
  NewsPcWorkspaceShell,
  type NewsPcWorkspaceTab,
} from "@sdkwork/news-pc-workspace-shell";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import type { NewsFeedService } from "@sdkwork/news-feed-service";

const TAB_HASHES: Record<NewsPcWorkspaceTab, string> = {
  account: "account",
  assistant: "assistant",
  news: "news",
  store: "ai-store",
};

function resolveInitialTab(): NewsPcWorkspaceTab {
  const hash = window.location.hash.replace(/^#\/?/u, "");
  return (Object.entries(TAB_HASHES).find(([, value]) => value === hash)?.[0] as NewsPcWorkspaceTab | undefined)
    ?? "assistant";
}

export interface NewsPcAppProps {
  accountDemoMode: boolean;
  accountService?: NewsAccountService;
  agentService?: NewsAgentService;
  aiStoreDemoMode: boolean;
  aiStoreService?: AiStoreService;
  assistantDemoMode: boolean;
  newsDemoMode: boolean;
  newsService?: NewsFeedService;
}

export default function App({
  accountDemoMode,
  accountService,
  agentService,
  aiStoreDemoMode,
  aiStoreService,
  assistantDemoMode,
  newsDemoMode,
  newsService,
}: NewsPcAppProps) {
  const [activeTab, setActiveTab] = useState<NewsPcWorkspaceTab>(resolveInitialTab);

  useEffect(() => {
    window.location.hash = `/${TAB_HASHES[activeTab]}`;
  }, [activeTab]);

  return (
    <NewsPcWorkspaceShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "assistant" && (
        <NewsPcAssistant demoMode={assistantDemoMode} service={agentService} />
      )}
      {activeTab === "news" && (
        <NewsPcNews demoMode={newsDemoMode} service={newsService} />
      )}
      {activeTab === "store" && (
        <NewsPcAiStore demoMode={aiStoreDemoMode} service={aiStoreService} />
      )}
      {activeTab === "account" && (
        <NewsPcAccount demoMode={accountDemoMode} service={accountService} />
      )}
    </NewsPcWorkspaceShell>
  );
}
