#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(workspaceRoot, "generated", "openapi");
const OWNER = "sdkwork-news";
const DOMAIN = "news";

const schemas = {
  NewsApiResult: {
    type: "object",
    additionalProperties: false,
    required: ["code", "message", "requestId", "data"],
    properties: {
      code: { type: "string" },
      message: { type: "string" },
      requestId: { type: "string", format: "uuid" },
      data: {},
    },
  },
  NewsCategory: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "title", "priority", "enabled"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      priority: { type: "integer" },
      enabled: { type: "boolean" },
    },
  },
  NewsItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "categoryId", "slug", "title", "summary", "status", "priority"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      categoryId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      body: { type: "string" },
      status: { $ref: "#/components/schemas/NewsItemStatus" },
      authorName: { type: "string" },
      featured: { type: "boolean" },
      priority: { type: "integer" },
      estimatedReadMinutes: { type: "integer" },
      tags: { type: "array", items: { type: "string" } },
      publishedAt: { type: "string", format: "date-time" },
      scheduledFor: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  MediaResource: {
    type: "object",
    additionalProperties: true,
    required: ["kind", "source"],
    properties: {
      id: { type: "string" },
      kind: { type: "string", enum: ["image", "video", "audio", "voice", "document", "archive", "other"] },
      source: { type: "string", enum: ["drive", "external_url", "provider_asset", "generated"] },
      uri: { type: "string" },
      url: { type: "string", format: "uri" },
      publicUrl: { type: "string", format: "uri" },
      mimeType: { type: "string" },
      sizeBytes: { type: "string", pattern: "^[0-9]+$" },
      width: { type: "integer", minimum: 0 },
      height: { type: "integer", minimum: 0 },
      durationSeconds: { type: "number", minimum: 0 },
      altText: { type: "string" },
      title: { type: "string" },
      metadata: { type: "object", additionalProperties: true },
    },
  },
  NewsChannel: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "title", "type", "status"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      type: { type: "string", enum: ["editorial", "algorithmic", "topic", "following", "hot"] },
      status: { type: "string", enum: ["active", "inactive", "archived"] },
      priority: { type: "integer" },
    },
  },
  NewsTopic: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "title", "status"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string", enum: ["active", "inactive", "archived"] },
      priority: { type: "integer" },
    },
  },
  NewsSource: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "title", "status"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      sourceType: { type: "string" },
      trustTier: { type: "string" },
      status: { type: "string" },
      locale: { type: "string" },
      region: { type: "string" },
      homepageUrl: { type: "string", format: "uri" },
    },
  },
  NewsAuthor: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "displayName", "status"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      sourceId: { type: "string" },
      userId: { type: "string" },
      slug: { type: "string" },
      displayName: { type: "string" },
      bio: { type: "string" },
      status: { type: "string" },
    },
  },
  NewsFeedItem: {
    type: "object",
    additionalProperties: false,
    required: ["item"],
    properties: {
      item: ref("NewsItem"),
      channelId: { type: "string" },
      rank: { type: "integer" },
      reason: { type: "string" },
      traceId: { type: "string" },
    },
  },
  NewsFeedPage: pageOf("NewsFeedItem"),
  NewsItemPage: pageOf("NewsItem"),
  NewsCommentPage: pageOf("NewsComment"),
  NewsFavoritePage: pageOf("NewsFavorite"),
  NewsFollowPage: pageOf("NewsFollow"),
  NewsSearchResultPage: pageOf("NewsSearchResult"),
  NewsSearchSuggestionListResponse: arrayOf("NewsSearchSuggestion"),
  NewsUserInterestSignalListResponse: arrayOf("NewsUserInterestSignal"),
  NewsFeedCandidateListResponse: arrayOf("NewsFeedCandidate"),
  NewsRecommendationEventCommand: {
    type: "object",
    additionalProperties: false,
    required: ["itemId", "eventType", "occurredAt"],
    properties: {
      itemId: { type: "string" },
      channelId: { type: "string" },
      eventType: { type: "string", enum: ["impression", "click", "dwell", "complete", "dismiss", "share"] },
      dwellMs: { type: "integer", minimum: 0 },
      traceId: { type: "string" },
      occurredAt: { type: "string", format: "date-time" },
    },
  },
  NewsUserFeedbackCommand: {
    type: "object",
    additionalProperties: false,
    required: ["targetType", "targetId", "feedbackType"],
    properties: {
      targetType: { type: "string", enum: ["item", "source", "author", "topic", "channel"] },
      targetId: { type: "string" },
      feedbackType: { type: "string", enum: ["not_interested", "block_source", "less_like_this", "more_like_this", "quality"] },
      reason: { type: "string" },
    },
  },
  NewsFavorite: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "userId", "itemId", "createdAt"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      userId: { type: "string" },
      itemId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  NewsReactionCommand: {
    type: "object",
    additionalProperties: false,
    required: ["reactionType"],
    properties: {
      reactionType: { type: "string", enum: ["like", "dislike", "laugh", "sad", "angry", "wow"] },
    },
  },
  NewsReaction: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "userId", "itemId", "reactionType", "updatedAt"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      userId: { type: "string" },
      itemId: { type: "string" },
      reactionType: { type: "string" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  NewsComment: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "itemId", "userId", "body", "moderationStatus", "createdAt"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      itemId: { type: "string" },
      parentId: { type: "string" },
      userId: { type: "string" },
      body: { type: "string" },
      moderationStatus: { type: "string", enum: ["pending", "approved", "rejected", "hidden"] },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  NewsCommentCommand: {
    type: "object",
    additionalProperties: false,
    required: ["body"],
    properties: {
      body: { type: "string" },
      parentId: { type: "string" },
    },
  },
  NewsReportCommand: {
    type: "object",
    additionalProperties: false,
    required: ["targetType", "targetId", "reason"],
    properties: {
      targetType: { type: "string", enum: ["item", "comment", "media", "source"] },
      targetId: { type: "string" },
      reason: { type: "string" },
    },
  },
  NewsFollow: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "userId", "targetType", "targetId", "createdAt"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      userId: { type: "string" },
      targetType: { type: "string", enum: ["source", "author", "topic", "channel"] },
      targetId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  NewsFollowCommand: {
    type: "object",
    additionalProperties: false,
    required: ["targetType", "targetId"],
    properties: {
      targetType: { type: "string", enum: ["source", "author", "topic", "channel"] },
      targetId: { type: "string" },
    },
  },
  NewsTrendingMetric: {
    type: "object",
    additionalProperties: false,
    required: ["tenantId", "itemId", "metricWindow", "score", "rank", "computedAt"],
    properties: {
      tenantId: { type: "string" },
      itemId: { type: "string" },
      metricWindow: { type: "string", enum: ["hour", "day", "week"] },
      score: { type: "integer" },
      rank: { type: "integer" },
      computedAt: { type: "string", format: "date-time" },
    },
  },
  NewsItemMetricSnapshot: {
    type: "object",
    additionalProperties: false,
    required: [
      "tenantId",
      "itemId",
      "impressionCount",
      "clickCount",
      "shareCount",
      "commentCount",
      "favoriteCount",
      "reactionCount",
      "reportCount",
      "hotScore",
      "computedAt",
    ],
    properties: {
      tenantId: { type: "string" },
      itemId: { type: "string" },
      impressionCount: { type: "integer", minimum: 0 },
      clickCount: { type: "integer", minimum: 0 },
      shareCount: { type: "integer", minimum: 0 },
      commentCount: { type: "integer", minimum: 0 },
      favoriteCount: { type: "integer", minimum: 0 },
      reactionCount: { type: "integer", minimum: 0 },
      reportCount: { type: "integer", minimum: 0 },
      hotScore: { type: "integer" },
      computedAt: { type: "string", format: "date-time" },
    },
  },
  NewsSearchResult: {
    type: "object",
    additionalProperties: false,
    required: ["item", "score"],
    properties: {
      item: ref("NewsItem"),
      score: { type: "number" },
      highlight: { type: "string" },
    },
  },
  NewsSearchSuggestion: {
    type: "object",
    additionalProperties: false,
    required: ["tenantId", "normalizedQuery", "displayQuery", "suggestionType", "rank", "score"],
    properties: {
      tenantId: { type: "string" },
      normalizedQuery: { type: "string" },
      displayQuery: { type: "string" },
      suggestionType: { type: "string", enum: ["hot", "history", "topic", "source", "correction"] },
      rank: { type: "integer" },
      score: { type: "integer" },
      locale: { type: "string" },
    },
  },
  NewsSearchSuggestionCommand: {
    type: "object",
    additionalProperties: false,
    required: ["normalizedQuery", "displayQuery", "suggestionType", "rank", "score", "computedAt"],
    properties: {
      normalizedQuery: { type: "string" },
      displayQuery: { type: "string" },
      suggestionType: { type: "string", enum: ["hot", "history", "topic", "source", "correction"] },
      rank: { type: "integer" },
      score: { type: "integer" },
      locale: { type: "string" },
      computedAt: { type: "string", format: "date-time" },
    },
  },
  NewsSearchEvent: {
    type: "object",
    additionalProperties: false,
    required: ["tenantId", "normalizedQuery", "displayQuery", "resultCount", "occurredAt"],
    properties: {
      tenantId: { type: "string" },
      userId: { type: "string" },
      normalizedQuery: { type: "string" },
      displayQuery: { type: "string" },
      resultCount: { type: "integer", minimum: 0 },
      clickedItemId: { type: "string" },
      traceId: { type: "string" },
      occurredAt: { type: "string", format: "date-time" },
    },
  },
  NewsUserInterestSignal: {
    type: "object",
    additionalProperties: false,
    required: ["tenantId", "userId", "targetType", "targetId", "affinityScore", "confidence", "source", "updatedAt"],
    properties: {
      tenantId: { type: "string" },
      userId: { type: "string" },
      targetType: { type: "string", enum: ["source", "author", "topic", "channel", "tag"] },
      targetId: { type: "string" },
      affinityScore: { type: "integer" },
      confidence: { type: "integer" },
      source: { type: "string", enum: ["explicit", "behavior", "editorial", "imported"] },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  NewsUserInterestCommand: {
    type: "object",
    additionalProperties: false,
    required: ["targetType", "targetId", "affinityScore", "confidence", "source"],
    properties: {
      targetType: { type: "string", enum: ["source", "author", "topic", "channel", "tag"] },
      targetId: { type: "string" },
      affinityScore: { type: "integer" },
      confidence: { type: "integer" },
      source: { type: "string", enum: ["explicit", "behavior", "editorial", "imported"] },
    },
  },
  NewsFeedCandidate: {
    type: "object",
    additionalProperties: false,
    required: ["tenantId", "streamKey", "itemId", "score", "reasonCode", "generatedAt"],
    properties: {
      tenantId: { type: "string" },
      userId: { type: "string" },
      streamKey: { type: "string" },
      itemId: { type: "string" },
      score: { type: "integer" },
      reasonCode: { type: "string" },
      traceId: { type: "string" },
      generatedAt: { type: "string", format: "date-time" },
      expiresAt: { type: "string", format: "date-time" },
    },
  },
  NewsFeedCandidateCommand: {
    type: "object",
    additionalProperties: false,
    required: ["streamKey", "itemId", "score", "reasonCode", "generatedAt"],
    properties: {
      userId: { type: "string" },
      streamKey: { type: "string" },
      itemId: { type: "string" },
      score: { type: "integer" },
      reasonCode: { type: "string" },
      traceId: { type: "string" },
      generatedAt: { type: "string", format: "date-time" },
      expiresAt: { type: "string", format: "date-time" },
    },
  },
  NewsModerationCase: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "targetType", "targetId", "reason", "priority", "status", "createdAt"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      targetType: { type: "string" },
      targetId: { type: "string" },
      reason: { type: "string" },
      priority: { type: "integer" },
      status: { type: "string", enum: ["open", "reviewing", "resolved", "rejected"] },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  NewsExperiment: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "experimentKey", "title", "surface", "status"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      experimentKey: { type: "string" },
      title: { type: "string" },
      surface: { type: "string" },
      status: { type: "string", enum: ["draft", "active", "paused", "archived"] },
      allocation: { type: "integer" },
    },
  },
  NewsGenericCommand: {
    type: "object",
    additionalProperties: true,
  },
  NewsItemStatus: {
    type: "string",
    enum: ["draft", "published", "scheduled", "archived"],
  },
  NewsOverview: {
    type: "object",
    additionalProperties: true,
  },
  NewsEditorialReadiness: {
    type: "object",
    additionalProperties: false,
    required: ["ready", "canPublish", "canSchedule", "canArchive", "canFeature", "issues"],
    properties: {
      ready: { type: "boolean" },
      canPublish: { type: "boolean" },
      canSchedule: { type: "boolean" },
      canArchive: { type: "boolean" },
      canFeature: { type: "boolean" },
      issues: { type: "array", items: { type: "string" } },
    },
  },
  NewsCategoryCommand: {
    type: "object",
    additionalProperties: false,
    properties: {
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      priority: { type: "integer" },
      enabled: { type: "boolean" },
    },
  },
  NewsItemCommand: {
    type: "object",
    additionalProperties: false,
    properties: {
      categoryId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      body: { type: "string" },
      authorName: { type: "string" },
      priority: { type: "integer" },
      tags: { type: "array", items: { type: "string" } },
    },
  },
  NewsScheduleCommand: {
    type: "object",
    additionalProperties: false,
    required: ["scheduledFor"],
    properties: {
      scheduledFor: { type: "string", format: "date-time" },
    },
  },
  ProblemDetail: {
    type: "object",
    additionalProperties: true,
    required: ["type", "title", "status"],
    properties: {
      type: { type: "string", format: "uri-reference" },
      title: { type: "string" },
      status: { type: "integer", minimum: 100, maximum: 599 },
      detail: { type: "string" },
      requestId: { type: "string", format: "uuid" },
    },
  },
};

