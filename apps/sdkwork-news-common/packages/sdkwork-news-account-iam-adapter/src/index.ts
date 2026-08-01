import type { SdkworkAppClient } from "@sdkwork/iam-app-sdk";
import {
  NewsAccountAuthenticationRequiredError,
  type NewsAccountPort,
  type NewsAccountProfile,
  type NewsAccountSession,
} from "@sdkwork/news-account-service";

export interface NewsIamSessionTokens {
  accessToken: string;
  authToken: string;
  expiresAt?: number | string;
  refreshToken?: string;
}

export interface IamNewsAccountPortOptions {
  clearSession(): Promise<void> | void;
  commitSession(tokens: NewsIamSessionTokens): Promise<void> | void;
}

export function createIamNewsAccountPort(
  client: SdkworkAppClient,
  options: IamNewsAccountPortOptions,
): NewsAccountPort {
  return {
    async changePassword(input) {
      await client.iam.users.current.password.update({
        confirmPassword: input.confirmPassword,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      });
    },
    async getCurrentSession() {
      return mapSession(await client.auth.sessions.current.retrieve());
    },
    async getCurrentProfile() {
      try {
        return mapUser(await client.iam.users.current.retrieve());
      } catch (error) {
        if (isAuthenticationError(error)) {
          throw new NewsAccountAuthenticationRequiredError();
        }
        throw error;
      }
    },
    async login(input) {
      const session = readSession(await client.auth.sessions.create({ ...input }));
      await options.commitSession(session);
      return mapUser(await client.iam.users.current.retrieve());
    },
    async logout() {
      try {
        await client.auth.sessions.current.delete();
      } finally {
        await options.clearSession();
      }
    },
    async updateProfile(input) {
      await client.iam.users.current.update({ displayName: input.displayName });
      return mapUser(await client.iam.users.current.retrieve());
    },
  };
}

function readSession(value: unknown): NewsIamSessionTokens {
  const record = toRecord(value);
  const accessToken = readString(record.accessToken);
  const authToken = readString(record.authToken);
  if (!accessToken || !authToken) {
    throw new Error("SDKWork IAM session is missing required tokens.");
  }
  const refreshToken = readString(record.refreshToken);
  const expiresAt = typeof record.expiresAt === "number"
    ? record.expiresAt
    : readString(record.expiresAt);
  return {
    accessToken,
    authToken,
    ...(expiresAt ? { expiresAt } : {}),
    ...(refreshToken ? { refreshToken } : {}),
  };
}

function mapUser(value: unknown): NewsAccountProfile {
  const user = toRecord(value);
  const avatar = toRecord(user.avatar);
  const displayName = readString(user.displayName)
    ?? readString(user.nickname)
    ?? readString(user.name)
    ?? readString(user.username)
    ?? readString(user.email)
    ?? "SDKWork User";
  const avatarUrl = readString(avatar.publicUrl) ?? readString(avatar.url);
  const email = readString(user.email);
  const id = readString(user.userId) ?? readString(user.id);
  const username = readString(user.username);
  return {
    ...(avatarUrl ? { avatarUrl } : {}),
    displayName,
    ...(email ? { email } : {}),
    ...(id ? { id } : {}),
    ...(username ? { username } : {}),
  };
}

function mapSession(value: unknown): NewsAccountSession {
  const session = toRecord(value);
  return compactSession({
    createdAt: readString(session.createdAt) ?? readString(session.created_at),
    expiresAt: readString(session.expiresAt) ?? readString(session.expires_at),
    id: readString(session.sessionId) ?? readString(session.id),
    ipAddress: readString(session.ipAddress) ?? readString(session.ip_address),
    lastActiveAt: readString(session.lastActiveAt) ?? readString(session.last_active_at),
    userAgent: readString(session.userAgent) ?? readString(session.user_agent),
  });
}

function compactSession(value: NewsAccountSession): NewsAccountSession {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as NewsAccountSession;
}

function isAuthenticationError(error: unknown): boolean {
  const record = toRecord(error);
  return record.status === 401
    || record.code === 40101
    || record.code === "40101";
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
