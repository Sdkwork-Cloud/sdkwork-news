import { useState } from "react";
import { NewsH5Account } from "@sdkwork/news-h5-account";
import { NewsH5AiStore } from "@sdkwork/news-h5-ai-store";
import { NewsH5Assistant } from "@sdkwork/news-h5-assistant";
import { NewsH5News } from "@sdkwork/news-h5-news";
import { NewsH5Shell, type NewsH5Tab } from "@sdkwork/news-h5-shell";
import type { NewsAgentService } from "@sdkwork/news-agent-service";

export default function App({ agentService }: { agentService?: NewsAgentService }) {
  const [tab, setTab] = useState<NewsH5Tab>("assistant");
  return <NewsH5Shell activeTab={tab} onTabChange={setTab}>
    {tab === "assistant" && <NewsH5Assistant service={agentService} />}
    {tab === "news" && <NewsH5News />}
    {tab === "store" && <NewsH5AiStore />}
    {tab === "account" && <NewsH5Account />}
  </NewsH5Shell>;
}
