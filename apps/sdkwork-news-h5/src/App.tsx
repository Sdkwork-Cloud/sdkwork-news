import { useState } from "react";
import {
  NewsH5Account,
  type NewsH5AccountStorage,
} from "@sdkwork/news-h5-account";
import { NewsH5AiStore } from "@sdkwork/news-h5-ai-store";
import { NewsH5Assistant } from "@sdkwork/news-h5-assistant";
import {
  NewsH5News,
  type NewsShareInput,
} from "@sdkwork/news-h5-news";
import { NewsH5Shell, type NewsH5Tab } from "@sdkwork/news-h5-shell";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import type { NewsFeedService } from "@sdkwork/news-feed-service";

export interface NewsH5AppProps {
  accountDemoMode: boolean;
  accountService?: NewsAccountService;
  accountStorage?: NewsH5AccountStorage;
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
  accountStorage,
  agentService,
  aiStoreDemoMode,
  aiStoreService,
  assistantDemoMode,
  newsDemoMode,
  newsService,
}: NewsH5AppProps) {
  const [tab, setTab] = useState<NewsH5Tab>("assistant");
  const [secondaryPage, setSecondaryPage] = useState(false);
  const changeTab = (nextTab: NewsH5Tab) => {
    setTab(nextTab);
    setSecondaryPage(false);
  };
  return <NewsH5Shell activeTab={tab} onTabChange={changeTab} showTabBar={!secondaryPage}>
    {tab === "assistant" && (
      <NewsH5Assistant demoMode={assistantDemoMode} service={agentService} onSecondaryPageChange={setSecondaryPage} />
    )}
    {tab === "news" && (
      <NewsH5News
        demoMode={newsDemoMode}
        onSecondaryPageChange={setSecondaryPage}
        service={newsService}
        shareArticle={shareNewsArticle}
      />
    )}
    {tab === "store" && (
      <NewsH5AiStore
        demoMode={aiStoreDemoMode}
        onSecondaryPageChange={setSecondaryPage}
        service={aiStoreService}
      />
    )}
    {tab === "account" && (
      <NewsH5Account
        demoMode={accountDemoMode}
        onSecondaryPageChange={setSecondaryPage}
        service={accountService}
        storage={accountStorage}
      />
    )}
  </NewsH5Shell>;
}

async function shareNewsArticle(input: NewsShareInput): Promise<void> {
  const shareText = `${input.title}\n${input.text}\n${window.location.href}`;
  if (navigator.share) {
    await navigator.share({
      text: input.text,
      title: input.title,
      url: window.location.href,
    });
    return;
  }
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareText);
    return;
  }
  throw new Error("News sharing is unavailable in this browser.");
}
