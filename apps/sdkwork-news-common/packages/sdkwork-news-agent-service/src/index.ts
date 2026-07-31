import {
  buildNewsReadingCronJobs,
  validateNewsReadingSchedule,
  type CreateNewsReadingAgentInput,
  type ListNewsAgentsQuery,
  type NewsAgentConversationPort,
  type NewsAgentPage,
  type NewsAgentProfilePort,
  type NewsConversationMessagePage,
  type NewsConversationSubscription,
  type NewsReadingAgent,
  type NewsReadingCronJob,
  type UpdateNewsReadingAgentInput,
} from "@sdkwork/news-agent-contracts";

export interface NewsAgentService {
  create(input: CreateNewsReadingAgentInput): Promise<NewsReadingAgent>;
  get(agentId: string): Promise<NewsReadingAgent>;
  list(query?: ListNewsAgentsQuery): Promise<NewsAgentPage>;
  listMessages(
    agentId: string,
    query?: { cursor?: string; pageSize?: number },
  ): Promise<NewsConversationMessagePage>;
  materializeSchedule(agentId: string): Promise<NewsReadingCronJob[]>;
  openConversation(agentId: string): Promise<string>;
  sendText(agentId: string, text: string): Promise<{ messageId: string }>;
  subscribe(
    agentId: string,
    listener: Parameters<NewsAgentConversationPort["subscribe"]>[1],
  ): Promise<NewsConversationSubscription>;
  update(agentId: string, input: UpdateNewsReadingAgentInput): Promise<NewsReadingAgent>;
}

export function createNewsAgentService(
  profiles: NewsAgentProfilePort,
  conversations: NewsAgentConversationPort,
): NewsAgentService {
  async function ensureBoundConversation(agent: NewsReadingAgent): Promise<string> {
    const conversationId = await conversations.ensureConversation(agent.id, agent.conversationId);
    if (agent.conversationId !== conversationId) {
      await profiles.update(agent.id, { conversationId });
    }
    return conversationId;
  }

  return {
    async create(input) {
      assertValidProfile(input);
      const created = await profiles.create(input);
      const conversationId = await ensureBoundConversation(created);
      return created.conversationId === conversationId
        ? created
        : profiles.get(created.id);
    },
    get(agentId) {
      return profiles.get(agentId);
    },
    list(query) {
      const pageSize = normalizePageSize(query?.pageSize);
      return profiles.list({ ...query, pageSize });
    },
    async listMessages(agentId, query) {
      const agent = await profiles.get(agentId);
      const conversationId = await ensureBoundConversation(agent);
      return conversations.listMessages(conversationId, {
        ...query,
        pageSize: normalizeMessagePageSize(query?.pageSize),
      });
    },
    async materializeSchedule(agentId) {
      const agent = await profiles.get(agentId);
      return buildNewsReadingCronJobs(agent.schedule);
    },
    async openConversation(agentId) {
      return ensureBoundConversation(await profiles.get(agentId));
    },
    async sendText(agentId, text) {
      const normalizedText = text.trim();
      if (!normalizedText) {
        throw new Error("News agent messages must not be empty.");
      }
      const conversationId = await ensureBoundConversation(await profiles.get(agentId));
      return conversations.sendText(conversationId, normalizedText);
    },
    async subscribe(agentId, listener) {
      const conversationId = await ensureBoundConversation(await profiles.get(agentId));
      return conversations.subscribe(conversationId, listener);
    },
    update(agentId, input) {
      if (input.schedule) {
        assertValidSchedule(input.schedule);
      }
      return profiles.update(agentId, input);
    },
  };
}

function assertValidProfile(input: CreateNewsReadingAgentInput): void {
  if (!input.name.trim()) {
    throw new Error("News agent name must not be empty.");
  }
  if (!input.description.trim()) {
    throw new Error("News agent description must not be empty.");
  }
  assertValidSchedule(input.schedule);
}

function assertValidSchedule(schedule: CreateNewsReadingAgentInput["schedule"]): void {
  const issues = validateNewsReadingSchedule(schedule);
  if (issues.length > 0) {
    throw new Error(`Invalid news reading schedule: ${issues.map((issue) => issue.code).join(", ")}`);
  }
}

function normalizePageSize(value: number | undefined): number {
  if (value === undefined) {
    return 20;
  }
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new Error("News agent pageSize must be an integer between 1 and 100.");
  }
  return value;
}

function normalizeMessagePageSize(value: number | undefined): number {
  if (value === undefined) {
    return 50;
  }
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new Error("News conversation pageSize must be an integer between 1 and 100.");
  }
  return value;
}
