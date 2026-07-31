import { describe, expect, it, vi } from "vitest";

import {
  createDefaultNewsReadingSchedule,
  type NewsAgentConversationPort,
  type NewsAgentProfilePort,
  type NewsReadingAgent,
} from "@sdkwork/news-agent-contracts";
import { createNewsAgentService } from "../src/index.js";

function agent(overrides: Partial<NewsReadingAgent> = {}): NewsReadingAgent {
  return {
    accent: "#0f8a64",
    createdAt: "2026-07-31T00:00:00.000Z",
    description: "Track policy changes",
    id: "policy-watch",
    name: "Policy Watch",
    readingScope: {
      categories: ["policy"],
      keywords: [],
      languages: ["zh-CN"],
      regions: ["CN"],
      trustedSources: [],
    },
    schedule: createDefaultNewsReadingSchedule("Asia/Shanghai"),
    status: "active",
    tone: "analytical",
    unreadCount: 0,
    updatedAt: "2026-07-31T00:00:00.000Z",
    ...overrides,
  };
}

describe("news agent service", () => {
  it("binds a newly created agent to one IM conversation and stores only the reference", async () => {
    let stored = agent();
    const profiles: NewsAgentProfilePort = {
      create: vi.fn(async () => stored),
      get: vi.fn(async () => stored),
      list: vi.fn(),
      update: vi.fn(async (_id, input) => {
        stored = { ...stored, ...input };
        return stored;
      }),
    };
    const conversations: NewsAgentConversationPort = {
      ensureConversation: vi.fn(async () => "im-conversation-1"),
      listMessages: vi.fn(),
      markRead: vi.fn(),
      sendText: vi.fn(),
      subscribe: vi.fn(),
    };
    const service = createNewsAgentService(profiles, conversations);

    const created = await service.create({
      accent: stored.accent,
      description: stored.description,
      name: stored.name,
      readingScope: stored.readingScope,
      schedule: stored.schedule,
      tone: stored.tone,
    });

    expect(created.conversationId).toBe("im-conversation-1");
    expect(profiles.update).toHaveBeenCalledWith(stored.id, { conversationId: "im-conversation-1" });
  });

  it("materializes the profile schedule without owning a scheduler transport", async () => {
    const stored = agent({ conversationId: "im-conversation-1" });
    const profiles = { get: vi.fn(async () => stored) } as unknown as NewsAgentProfilePort;
    const conversations = {} as NewsAgentConversationPort;
    const service = createNewsAgentService(profiles, conversations);

    await expect(service.materializeSchedule(stored.id)).resolves.toHaveLength(4);
  });
});
