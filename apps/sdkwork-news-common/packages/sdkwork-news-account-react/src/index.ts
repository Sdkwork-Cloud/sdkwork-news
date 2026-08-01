import { useCallback, useEffect, useState } from "react";
import {
  NewsAccountAuthenticationRequiredError,
  type NewsAccountProfile,
  type NewsAccountService,
} from "@sdkwork/news-account-service";

export type NewsAccountStatus =
  | "authenticated"
  | "error"
  | "loading"
  | "unauthenticated"
  | "unavailable";

export interface NewsAccountController {
  login(password: string, username: string): Promise<void>;
  loginError?: string;
  loginPending: boolean;
  logout(): Promise<void>;
  logoutPending: boolean;
  profile?: NewsAccountProfile;
  retry(): void;
  status: NewsAccountStatus;
}

export function useNewsAccountController(
  service?: NewsAccountService,
): NewsAccountController {
  const [status, setStatus] = useState<NewsAccountStatus>(
    service ? "loading" : "unavailable",
  );
  const [profile, setProfile] = useState<NewsAccountProfile>();
  const [loginPending, setLoginPending] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setProfile(undefined);
    setLoginError(undefined);
    if (!service) {
      setStatus("unavailable");
      return () => {
        cancelled = true;
      };
    }
    setStatus("loading");
    void service.getCurrentProfile().then(
      (nextProfile) => {
        if (!cancelled) {
          setProfile(nextProfile);
          setStatus("authenticated");
        }
      },
      (error) => {
        if (!cancelled) {
          setStatus(error instanceof NewsAccountAuthenticationRequiredError
            ? "unauthenticated"
            : "error");
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [retryKey, service]);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  const login = useCallback(async (password: string, username: string) => {
    if (!service || loginPending) {
      return;
    }
    setLoginPending(true);
    setLoginError(undefined);
    try {
      const nextProfile = await service.login({ password, username });
      setProfile(nextProfile);
      setStatus("authenticated");
    } catch {
      setLoginError("登录失败，请检查账号、密码和网络连接");
    } finally {
      setLoginPending(false);
    }
  }, [loginPending, service]);

  const logout = useCallback(async () => {
    if (!service || logoutPending) {
      return;
    }
    setLogoutPending(true);
    setLoginError(undefined);
    try {
      await service.logout();
      setProfile(undefined);
      setStatus("unauthenticated");
    } catch {
      setLoginError("退出登录失败，请重试");
    } finally {
      setLogoutPending(false);
    }
  }, [logoutPending, service]);

  return {
    login,
    ...(loginError ? { loginError } : {}),
    loginPending,
    logout,
    logoutPending,
    ...(profile ? { profile } : {}),
    retry,
    status,
  };
}
