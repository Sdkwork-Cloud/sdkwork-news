import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("News H5 shell navigation", () => {
  it("hides the tab bar on assistant conversations and restores it on back", async () => {
    render(
      <App
        accountDemoMode
        aiStoreDemoMode
        assistantDemoMode
        newsDemoMode
      />,
    );

    expect(screen.getByRole("navigation")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /市场雷达/ }));

    await waitFor(() => {
      expect(screen.queryByRole("navigation")).toBeNull();
    });
    fireEvent.click(screen.getByTitle("返回"));

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeTruthy();
    });
  });
});
