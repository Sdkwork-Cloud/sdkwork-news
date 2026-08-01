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

export interface NewsAccountPort {
  getCurrentProfile(): Promise<NewsAccountProfile>;
  login(input: NewsAccountLoginInput): Promise<NewsAccountProfile>;
  logout(): Promise<void>;
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
    getCurrentProfile: () => port.getCurrentProfile(),
    login: (input) => port.login({
      password: requireValue(input.password, "password"),
      username: requireValue(input.username, "username"),
    }),
    logout: () => port.logout(),
  };
}

function requireValue(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }
  return normalized;
}
