import React from 'react';
import ReactDOM from 'react-dom/client';
import { resolveNewsAccountBootstrap } from "@sdkwork/news-account-runtime/config";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import { resolveNewsAgentBootstrap } from "@sdkwork/news-agent-bootstrap/config";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import { resolveAiStoreBootstrap } from "@sdkwork/news-ai-store-runtime/config";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import type { NewsFeedService } from "@sdkwork/news-feed-service";
import { resolveNewsFeedBootstrap } from "@sdkwork/news-runtime/config";
import { createTokenManager } from "@sdkwork/sdk-common";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root')!);

async function bootstrap(): Promise<void> {
  try {
    const accountBootstrap = resolveNewsAccountBootstrap(import.meta.env);
    const agentBootstrap = resolveNewsAgentBootstrap(import.meta.env);
    const aiStoreBootstrap = resolveAiStoreBootstrap(import.meta.env);
    const newsBootstrap = resolveNewsFeedBootstrap(import.meta.env);
    const tokenManager = createTokenManager();
    let accountService: NewsAccountService | undefined;
    let agentService: NewsAgentService | undefined;
    let aiStoreService: AiStoreService | undefined;
    let newsService: NewsFeedService | undefined;
    if (accountBootstrap.config) {
      const { createNewsAccountRuntime } = await import("@sdkwork/news-account-runtime/runtime");
      const accountRuntime = createNewsAccountRuntime({
        ...accountBootstrap.config,
        storage: window.localStorage,
        tokenManager,
      });
      await accountRuntime.hydrate();
      accountService = accountRuntime.service;
    }
    if (agentBootstrap.config) {
      const { createNewsAgentRuntime } = await import("@sdkwork/news-agent-bootstrap/runtime");
      agentService = createNewsAgentRuntime({
        ...agentBootstrap.config,
        tokenManager,
      }).service;
    }
    if (newsBootstrap.config) {
      const { createNewsFeedRuntime } = await import("@sdkwork/news-runtime/feed-runtime");
      newsService = createNewsFeedRuntime({
        ...newsBootstrap.config,
        tokenManager,
      }).service;
    }
    if (aiStoreBootstrap.config) {
      const { createAiStoreRuntime } = await import("@sdkwork/news-ai-store-runtime/runtime");
      aiStoreService = createAiStoreRuntime({
        ...aiStoreBootstrap.config,
        platform: "WEB",
        tokenManager,
      }).service;
    }

    root.render(
      <React.StrictMode>
        <App
          accountDemoMode={accountBootstrap.mode === "demo"}
          accountService={accountService}
          agentService={agentService}
          aiStoreDemoMode={aiStoreBootstrap.mode === "demo"}
          aiStoreService={aiStoreService}
          assistantDemoMode={agentBootstrap.mode === "demo"}
          newsDemoMode={newsBootstrap.mode === "demo"}
          newsService={newsService}
        />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("SDKWork News PC bootstrap failed.", error);
    root.render(
      <main className="runtime-failure" role="alert">
        <h1>服务暂不可用</h1>
        <p>连接配置未就绪，请稍后重试或联系管理员。</p>
      </main>,
    );
  }
}

void bootstrap();
