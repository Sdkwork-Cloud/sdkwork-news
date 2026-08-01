import { useCallback, useEffect, useRef, useState } from "react";
import type {
  NewsArticle,
  NewsFeedItem,
  NewsFeedService,
  NewsFeedbackType,
} from "@sdkwork/news-feed-service";

export type NewsArticleStatus =
  | "error"
  | "idle"
  | "loading"
  | "ready"
  | "unavailable";

export interface NewsArticleController {
  article?: NewsArticle;
  feedbackError?: string;
  feedbackMessage?: string;
  feedbackPending: boolean;
  recordCompletion(): Promise<void>;
  recordShare(): Promise<void>;
  relatedError?: string;
  relatedItems: readonly NewsFeedItem[];
  retry(): void;
  status: NewsArticleStatus;
  submitFeedback(feedbackType: NewsFeedbackType): Promise<void>;
}

export function useNewsArticleController(
  service: NewsFeedService | undefined,
  itemId: string | undefined,
): NewsArticleController {
  const [article, setArticle] = useState<NewsArticle>();
  const [status, setStatus] = useState<NewsArticleStatus>("idle");
  const [relatedItems, setRelatedItems] = useState<readonly NewsFeedItem[]>([]);
  const [relatedError, setRelatedError] = useState<string>();
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>();
  const [feedbackError, setFeedbackError] = useState<string>();
  const [retryKey, setRetryKey] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    setArticle(undefined);
    setRelatedItems([]);
    setRelatedError(undefined);
    setFeedbackMessage(undefined);
    setFeedbackError(undefined);
    if (!itemId) {
      setStatus("idle");
      return;
    }
    if (!service) {
      setStatus("unavailable");
      return;
    }

    const openedAt = Date.now();
    setStatus("loading");
    void service.recordEvent({ eventType: "click", itemId }).catch(() => undefined);
    void service.getArticle(itemId).then(
      (nextArticle) => {
        if (requestId.current === currentRequestId) {
          setArticle(nextArticle);
          setStatus("ready");
        }
      },
      () => {
        if (requestId.current === currentRequestId) {
          setStatus("error");
        }
      },
    );
    void service.listRelated(itemId).then(
      (page) => {
        if (requestId.current === currentRequestId) {
          setRelatedItems(page.items);
        }
      },
      () => {
        if (requestId.current === currentRequestId) {
          setRelatedError("相关新闻暂不可用");
        }
      },
    );

    return () => {
      const dwellMs = Math.max(0, Date.now() - openedAt);
      void service.recordEvent({ dwellMs, eventType: "dwell", itemId }).catch(() => undefined);
    };
  }, [itemId, retryKey, service]);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  const recordCompletion = useCallback(async () => {
    if (service && itemId) {
      await service.recordEvent({ eventType: "complete", itemId });
    }
  }, [itemId, service]);

  const recordShare = useCallback(async () => {
    if (service && itemId) {
      await service.recordEvent({ eventType: "share", itemId });
    }
  }, [itemId, service]);

  const submitFeedback = useCallback(async (feedbackType: NewsFeedbackType) => {
    if (!service || !itemId || feedbackPending) {
      return;
    }
    setFeedbackPending(true);
    setFeedbackMessage(undefined);
    setFeedbackError(undefined);
    try {
      await service.submitFeedback(itemId, feedbackType);
      setFeedbackMessage("反馈已提交，将用于优化后续推荐");
    } catch {
      setFeedbackError("反馈提交失败，请重试");
    } finally {
      setFeedbackPending(false);
    }
  }, [feedbackPending, itemId, service]);

  return {
    ...(article ? { article } : {}),
    ...(feedbackError ? { feedbackError } : {}),
    ...(feedbackMessage ? { feedbackMessage } : {}),
    feedbackPending,
    recordCompletion,
    recordShare,
    ...(relatedError ? { relatedError } : {}),
    relatedItems,
    retry,
    status,
    submitFeedback,
  };
}
