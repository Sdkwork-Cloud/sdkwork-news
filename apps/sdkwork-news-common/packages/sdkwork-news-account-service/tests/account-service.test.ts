import { describe, expect, it, vi } from "vitest";
import {
  createNewsAccountService,
  type NewsAccountPort,
} from "../src/index.js";

describe("createNewsAccountService", () => {
  it("validates credentials before delegating login", async () => {
    const port: NewsAccountPort = {
      getCurrentProfile: vi.fn(),
      login: vi.fn(async () => ({ displayName: "User" })),
      logout: vi.fn(),
    };
    const service = createNewsAccountService(port);
    await service.login({ password: " secret ", username: " user " });
    expect(port.login).toHaveBeenCalledWith({ password: "secret", username: "user" });
    expect(() => service.login({ password: "", username: "user" })).toThrow("password");
  });

  it("validates profile and password mutations before delegating", async () => {
    const port: NewsAccountPort = {
      changePassword: vi.fn(async () => undefined),
      getCurrentProfile: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(async ({ displayName }) => ({ displayName })),
    };
    const service = createNewsAccountService(port);
    await expect(service.updateProfile?.({ displayName: " Lin Ran " })).resolves.toEqual({ displayName: "Lin Ran" });
    await expect(service.changePassword?.({
      confirmPassword: "new-secret",
      currentPassword: "old-secret",
      newPassword: "new-secret",
    })).resolves.toBeUndefined();
    expect(() => service.changePassword?.({
      confirmPassword: "different",
      currentPassword: "old-secret",
      newPassword: "new-secret",
    })).toThrow("confirmPassword");
  });
});
