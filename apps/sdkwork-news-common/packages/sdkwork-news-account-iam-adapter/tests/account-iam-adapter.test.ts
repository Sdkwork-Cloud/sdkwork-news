import type { SdkworkAppClient } from "@sdkwork/iam-app-sdk";
import { describe, expect, it, vi } from "vitest";
import { createIamNewsAccountPort } from "../src/index.js";

describe("createIamNewsAccountPort", () => {
  it("maps only verifiable IAM identity fields", async () => {
    const retrieve = vi.fn(async () => ({
      displayName: "Lin Ran",
      email: "lin@example.test",
      id: "user-1",
    }));
    const client = {
      auth: { sessions: { create: vi.fn(), current: { delete: vi.fn() } } },
      iam: { users: { current: { retrieve } } },
    } as unknown as SdkworkAppClient;
    const port = createIamNewsAccountPort(client, {
      clearSession: vi.fn(),
      commitSession: vi.fn(),
    });
    await expect(port.getCurrentProfile()).resolves.toEqual({
      displayName: "Lin Ran",
      email: "lin@example.test",
      id: "user-1",
    });
  });

  it("uses generated IAM resources for profile, password, and current session", async () => {
    const retrieveProfile = vi.fn()
      .mockResolvedValueOnce({ displayName: "Before" })
      .mockResolvedValueOnce({ displayName: "After" });
    const updateProfile = vi.fn(async () => ({}));
    const updatePassword = vi.fn(async () => ({}));
    const retrieveSession = vi.fn(async () => ({
      id: "session-1",
      ipAddress: "127.0.0.1",
      userAgent: "Test Browser",
    }));
    const client = {
      auth: { sessions: { create: vi.fn(), current: { delete: vi.fn(), retrieve: retrieveSession } } },
      iam: { users: { current: { password: { update: updatePassword }, retrieve: retrieveProfile, update: updateProfile } } },
    } as unknown as SdkworkAppClient;
    const port = createIamNewsAccountPort(client, {
      clearSession: vi.fn(),
      commitSession: vi.fn(),
    });
    await port.getCurrentProfile();
    await expect(port.updateProfile?.({ displayName: "After" })).resolves.toEqual({ displayName: "After" });
    expect(updateProfile).toHaveBeenCalledWith({ displayName: "After" });
    await port.changePassword?.({ confirmPassword: "new-secret", currentPassword: "old-secret", newPassword: "new-secret" });
    expect(updatePassword).toHaveBeenCalledWith({ confirmPassword: "new-secret", currentPassword: "old-secret", newPassword: "new-secret" });
    await expect(port.getCurrentSession?.()).resolves.toEqual({ id: "session-1", ipAddress: "127.0.0.1", userAgent: "Test Browser" });
  });
});