const appRoutes = [
  route("get", "/app/v3/api/news/categories", "categories.list", { schema: arrayOf("NewsCategory") }, false),
  route("get", "/app/v3/api/news/items", "items.list", { schema: arrayOf("NewsItem") }, false, listParams()),
  route("get", "/app/v3/api/news/items/{itemId}", "items.retrieve", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("get", "/app/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", { schema: ref("NewsItem") }, false, [pathParam("slug")]),
  route("get", "/app/v3/api/news/overview", "overview.retrieve", { schema: ref("NewsOverview") }, false),
  route("get", "/app/v3/api/news/channels", "channels.list", { schema: arrayOf("NewsChannel") }, false, pageParams()),
  route("get", "/app/v3/api/news/channels/{channelId}/feed", "channels.feed.list", { schema: ref("NewsFeedPage") }, false, [pathParam("channelId"), ...feedParams()]),
  route("get", "/app/v3/api/news/topics", "topics.list", { schema: arrayOf("NewsTopic") }, false, pageParams()),
  route("get", "/app/v3/api/news/topics/{topicId}/items", "topics.items.list", { schema: ref("NewsItemPage") }, false, [pathParam("topicId"), ...feedParams()]),
  route("get", "/app/v3/api/news/feed/personalized", "feed.personalized.list", { schema: ref("NewsFeedPage") }, false, feedParams()),
  route("get", "/app/v3/api/news/items/{itemId}/related", "items.related.list", { schema: ref("NewsItemPage") }, false, [pathParam("itemId"), ...pageParams()]),
  route("get", "/app/v3/api/news/trending", "trending.list", { schema: arrayOf("NewsTrendingMetric") }, false, pageParams()),
  route("get", "/app/v3/api/news/search", "search.list", { schema: ref("NewsSearchResultPage") }, false, searchParams()),
  route("get", "/app/v3/api/news/search/suggestions", "search.suggestions.list", { schema: ref("NewsSearchSuggestionListResponse") }, false, suggestionParams()),
  route("post", "/app/v3/api/news/events", "events.create", { schema: ref("NewsApiResult") }, false, [], "NewsRecommendationEventCommand"),
  route("get", "/app/v3/api/news/favorites", "favorites.list", { schema: ref("NewsFavoritePage") }, false, pageParams()),
  route("post", "/app/v3/api/news/items/{itemId}/favorites", "favorites.create", { schema: ref("NewsFavorite") }, false, [pathParam("itemId")]),
  route("delete", "/app/v3/api/news/items/{itemId}/favorites", "favorites.delete", { schema: ref("NewsApiResult") }, false, [pathParam("itemId")]),
  route("put", "/app/v3/api/news/items/{itemId}/reactions", "reactions.upsert", { schema: ref("NewsReaction") }, false, [pathParam("itemId")], "NewsReactionCommand"),
  route("get", "/app/v3/api/news/items/{itemId}/comments", "comments.list", { schema: ref("NewsCommentPage") }, false, [pathParam("itemId"), ...pageParams()]),
  route("post", "/app/v3/api/news/items/{itemId}/comments", "comments.create", { schema: ref("NewsComment") }, false, [pathParam("itemId")], "NewsCommentCommand"),
  route("post", "/app/v3/api/news/reports", "reports.create", { schema: ref("NewsApiResult") }, false, [], "NewsReportCommand"),
  route("post", "/app/v3/api/news/feedback", "feedback.create", { schema: ref("NewsApiResult") }, false, [], "NewsUserFeedbackCommand"),
  route("get", "/app/v3/api/news/history", "history.list", { schema: ref("NewsItemPage") }, false, pageParams()),
  route("get", "/app/v3/api/news/follows", "follows.list", { schema: ref("NewsFollowPage") }, false, pageParams()),
  route("post", "/app/v3/api/news/follows", "follows.create", { schema: ref("NewsFollow") }, false, [], "NewsFollowCommand"),
  route("delete", "/app/v3/api/news/follows/{followId}", "follows.delete", { schema: ref("NewsApiResult") }, false, [pathParam("followId")]),
  route("get", "/app/v3/api/news/interests", "interests.list", { schema: ref("NewsUserInterestSignalListResponse") }, false, pageParams()),
  route("put", "/app/v3/api/news/interests", "interests.upsert", { schema: ref("NewsUserInterestSignal") }, false, [], "NewsUserInterestCommand"),
];

const openRoutes = [
  route("get", "/open/v3/api/news/items", "items.list", { schema: arrayOf("NewsItem") }, true, listParams()),
  route("get", "/open/v3/api/news/items/{itemId}", "items.retrieve", { schema: ref("NewsItem") }, true, [pathParam("itemId")]),
  route("get", "/open/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", { schema: ref("NewsItem") }, true, [pathParam("slug")]),
  route("get", "/open/v3/api/news/channels", "channels.list", { schema: arrayOf("NewsChannel") }, true, pageParams()),
  route("get", "/open/v3/api/news/channels/{channelId}/feed", "channels.feed.list", { schema: ref("NewsFeedPage") }, true, [pathParam("channelId"), ...feedParams()]),
  route("get", "/open/v3/api/news/topics", "topics.list", { schema: arrayOf("NewsTopic") }, true, pageParams()),
  route("get", "/open/v3/api/news/topics/{topicId}/items", "topics.items.list", { schema: ref("NewsItemPage") }, true, [pathParam("topicId"), ...feedParams()]),
  route("get", "/open/v3/api/news/items/{itemId}/related", "items.related.list", { schema: ref("NewsItemPage") }, true, [pathParam("itemId"), ...pageParams()]),
  route("get", "/open/v3/api/news/trending", "trending.list", { schema: arrayOf("NewsTrendingMetric") }, true, pageParams()),
  route("get", "/open/v3/api/news/search", "search.list", { schema: ref("NewsSearchResultPage") }, true, searchParams()),
  route("get", "/open/v3/api/news/search/suggestions", "search.suggestions.list", { schema: ref("NewsSearchSuggestionListResponse") }, true, suggestionParams()),
];

const backendRoutes = [
  route("get", "/backend/v3/api/news/categories", "categories.management.list", { schema: arrayOf("NewsCategory") }, false),
  route("post", "/backend/v3/api/news/categories", "categories.create", { schema: ref("NewsCategory") }, false, [], "NewsCategoryCommand"),
  route("patch", "/backend/v3/api/news/categories/{categoryId}", "categories.update", { schema: ref("NewsCategory") }, false, [pathParam("categoryId")], "NewsCategoryCommand"),
  route("delete", "/backend/v3/api/news/categories/{categoryId}", "categories.delete", { schema: ref("NewsApiResult") }, false, [pathParam("categoryId")]),
  route("get", "/backend/v3/api/news/items", "items.management.list", { schema: arrayOf("NewsItem") }, false, listParams()),
  route("post", "/backend/v3/api/news/items", "items.create", { schema: ref("NewsItem") }, false, [], "NewsItemCommand"),
  route("patch", "/backend/v3/api/news/items/{itemId}", "items.update", { schema: ref("NewsItem") }, false, [pathParam("itemId")], "NewsItemCommand"),
  route("delete", "/backend/v3/api/news/items/{itemId}", "items.delete", { schema: ref("NewsApiResult") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/publish", "items.publish", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/schedule", "items.schedule", { schema: ref("NewsItem") }, false, [pathParam("itemId")], "NewsScheduleCommand"),
  route("post", "/backend/v3/api/news/items/{itemId}/archive", "items.archive", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/feature", "items.feature", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("get", "/backend/v3/api/news/items/{itemId}/editorial_readiness", "items.editorialReadiness.retrieve", { schema: ref("NewsEditorialReadiness") }, false, [pathParam("itemId")]),
  route("get", "/backend/v3/api/news/sources", "sources.management.list", { schema: arrayOf("NewsSource") }, false, pageParams()),
  route("post", "/backend/v3/api/news/sources", "sources.create", { schema: ref("NewsSource") }, false, [], "NewsGenericCommand"),
  route("patch", "/backend/v3/api/news/sources/{sourceId}", "sources.update", { schema: ref("NewsSource") }, false, [pathParam("sourceId")], "NewsGenericCommand"),
  route("delete", "/backend/v3/api/news/sources/{sourceId}", "sources.delete", { schema: ref("NewsApiResult") }, false, [pathParam("sourceId")]),
  route("get", "/backend/v3/api/news/authors", "authors.management.list", { schema: arrayOf("NewsAuthor") }, false, pageParams()),
  route("post", "/backend/v3/api/news/authors", "authors.create", { schema: ref("NewsAuthor") }, false, [], "NewsGenericCommand"),
  route("patch", "/backend/v3/api/news/authors/{authorId}", "authors.update", { schema: ref("NewsAuthor") }, false, [pathParam("authorId")], "NewsGenericCommand"),
  route("delete", "/backend/v3/api/news/authors/{authorId}", "authors.delete", { schema: ref("NewsApiResult") }, false, [pathParam("authorId")]),
  route("get", "/backend/v3/api/news/channels", "channels.management.list", { schema: arrayOf("NewsChannel") }, false, pageParams()),
  route("post", "/backend/v3/api/news/channels", "channels.create", { schema: ref("NewsChannel") }, false, [], "NewsGenericCommand"),
  route("patch", "/backend/v3/api/news/channels/{channelId}", "channels.update", { schema: ref("NewsChannel") }, false, [pathParam("channelId")], "NewsGenericCommand"),
  route("delete", "/backend/v3/api/news/channels/{channelId}", "channels.delete", { schema: ref("NewsApiResult") }, false, [pathParam("channelId")]),
  route("get", "/backend/v3/api/news/topics", "topics.management.list", { schema: arrayOf("NewsTopic") }, false, pageParams()),
  route("post", "/backend/v3/api/news/topics", "topics.create", { schema: ref("NewsTopic") }, false, [], "NewsGenericCommand"),
  route("patch", "/backend/v3/api/news/topics/{topicId}", "topics.update", { schema: ref("NewsTopic") }, false, [pathParam("topicId")], "NewsGenericCommand"),
  route("delete", "/backend/v3/api/news/topics/{topicId}", "topics.delete", { schema: ref("NewsApiResult") }, false, [pathParam("topicId")]),
  route("get", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.list", { schema: arrayOf("NewsItem") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.create", { schema: ref("NewsItem") }, false, [pathParam("itemId")], "NewsItemCommand"),
  route("get", "/backend/v3/api/news/items/{itemId}/media", "items.media.list", { schema: arrayOf("MediaResource") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/media", "items.media.attach", { schema: ref("MediaResource") }, false, [pathParam("itemId")], "MediaResource"),
  route("delete", "/backend/v3/api/news/items/{itemId}/media/{mediaId}", "items.media.delete", { schema: ref("NewsApiResult") }, false, [pathParam("itemId"), pathParam("mediaId")]),
  route("get", "/backend/v3/api/news/moderation/cases", "moderation.cases.list", { schema: arrayOf("NewsModerationCase") }, false, pageParams()),
  route("get", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.retrieve", { schema: ref("NewsModerationCase") }, false, [pathParam("caseId")]),
  route("patch", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.update", { schema: ref("NewsModerationCase") }, false, [pathParam("caseId")], "NewsGenericCommand"),
  route("get", "/backend/v3/api/news/comments/moderation", "comments.moderation.list", { schema: arrayOf("NewsComment") }, false, pageParams()),
  route("patch", "/backend/v3/api/news/comments/{commentId}/moderation", "comments.moderation.update", { schema: ref("NewsComment") }, false, [pathParam("commentId")], "NewsGenericCommand"),
  route("get", "/backend/v3/api/news/reports", "reports.management.list", { schema: ref("NewsApiResult") }, false, pageParams()),
  route("patch", "/backend/v3/api/news/reports/{reportId}", "reports.update", { schema: ref("NewsApiResult") }, false, [pathParam("reportId")], "NewsGenericCommand"),
  route("get", "/backend/v3/api/news/trending/metrics", "trending.metrics.list", { schema: arrayOf("NewsTrendingMetric") }, false, pageParams()),
  route("put", "/backend/v3/api/news/trending/metrics", "trending.metrics.upsert", { schema: ref("NewsTrendingMetric") }, false, [], "NewsGenericCommand"),
  route("get", "/backend/v3/api/news/items/metrics", "items.metrics.list", { schema: arrayOf("NewsItemMetricSnapshot") }, false, pageParams()),
  route("get", "/backend/v3/api/news/items/{itemId}/metrics", "items.metrics.retrieve", { schema: ref("NewsItemMetricSnapshot") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/metrics/rebuild", "items.metrics.rebuild", { schema: ref("NewsApiResult") }, false, [], "NewsGenericCommand"),
  route("get", "/backend/v3/api/news/feed/candidates", "feed.candidates.list", { schema: ref("NewsFeedCandidateListResponse") }, false, candidateParams()),
  route("put", "/backend/v3/api/news/feed/candidates", "feed.candidates.upsert", { schema: ref("NewsFeedCandidate") }, false, [], "NewsFeedCandidateCommand"),
  route("delete", "/backend/v3/api/news/feed/candidates/{candidateId}", "feed.candidates.delete", { schema: ref("NewsApiResult") }, false, [pathParam("candidateId")]),
  route("get", "/backend/v3/api/news/interests", "interests.management.list", { schema: ref("NewsUserInterestSignalListResponse") }, false, interestParams()),
  route("post", "/backend/v3/api/news/interests/rebuild", "interests.rebuild", { schema: ref("NewsApiResult") }, false, [], "NewsGenericCommand"),
  route("delete", "/backend/v3/api/news/interests/{interestId}", "interests.delete", { schema: ref("NewsApiResult") }, false, [pathParam("interestId")]),
  route("get", "/backend/v3/api/news/search/suggestions", "search.suggestions.management.list", { schema: ref("NewsSearchSuggestionListResponse") }, false, suggestionParams()),
  route("put", "/backend/v3/api/news/search/suggestions", "search.suggestions.upsert", { schema: ref("NewsSearchSuggestion") }, false, [], "NewsSearchSuggestionCommand"),
  route("delete", "/backend/v3/api/news/search/suggestions/{suggestionId}", "search.suggestions.delete", { schema: ref("NewsApiResult") }, false, [pathParam("suggestionId")]),
  route("get", "/backend/v3/api/news/search/events", "search.events.list", { schema: arrayOf("NewsSearchEvent") }, false, searchEventParams()),
  route("post", "/backend/v3/api/news/search/projections/rebuild", "search.projections.rebuild", { schema: ref("NewsApiResult") }, false),
  route("get", "/backend/v3/api/news/experiments", "experiments.management.list", { schema: arrayOf("NewsExperiment") }, false, pageParams()),
  route("post", "/backend/v3/api/news/experiments", "experiments.create", { schema: ref("NewsExperiment") }, false, [], "NewsGenericCommand"),
  route("patch", "/backend/v3/api/news/experiments/{experimentId}", "experiments.update", { schema: ref("NewsExperiment") }, false, [pathParam("experimentId")], "NewsGenericCommand"),
  route("post", "/backend/v3/api/news/experiments/{experimentId}/archive", "experiments.archive", { schema: ref("NewsExperiment") }, false, [pathParam("experimentId")]),
];

function ref(name) {
  return { $ref: `#/components/schemas/${name}` };
}

function arrayOf(name) {
  return { type: "array", items: ref(name) };
}

function pageOf(name) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["items", "hasMore", "limit"],
    properties: {
      items: { type: "array", items: ref(name) },
      cursor: { type: "string" },
      hasMore: { type: "boolean" },
      limit: { type: "integer", minimum: 1, maximum: 100 },
    },
  };
}

function pathParam(name) {
  return {
    name,
    in: "path",
    required: true,
    schema: { type: "string" },
  };
}

function queryParam(name) {
  return {
    name,
    in: "query",
    required: false,
    schema: { type: "string" },
  };
}

function listParams() {
  return [queryParam("categoryId"), queryParam("q"), queryParam("status")];
}

function pageParams() {
  return [queryParam("cursor"), queryParam("limit")];
}

function feedParams() {
  return [queryParam("cursor"), queryParam("limit"), queryParam("trace_id")];
}

function searchParams() {
  return [queryParam("q"), queryParam("cursor"), queryParam("limit")];
}

function suggestionParams() {
  return [queryParam("q"), queryParam("cursor"), queryParam("limit"), queryParam("locale")];
}

function candidateParams() {
  return [queryParam("stream_key"), queryParam("user_id"), queryParam("cursor"), queryParam("limit")];
}

function interestParams() {
  return [queryParam("user_id"), queryParam("target_type"), queryParam("cursor"), queryParam("limit")];
}

function searchEventParams() {
  return [queryParam("q"), queryParam("user_id"), queryParam("cursor"), queryParam("limit")];
}

function route(method, pathKey, operationId, response, isPublic, parameters = [], bodySchemaName = null) {
  return {
    method,
    path: pathKey,
    operation: {
      tags: ["news"],
      summary: `News ${operationId}`,
      operationId,
      parameters,
      ...(bodySchemaName ? {
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: ref(bodySchemaName),
            },
          },
        },
      } : {}),
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": response,
          },
        },
        400: problemResponse(),
        401: problemResponse(),
      },
      security: isPublic ? [] : [{ AuthToken: [], AccessToken: [] }],
      "x-sdkwork-owner": OWNER,
      "x-sdkwork-api-authority": "",
      "x-sdkwork-domain": DOMAIN,
      "x-sdkwork-resource": operationId.split(".")[0],
      "x-sdkwork-public": isPublic,
    },
  };
}

function problemResponse() {
  return {
    description: "Problem detail",
    content: {
      "application/problem+json": {
        schema: ref("ProblemDetail"),
      },
    },
  };
}

function documentFor({ authority, routes, serverUrl, title }) {
  const paths = {};
  for (const item of routes) {
    paths[item.path] ??= {};
    item.operation["x-sdkwork-api-authority"] = authority;
    paths[item.path][item.method] = item.operation;
  }
  return {
    openapi: "3.1.2",
    info: {
      title,
      version: "1.0.0",
      "x-sdkwork-owner": OWNER,
      "x-sdkwork-api-authority": authority,
    },
    servers: [{ url: serverUrl }],
    tags: [{ name: "news", description: "News API resources.", "x-sdk-nested-resource-surface": true }],
    paths,
    components: {
      securitySchemes: {
        AuthToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        AccessToken: {
          type: "apiKey",
          in: "header",
          name: "Access-Token",
        },
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },
      schemas,
    },
    "x-sdkwork-owner": OWNER,
    "x-sdkwork-api-authority": authority,
    "x-sdkwork-domain": DOMAIN,
    "x-sdkwork-standard-profile": "sdkwork-v3",
  };
}

function parseArgs(argv) {
  return {
    check: argv.includes("--check"),
  };
}

const args = parseArgs(process.argv.slice(2));
const docs = [
  ["news-open-api.openapi.json", documentFor({ authority: "sdkwork-news.open", routes: openRoutes, serverUrl: "http://127.0.0.1:18082", title: "SDKWork News Open API" })],
  ["news-app-api.openapi.json", documentFor({ authority: "sdkwork-news.app", routes: appRoutes, serverUrl: "http://127.0.0.1:18080", title: "SDKWork News App API" })],
  ["news-backend-api.openapi.json", documentFor({ authority: "sdkwork-news.backend", routes: backendRoutes, serverUrl: "http://127.0.0.1:18080", title: "SDKWork News Backend API" })],
];

if (!args.check) {
  mkdirSync(outputDir, { recursive: true });
  for (const [fileName, document] of docs) {
    writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(document, null, 2)}\n`, "utf8");
  }
}

process.stdout.write(`[news_openapi_export] ok app=${appRoutes.length} backend=${backendRoutes.length} open=${openRoutes.length}\n`);
