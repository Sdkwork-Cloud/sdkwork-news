import type {
  ConversationMessageEntry,
  ImDecodedMessage,
  ImMessageContext,
  ImSdkClient,
  Sender,
} from "@sdkwork/im-sdk";
import type {
  NewsAgentConversationPort,
  NewsConversationMessage,
} from "@sdkwork/news-agent-contracts";

export function createSdkworkImNewsAgentConversationPort(
  client: ImSdkClient,
): NewsAgentConversationPort {
  return {
    async ensureConversation(agentId, conversationId) {
      if (conversationId?.trim()) {
        return conversationId;
      }
      const result = await client.conversations.createAgentDialog({ agentId });
      return result.conversationId;
    },
    async listMessages(conversationId, query = {}) {
      const pageSize = query.pageSize ?? 50;
      const response = await client.conversations.listMessages(conversationId, {
        ...(query.cursor ? { cursor: query.cursor } : {}),
        pageSize,
      });
      if (response.pageInfo.mode !== "cursor") {
        throw new Error("SDKWork IM message history must use cursor pagination.");
      }
      const nextCursor = response.pageInfo.nextCursor ?? undefined;
      if (response.pageInfo.hasMore && !nextCursor) {
        throw new Error("SDKWork IM returned hasMore without nextCursor.");
      }
      return {
        items: response.items.map(mapHistoryMessage),
        pageInfo: {
          hasMore: response.pageInfo.hasMore === true,
          mode: "cursor",
          ...(nextCursor ? { nextCursor } : {}),
          pageSize: response.pageInfo.pageSize ?? pageSize,
        },
      };
    },
    async markRead(conversationId, sequence) {
      await client.conversations.updateReadCursor(conversationId, { readSeq: sequence });
    },
    async sendText(conversationId, text) {
      const result = await client.conversations.postText(conversationId, text);
      return { messageId: result.messageId };
    },
    subscribe(conversationId, listener) {
      let closed = false;
      let closeConnection: (() => void) | undefined;

      void client.connect({
        connectionTimeoutMs: 10_000,
        heartbeat: { intervalMs: 25_000, timeoutMs: 10_000 },
        subscriptions: { conversations: [conversationId], scopes: [] },
      }).then((connection) => {
        if (closed) {
          connection.disconnect();
          return;
        }
        const unsubscribe = connection.messages.onConversation(
          conversationId,
          (message: ImDecodedMessage, context: ImMessageContext) => {
            listener(mapRealtimeMessage(message, context));
            void context.ack();
          },
        );
        closeConnection = () => {
          unsubscribe();
          connection.disconnect();
        };
      }).catch(() => {
        // Consumers retain the cursor-paginated REST history when realtime is unavailable.
      });

      return {
        close() {
          closed = true;
          closeConnection?.();
        },
      };
    },
  };
}

function mapHistoryMessage(message: ConversationMessageEntry): NewsConversationMessage {
  return {
    id: message.messageId,
    occurredAt: message.occurredAt,
    role: mapSenderRole(message.sender),
    sequence: message.messageSeq,
    status: "sent",
    ...(message.summary ? { summary: message.summary } : {}),
    text: message.body.text ?? message.body.summary ?? message.summary ?? "",
  };
}

function mapRealtimeMessage(
  message: ImDecodedMessage,
  context: ImMessageContext,
): NewsConversationMessage {
  const messageId = message.messageId ?? context.messageId ?? `realtime:${context.sequence}`;
  const messageType = `${message.messageType ?? ""} ${message.type ?? ""}`;
  return {
    id: messageId,
    occurredAt: message.occurredAt ?? context.receivedAt,
    role: mapSenderRole(message.sender ?? context.sender),
    sequence: message.messageSeq ?? context.sequence,
    status: messageType.includes("stream") ? "streaming" : "sent",
    ...(message.summary ? { summary: message.summary } : {}),
    text: message.text ?? message.body?.text ?? message.body?.summary ?? message.summary ?? "",
  };
}

function mapSenderRole(sender: Sender | undefined): NewsConversationMessage["role"] {
  const kind = sender?.kind.toLowerCase();
  if (kind === "agent" || kind === "assistant" || kind === "bot") {
    return "agent";
  }
  if (kind === "system") {
    return "system";
  }
  return "user";
}
