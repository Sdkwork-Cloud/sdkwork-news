import { describe, expect, it, vi } from "vitest";

import type { ImDecodedMessage, ImMessageContext, ImSdkClient } from "@sdkwork/im-sdk";
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

  it("maps, acknowledges, and closes composed realtime messages", async () => {
    const acknowledge = vi.fn(async () => undefined);
    const disconnect = vi.fn();
    const unsubscribe = vi.fn();
    let emitMessage:
      | ((message: ImDecodedMessage, context: ImMessageContext) => void)
      | undefined;
    const onConversation = vi.fn((
      _conversationId: string,
      listener: (message: ImDecodedMessage, context: ImMessageContext) => void,
    ) => {
      emitMessage = listener;
      return unsubscribe;
    });
    const connect = vi.fn(async () => ({
      disconnect,
      messages: { onConversation },
    }));
    const client = { connect } as unknown as ImSdkClient;
    const port = createSdkworkImNewsAgentConversationPort(client);
    const received: Array<{ id: string; status?: string; text: string }> = [];

    const subscription = port.subscribe("conversation-7", (message) => {
      received.push(message);
    });
    await vi.waitFor(() => {
      expect(onConversation).toHaveBeenCalledWith("conversation-7", expect.any(Function));
    });
    if (!emitMessage) {
      throw new Error("Realtime listener was not registered.");
    }
    emitMessage(
      {
        attachments: [],
        messageId: "message-stream-9",
        messageType: "standard",
        occurredAt: "2026-08-01T08:00:00.000Z",
        sender: { id: "agent-7", kind: "agent" },
        text: "Incremental insight",
        type: "stream.delta",
      } as ImDecodedMessage,
      {
        ack: acknowledge,
        messageId: "message-stream-9",
        receivedAt: "2026-08-01T08:00:00.000Z",
        sequence: 9,
      } as ImMessageContext,
    );

    expect(received).toEqual([
      expect.objectContaining({
        id: "message-stream-9",
        status: "streaming",
        text: "Incremental insight",
      }),
    ]);
    expect(acknowledge).toHaveBeenCalledOnce();

    subscription.close();
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
