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

export default function App({ agentService }: { agentService?: NewsAgentService }) {
  const [activeTab, setActiveTab] = useState<NewsPcWorkspaceTab>(resolveInitialTab);

  useEffect(() => {
    window.location.hash = `/${TAB_HASHES[activeTab]}`;
  }, [activeTab]);

  return (
    <NewsPcWorkspaceShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "assistant" && <NewsPcAssistant service={agentService} />}
      {activeTab === "news" && <NewsPcNews />}
      {activeTab === "store" && <NewsPcAiStore />}
      {activeTab === "account" && <NewsPcAccount />}
    </NewsPcWorkspaceShell>
  );
}
