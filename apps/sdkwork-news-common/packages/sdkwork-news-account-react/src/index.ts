import { useCallback, useEffect, useState } from "react";
import {
  NewsAccountAuthenticationRequiredError,
  type NewsAccountPasswordUpdateInput,
  type NewsAccountProfile,
  type NewsAccountService,
} from "@sdkwork/news-account-service";

export * from "./local-state.js";

export type NewsAccountStatus =
  | "authenticated"
  | "error"
  | "loading"
  | "unauthenticated"
  | "unavailable";

export interface NewsAccountController {
  changePassword(input: NewsAccountPasswordUpdateInput): Promise<boolean>;
  login(password: string, username: string): Promise<void>;
  loginError?: string;
  loginPending: boolean;
  logout(): Promise<void>;
  logoutPending: boolean;
  mutationError?: string;
  mutationMessage?: string;
  passwordPending: boolean;
  profile?: NewsAccountProfile;
  profilePending: boolean;
  retry(): void;
  status: NewsAccountStatus;
  updateProfile(displayName: string): Promise<boolean>;
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
  const [profilePending, setProfilePending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [mutationError, setMutationError] = useState<string>();
  const [mutationMessage, setMutationMessage] = useState<string>();
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setProfile(undefined);
    setLoginError(undefined);
    setMutationError(undefined);
    setMutationMessage(undefined);
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

  const updateProfile = useCallback(async (displayName: string) => {
    if (!service?.updateProfile || profilePending) {
      setMutationError("当前账号服务不支持资料修改");
      return false;
    }
    setProfilePending(true);
    setMutationError(undefined);
    setMutationMessage(undefined);
    try {
      const nextProfile = await service.updateProfile({ displayName });
      setProfile(nextProfile);
      setMutationMessage("资料已更新");
      return true;
    } catch {
      setMutationError("资料保存失败，请检查输入和网络连接");
      return false;
    } finally {
      setProfilePending(false);
    }
  }, [profilePending, service]);

  const changePassword = useCallback(async (input: NewsAccountPasswordUpdateInput) => {
    if (!service?.changePassword || passwordPending) {
      setMutationError("当前账号服务不支持密码修改");
      return false;
    }
    setPasswordPending(true);
    setMutationError(undefined);
    setMutationMessage(undefined);
    try {
      await service.changePassword(input);
      setMutationMessage("密码已更新");
      return true;
    } catch {
      setMutationError("密码修改失败，请核对当前密码和密码规则");
      return false;
    } finally {
      setPasswordPending(false);
    }
  }, [passwordPending, service]);

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
    changePassword,
    login,
    ...(loginError ? { loginError } : {}),
    loginPending,
    logout,
    logoutPending,
    ...(mutationError ? { mutationError } : {}),
    ...(mutationMessage ? { mutationMessage } : {}),
    passwordPending,
    ...(profile ? { profile } : {}),
    profilePending,
    retry,
    status,
    updateProfile,
  };
}
