export interface NewsAccountProfile {
  avatarUrl?: string;
  displayName: string;
  email?: string;
  id?: string;
  username?: string;
}

export interface NewsAccountLoginInput {
  password: string;
  username: string;
}

export interface NewsAccountPasswordUpdateInput {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

export interface NewsAccountProfileUpdateInput {
  displayName: string;
}

export interface NewsAccountSession {
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  ipAddress?: string;
  lastActiveAt?: string;
  userAgent?: string;
}

export interface NewsAccountPort {
  changePassword?(input: NewsAccountPasswordUpdateInput): Promise<void>;
  getCurrentSession?(): Promise<NewsAccountSession>;
  getCurrentProfile(): Promise<NewsAccountProfile>;
  login(input: NewsAccountLoginInput): Promise<NewsAccountProfile>;
  logout(): Promise<void>;
  updateProfile?(input: NewsAccountProfileUpdateInput): Promise<NewsAccountProfile>;
}

export interface NewsAccountService extends NewsAccountPort {}

export class NewsAccountAuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "NewsAccountAuthenticationRequiredError";
  }
}

export function createNewsAccountService(
  port: NewsAccountPort,
): NewsAccountService {
  return {
    ...(port.changePassword
      ? {
          changePassword: (input: NewsAccountPasswordUpdateInput) => {
            const currentPassword = requireValue(input.currentPassword, "currentPassword");
            const newPassword = requireValue(input.newPassword, "newPassword");
            const confirmPassword = requireValue(input.confirmPassword, "confirmPassword");
            if (newPassword.length < 8) {
              throw new Error("newPassword must contain at least 8 characters.");
            }
            if (newPassword !== confirmPassword) {
              throw new Error("confirmPassword must match newPassword.");
            }
            return port.changePassword!({ confirmPassword, currentPassword, newPassword });
          },
        }
      : {}),
    ...(port.getCurrentSession
      ? { getCurrentSession: () => port.getCurrentSession!() }
      : {}),
    getCurrentProfile: () => port.getCurrentProfile(),
    login: (input) => port.login({
      password: requireValue(input.password, "password"),
      username: requireValue(input.username, "username"),
    }),
    logout: () => port.logout(),
    ...(port.updateProfile
      ? {
          updateProfile: (input: NewsAccountProfileUpdateInput) => port.updateProfile!({
            displayName: requireValue(input.displayName, "displayName"),
          }),
        }
      : {}),
  };
}

function requireValue(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }
  return normalized;
}
