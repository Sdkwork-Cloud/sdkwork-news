import { useState } from "react";
import { NewsH5Account } from "@sdkwork/news-h5-account";
import { NewsH5AiStore } from "@sdkwork/news-h5-ai-store";
import { NewsH5Assistant } from "@sdkwork/news-h5-assistant";
import { NewsH5News } from "@sdkwork/news-h5-news";
import { NewsH5Shell, type NewsH5Tab } from "@sdkwork/news-h5-shell";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import type { NewsFeedService } from "@sdkwork/news-feed-service";

export interface NewsH5AppProps {
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
}: NewsH5AppProps) {
  const [tab, setTab] = useState<NewsH5Tab>("assistant");
  return <NewsH5Shell activeTab={tab} onTabChange={setTab}>
    {tab === "assistant" && (
      <NewsH5Assistant demoMode={assistantDemoMode} service={agentService} />
    )}
    {tab === "news" && (
      <NewsH5News demoMode={newsDemoMode} service={newsService} />
    )}
    {tab === "store" && (
      <NewsH5AiStore demoMode={aiStoreDemoMode} service={aiStoreService} />
    )}
    {tab === "account" && (
      <NewsH5Account demoMode={accountDemoMode} service={accountService} />
    )}
  </NewsH5Shell>;
}
