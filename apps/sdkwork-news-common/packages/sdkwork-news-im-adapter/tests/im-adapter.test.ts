import { describe, expect, it, vi } from "vitest";

import type { ImSdkClient } from "@sdkwork/im-sdk";
import { createSdkworkImNewsAgentConversationPort } from "../src/index.js";

describe("news IM adapter", () => {
  it("creates one agent dialog through the composed IM client", async () => {
    const createAgentDialog = vi.fn(async () => ({ conversationId: "conversation-7" }));
    const client = { conversations: { createAgentDialog } } as unknown as ImSdkClient;
    const port = createSdkworkImNewsAgentConversationPort(client);

    await expect(port.ensureConversation("agent-7")).resolves.toBe("conversation-7");
    expect(createAgentDialog).toHaveBeenCalledWith({ agentId: "agent-7" });
  });

  it("preserves IM cursor pagination and message identity", async () => {
    const listMessages = vi.fn(async () => ({
      highWatermark: 8,
      items: [{
        body: { parts: [], text: "Policy changed" },
        conversationId: "conversation-7",
        deliveryMode: "durable",
        messageId: "message-8",
        messageSeq: 8,
        messageType: "text",
        occurredAt: "2026-07-31T08:00:00.000Z",
        sender: { id: "agent-7", kind: "agent" },
        tenantId: "tenant-1",
      }],
      pageInfo: { hasMore: true, mode: "cursor", nextCursor: "cursor-8", pageSize: 50 },
    }));
    const client = { conversations: { listMessages } } as unknown as ImSdkClient;
    const port = createSdkworkImNewsAgentConversationPort(client);

    const page = await port.listMessages("conversation-7");
    expect(page.items[0]).toMatchObject({ id: "message-8", role: "agent", text: "Policy changed" });
    expect(page.pageInfo).toEqual({ hasMore: true, mode: "cursor", nextCursor: "cursor-8", pageSize: 50 });
  });
});
