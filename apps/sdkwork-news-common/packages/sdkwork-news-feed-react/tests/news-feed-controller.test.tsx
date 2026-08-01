import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { NewsFeedService } from "@sdkwork/news-feed-service";
import { useNewsFeedController } from "../src/index.js";

function Harness({ service }: { service?: NewsFeedService }) {
  const controller = useNewsFeedController(service);
  return <div>
    <span>{controller.status}</span>
    {controller.items.map((item) => <span key={item.id}>{item.title}</span>)}
    <button type="button" onClick={() => controller.search("agent")}>search</button>
    <button type="button" onClick={() => void controller.loadMore()}>more</button>
    <button type="button" onClick={() => void controller.toggleFavorite("item-1")}>favorite</button>
  </div>;
}

function createService(): NewsFeedService {
  return {
    listChannels: vi.fn(async () => []),
    listFeed: vi.fn()
      .mockResolvedValueOnce({
        hasMore: true,
        items: [{
          categoryId: "technology",
          featured: false,
          id: "item-1",
          summary: "Summary",
          tags: [],
          title: "First page",
        }],
        nextCursor: "next-1",
      })
      .mockResolvedValueOnce({
        hasMore: false,
        items: [{
          categoryId: "technology",
          featured: false,
          id: "item-2",
          summary: "Summary",
          tags: [],
          title: "Second page",
        }],
      })
      .mockResolvedValue({ hasMore: false, items: [] }),
    listTrending: vi.fn(async () => ({ hasMore: false, items: [] })),
    setFavorite: vi.fn(async () => undefined),
  };
}

describe("useNewsFeedController", () => {
  it("reports unavailable without an injected production service", () => {
    render(<Harness />);
    expect(screen.getByText("unavailable")).toBeInTheDocument();
  });

  it("preserves server cursor pagination and favorite commands", async () => {
    const service = createService();
    render(<Harness service={service} />);

    expect(await screen.findByText("First page")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "more" }));
    expect(await screen.findByText("Second page")).toBeInTheDocument();
    expect(service.listFeed).toHaveBeenNthCalledWith(2, {
      cursor: "next-1",
      pageSize: 20,
    });

    fireEvent.click(screen.getByRole("button", { name: "favorite" }));
    await waitFor(() => expect(service.setFavorite).toHaveBeenCalledWith("item-1", true));
  });

  it("sends normalized search text to the service", async () => {
    const service = createService();
    render(<Harness service={service} />);
    await screen.findByText("First page");

    fireEvent.click(screen.getByRole("button", { name: "search" }));
    await waitFor(() => expect(service.listFeed).toHaveBeenLastCalledWith({
      pageSize: 20,
      q: "agent",
    }));
  });
});
