import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
  NewsAccountAuthenticationRequiredError,
  type NewsAccountService,
} from "@sdkwork/news-account-service";
import { useNewsAccountController } from "../src/index.js";

function Harness({ service }: { service?: NewsAccountService }) {
  const controller = useNewsAccountController(service);
  return <div>
    <span>{controller.status}</span>
    <span>{controller.profile?.displayName}</span>
    <button onClick={() => void controller.login("secret", "user")} type="button">login</button>
    <button onClick={() => void controller.logout()} type="button">logout</button>
  </div>;
}

describe("useNewsAccountController", () => {
  it("fails closed without IAM service", () => {
    render(<Harness />);
    expect(screen.getByText("unavailable")).toBeInTheDocument();
  });

  it("shows credential entry only for an authentication-required response", async () => {
    const service: NewsAccountService = {
      getCurrentProfile: vi.fn(async () => { throw new NewsAccountAuthenticationRequiredError(); }),
      login: vi.fn(async () => ({ displayName: "Lin Ran" })),
      logout: vi.fn(async () => undefined),
    };
    render(<Harness service={service} />);
    await screen.findByText("unauthenticated");
    fireEvent.click(screen.getByRole("button", { name: "login" }));
    await screen.findByText("Lin Ran");
  });

  it("delegates logout and removes profile data", async () => {
    const service: NewsAccountService = {
      getCurrentProfile: vi.fn(async () => ({ displayName: "Lin Ran" })),
      login: vi.fn(),
      logout: vi.fn(async () => undefined),
    };
    render(<Harness service={service} />);
    await screen.findByText("Lin Ran");
    fireEvent.click(screen.getByRole("button", { name: "logout" }));
    await waitFor(() => expect(service.logout).toHaveBeenCalled());
    expect(screen.queryByText("Lin Ran")).not.toBeInTheDocument();
  });
});
