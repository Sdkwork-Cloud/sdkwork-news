export type NewsApiSurface = "app-api" | "backend-api" | "open-api";
export type NewsApiAuthMode = "anonymous" | "dual-token";
export type NewsApiHttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export interface NewsApiOperationDefinition {
  readonly auditEvent?: string;
  readonly authMode: NewsApiAuthMode;
  readonly dataScope?: "organization" | "tenant" | "user";
  readonly idempotent: boolean;
  readonly method: NewsApiHttpMethod;
  readonly operationId: string;
  readonly path: string;
  readonly permission?: string;
  readonly public: boolean;
  readonly requestSchema?: string;
  readonly resource: string;
  readonly responseSchema: string;
  readonly summary: string;
  readonly surface: NewsApiSurface;
  readonly tenantScope?: "tenant";
  readonly todo: string;
}

type OperationSeed = readonly [
  method: NewsApiHttpMethod,
  path: string,
  operationId: string,
  resource: string,
  responseSchema: string,
  summary: string,
  requestSchema?: string,
  idempotent?: boolean,
];

const openOperationSeeds: readonly OperationSeed[] = [
  ["GET", "/open/v3/api/news/items", "items.list", "items", "NewsItemPage", "List public published news items."],
  ["GET", "/open/v3/api/news/items/{itemId}", "items.retrieve", "items", "NewsItem", "Retrieve a public published news item."],
  ["GET", "/open/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", "items", "NewsItem", "Retrieve a public news item by slug."],
  ["GET", "/open/v3/api/news/channels", "channels.list", "channels", "NewsChannelListResponse", "List public news channels."],
  ["GET", "/open/v3/api/news/channels/{channelId}/feed", "channels.feed.list", "channels.feed", "NewsFeedPage", "List public channel feed items."],
  ["GET", "/open/v3/api/news/topics", "topics.list", "topics", "NewsTopicListResponse", "List public news topics."],
  ["GET", "/open/v3/api/news/topics/{topicId}/items", "topics.items.list", "topics.items", "NewsItemPage", "List public topic items."],
  ["GET", "/open/v3/api/news/items/{itemId}/related", "items.related.list", "items.related", "NewsItemPage", "List related public news items."],
  ["GET", "/open/v3/api/news/trending", "trending.list", "trending", "TrendingListResponse", "List public trending items."],
  ["GET", "/open/v3/api/news/search", "search.list", "search", "NewsSearchResultPage", "Search public news."],
  ["GET", "/open/v3/api/news/search/suggestions", "search.suggestions.list", "search.suggestions", "NewsSearchSuggestionListResponse", "List public search suggestions."],
  ["GET", "/open/v3/api/news/alerts/breaking", "alerts.breaking.list", "alerts.breaking", "NewsBreakingAlertListResponse", "List public breaking alerts."],
  ["GET", "/open/v3/api/news/digests", "digests.list", "digests", "NewsDigestIssueListResponse", "List public digest issues."],
  ["GET", "/open/v3/api/news/items/{itemId}/trust", "trust.item.retrieve", "trust.items", "NewsItemTrustSnapshot", "Retrieve public item trust snapshot."],
  ["GET", "/open/v3/api/news/fact_checks", "factChecks.list", "factChecks", "NewsFactCheckListResponse", "List public fact checks."],
  ["GET", "/open/v3/api/news/corrections", "corrections.list", "corrections", "NewsCorrectionNoticeListResponse", "List public correction notices."],
  ["GET", "/open/v3/api/news/live/events", "live.events.list", "live.events", "NewsLiveEventListResponse", "List public live events."],
  ["GET", "/open/v3/api/news/live/events/{eventId}", "live.events.retrieve", "live.events", "NewsLiveEvent", "Retrieve a public live event."],
  ["GET", "/open/v3/api/news/live/events/{eventId}/updates", "live.updates.list", "live.updates", "NewsLiveUpdateListResponse", "List public live updates."],
  ["GET", "/open/v3/api/news/stories", "stories.list", "stories", "NewsStoryPage", "List public story packages."],
  ["GET", "/open/v3/api/news/stories/{storyId}", "stories.retrieve", "stories", "NewsStory", "Retrieve a public story package."],
  ["GET", "/open/v3/api/news/stories/{storyId}/items", "stories.items.list", "stories.items", "NewsItemPage", "List items in a public story package."],
  ["GET", "/open/v3/api/news/stories/{storyId}/timeline", "stories.timeline.list", "stories.timeline", "NewsStoryTimelineListResponse", "List public story timeline entries."],
  ["GET", "/open/v3/api/news/sources", "sources.list", "sources", "NewsSourceListResponse", "List public news sources."],
  ["GET", "/open/v3/api/news/sources/{sourceId}", "sources.retrieve", "sources", "NewsSource", "Retrieve a public news source."],
  ["GET", "/open/v3/api/news/authors", "authors.list", "authors", "NewsAuthorListResponse", "List public authors."],
  ["GET", "/open/v3/api/news/authors/{authorId}", "authors.retrieve", "authors", "NewsAuthor", "Retrieve a public author."],
  ["GET", "/open/v3/api/news/items/{itemId}/schema_org", "items.schemaOrg.retrieve", "items.schemaOrg", "NewsSchemaOrgProjection", "Retrieve JSON-LD schema.org projection."],
  ["GET", "/open/v3/api/news/items/{itemId}/rights", "items.rights.retrieve", "items.rights", "NewsItemRights", "Retrieve public rights and attribution metadata."],
  ["GET", "/open/v3/api/news/items/{itemId}/c2pa_provenance", "items.c2paProvenance.retrieve", "items.c2paProvenance", "NewsC2paProvenance", "Retrieve public content provenance metadata."],
];

const appOperationSeeds: readonly OperationSeed[] = [
  ["GET", "/app/v3/api/news/categories", "categories.list", "categories", "CategoriesListResponse", "List app-visible categories."],
  ["GET", "/app/v3/api/news/items", "items.list", "items", "NewsItemPage", "List app-visible items."],
  ["GET", "/app/v3/api/news/items/{itemId}", "items.retrieve", "items", "NewsItem", "Retrieve app-visible item."],
  ["GET", "/app/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", "items", "NewsItem", "Retrieve app-visible item by slug."],
  ["GET", "/app/v3/api/news/overview", "overview.retrieve", "overview", "NewsOverview", "Retrieve news overview."],
  ["GET", "/app/v3/api/news/channels", "channels.list", "channels", "ChannelsListResponse", "List app channels."],
  ["GET", "/app/v3/api/news/channels/{channelId}/feed", "channels.feed.list", "channels.feed", "NewsFeedPage", "List channel feed."],
  ["GET", "/app/v3/api/news/topics", "topics.list", "topics", "TopicsListResponse", "List topics."],
  ["GET", "/app/v3/api/news/topics/{topicId}/items", "topics.items.list", "topics.items", "NewsItemPage", "List topic items."],
  ["GET", "/app/v3/api/news/feed/personalized", "feed.personalized.list", "feed.personalized", "NewsFeedPage", "List personalized feed."],
  ["GET", "/app/v3/api/news/items/{itemId}/related", "items.related.list", "items.related", "NewsItemPage", "List related items."],
  ["GET", "/app/v3/api/news/trending", "trending.list", "trending", "TrendingListResponse", "List trending items."],
  ["GET", "/app/v3/api/news/search", "search.list", "search", "NewsSearchResultPage", "Search news."],
  ["GET", "/app/v3/api/news/search/suggestions", "search.suggestions.list", "search.suggestions", "NewsSearchSuggestionListResponse", "List search suggestions."],
  ["POST", "/app/v3/api/news/events", "events.create", "events", "NewsApiResult", "Record recommendation event.", "NewsRecommendationEventCommand", true],
  ["GET", "/app/v3/api/news/favorites", "favorites.list", "favorites", "NewsFavoritePage", "List favorites."],
  ["POST", "/app/v3/api/news/items/{itemId}/favorites", "favorites.create", "favorites", "NewsFavorite", "Create favorite.", "NewsGenericCommand", true],
  ["DELETE", "/app/v3/api/news/items/{itemId}/favorites", "favorites.delete", "favorites", "NewsApiResult", "Delete favorite."],
  ["PUT", "/app/v3/api/news/items/{itemId}/reactions", "reactions.upsert", "reactions", "NewsReaction", "Upsert reaction.", "NewsReactionCommand", true],
  ["GET", "/app/v3/api/news/items/{itemId}/comments", "comments.list", "comments", "NewsCommentPage", "List comments."],
  ["POST", "/app/v3/api/news/items/{itemId}/comments", "comments.create", "comments", "NewsComment", "Create comment.", "NewsCommentCommand", true],
  ["POST", "/app/v3/api/news/reports", "reports.create", "reports", "NewsApiResult", "Report content.", "NewsReportCommand", true],
  ["POST", "/app/v3/api/news/feedback", "feedback.create", "feedback", "NewsApiResult", "Create feedback.", "NewsUserFeedbackCommand", true],
  ["GET", "/app/v3/api/news/history", "history.list", "history", "NewsItemPage", "List reading history."],
  ["GET", "/app/v3/api/news/follows", "follows.list", "follows", "NewsFollowPage", "List follows."],
  ["POST", "/app/v3/api/news/follows", "follows.create", "follows", "NewsFollow", "Create follow.", "NewsFollowCommand", true],
  ["DELETE", "/app/v3/api/news/follows/{followId}", "follows.delete", "follows", "NewsApiResult", "Delete follow."],
  ["GET", "/app/v3/api/news/interests", "interests.list", "interests", "NewsUserInterestSignalListResponse", "List interest signals."],
  ["PUT", "/app/v3/api/news/interests", "interests.upsert", "interests", "NewsUserInterestSignal", "Upsert interest signal.", "NewsUserInterestCommand", true],
  ["GET", "/app/v3/api/news/notification/subscriptions", "notification.subscriptions.list", "notification.subscriptions", "NewsNotificationSubscriptionListResponse", "List subscriptions."],
  ["PUT", "/app/v3/api/news/notification/subscriptions", "notification.subscriptions.upsert", "notification.subscriptions", "NewsNotificationSubscription", "Upsert subscription.", "NewsNotificationSubscriptionCommand", true],
  ["DELETE", "/app/v3/api/news/notification/subscriptions/{subscriptionId}", "notification.subscriptions.delete", "notification.subscriptions", "NewsApiResult", "Delete subscription."],
  ["GET", "/app/v3/api/news/alerts/breaking", "alerts.breaking.list", "alerts.breaking", "NewsBreakingAlertListResponse", "List breaking alerts."],
  ["GET", "/app/v3/api/news/digests", "digests.list", "digests", "NewsDigestIssueListResponse", "List digests."],
  ["GET", "/app/v3/api/news/items/{itemId}/trust", "trust.item.retrieve", "trust.items", "NewsItemTrustSnapshot", "Retrieve item trust."],
  ["GET", "/app/v3/api/news/fact_checks", "factChecks.list", "factChecks", "NewsFactCheckListResponse", "List fact checks."],
  ["GET", "/app/v3/api/news/corrections", "corrections.list", "corrections", "NewsCorrectionNoticeListResponse", "List corrections."],
  ["GET", "/app/v3/api/news/live/events", "live.events.list", "live.events", "NewsLiveEventListResponse", "List live events."],
  ["GET", "/app/v3/api/news/live/events/{eventId}", "live.events.retrieve", "live.events", "NewsLiveEvent", "Retrieve live event."],
  ["GET", "/app/v3/api/news/live/events/{eventId}/updates", "live.updates.list", "live.updates", "NewsLiveUpdateListResponse", "List live updates."],
  ["GET", "/app/v3/api/news/feed/following", "feed.following.list", "feed.following", "NewsFeedPage", "List following feed."],
  ["GET", "/app/v3/api/news/feed/latest", "feed.latest.list", "feed.latest", "NewsFeedPage", "List latest feed."],
  ["GET", "/app/v3/api/news/feed/local", "feed.local.list", "feed.local", "NewsFeedPage", "List local feed."],
  ["GET", "/app/v3/api/news/stories", "stories.list", "stories", "NewsStoryPage", "List app story packages."],
  ["GET", "/app/v3/api/news/stories/{storyId}", "stories.retrieve", "stories", "NewsStory", "Retrieve app story package."],
  ["GET", "/app/v3/api/news/stories/{storyId}/items", "stories.items.list", "stories.items", "NewsItemPage", "List app story items."],
  ["POST", "/app/v3/api/news/items/{itemId}/share_events", "items.shareEvents.create", "items.shareEvents", "NewsApiResult", "Record share event.", "NewsShareEventCommand", true],
  ["PUT", "/app/v3/api/news/items/{itemId}/reading_progress", "items.readingProgress.upsert", "items.readingProgress", "NewsApiResult", "Upsert reading progress.", "NewsReadingProgressCommand", true],
];

const backendOperationSeeds: readonly OperationSeed[] = [
  ["GET", "/backend/v3/api/news/categories", "categories.management.list", "categories", "CategoriesManagementListResponse", "List categories for operators."],
  ["POST", "/backend/v3/api/news/categories", "categories.create", "categories", "NewsCategory", "Create category.", "NewsCategoryCommand", true],
  ["PATCH", "/backend/v3/api/news/categories/{categoryId}", "categories.update", "categories", "NewsCategory", "Update category.", "NewsCategoryCommand"],
  ["DELETE", "/backend/v3/api/news/categories/{categoryId}", "categories.delete", "categories", "NewsApiResult", "Delete category."],
  ["GET", "/backend/v3/api/news/items", "items.management.list", "items", "ItemsManagementListResponse", "List items for operators."],
  ["POST", "/backend/v3/api/news/items", "items.create", "items", "NewsItem", "Create item.", "NewsItemCommand", true],
  ["PATCH", "/backend/v3/api/news/items/{itemId}", "items.update", "items", "NewsItem", "Update item.", "NewsItemCommand"],
  ["DELETE", "/backend/v3/api/news/items/{itemId}", "items.delete", "items", "NewsApiResult", "Delete item."],
  ["POST", "/backend/v3/api/news/items/{itemId}/publish", "items.publish", "items", "NewsItem", "Publish item.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/items/{itemId}/schedule", "items.schedule", "items", "NewsItem", "Schedule item.", "NewsScheduleCommand", true],
  ["POST", "/backend/v3/api/news/items/{itemId}/archive", "items.archive", "items", "NewsItem", "Archive item.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/items/{itemId}/feature", "items.feature", "items", "NewsItem", "Feature item.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/items/{itemId}/editorial_readiness", "items.editorialReadiness.retrieve", "items.editorialReadiness", "NewsEditorialReadiness", "Retrieve editorial readiness."],
  ["GET", "/backend/v3/api/news/sources", "sources.management.list", "sources", "SourcesManagementListResponse", "List sources."],
  ["POST", "/backend/v3/api/news/sources", "sources.create", "sources", "NewsSource", "Create source.", "NewsSourceCommand", true],
  ["PATCH", "/backend/v3/api/news/sources/{sourceId}", "sources.update", "sources", "NewsSource", "Update source.", "NewsSourceCommand"],
  ["DELETE", "/backend/v3/api/news/sources/{sourceId}", "sources.delete", "sources", "NewsApiResult", "Delete source."],
  ["GET", "/backend/v3/api/news/authors", "authors.management.list", "authors", "AuthorsManagementListResponse", "List authors."],
  ["POST", "/backend/v3/api/news/authors", "authors.create", "authors", "NewsAuthor", "Create author.", "NewsAuthorCommand", true],
  ["PATCH", "/backend/v3/api/news/authors/{authorId}", "authors.update", "authors", "NewsAuthor", "Update author.", "NewsAuthorCommand"],
  ["DELETE", "/backend/v3/api/news/authors/{authorId}", "authors.delete", "authors", "NewsApiResult", "Delete author."],
  ["GET", "/backend/v3/api/news/channels", "channels.management.list", "channels", "ChannelsManagementListResponse", "List channels."],
  ["POST", "/backend/v3/api/news/channels", "channels.create", "channels", "NewsChannel", "Create channel.", "NewsChannelCommand", true],
  ["PATCH", "/backend/v3/api/news/channels/{channelId}", "channels.update", "channels", "NewsChannel", "Update channel.", "NewsChannelCommand"],
  ["DELETE", "/backend/v3/api/news/channels/{channelId}", "channels.delete", "channels", "NewsApiResult", "Delete channel."],
  ["GET", "/backend/v3/api/news/topics", "topics.management.list", "topics", "TopicsManagementListResponse", "List topics."],
  ["POST", "/backend/v3/api/news/topics", "topics.create", "topics", "NewsTopic", "Create topic.", "NewsTopicCommand", true],
  ["PATCH", "/backend/v3/api/news/topics/{topicId}", "topics.update", "topics", "NewsTopic", "Update topic.", "NewsTopicCommand"],
  ["DELETE", "/backend/v3/api/news/topics/{topicId}", "topics.delete", "topics", "NewsApiResult", "Delete topic."],
  ["GET", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.list", "items.versions", "ItemsVersionsListResponse", "List item versions."],
  ["POST", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.create", "items.versions", "NewsItem", "Create item version.", "NewsItemCommand", true],
  ["GET", "/backend/v3/api/news/items/{itemId}/media", "items.media.list", "items.media", "ItemsMediaListResponse", "List item media."],
  ["POST", "/backend/v3/api/news/items/{itemId}/media", "items.media.attach", "items.media", "MediaResource", "Attach item media.", "NewsItemMediaCommand", true],
  ["DELETE", "/backend/v3/api/news/items/{itemId}/media/{mediaId}", "items.media.delete", "items.media", "NewsApiResult", "Delete item media."],
  ["GET", "/backend/v3/api/news/moderation/cases", "moderation.cases.list", "moderation.cases", "ModerationCasesListResponse", "List moderation cases."],
  ["GET", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.retrieve", "moderation.cases", "NewsModerationCase", "Retrieve moderation case."],
  ["PATCH", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.update", "moderation.cases", "NewsModerationCase", "Update moderation case.", "NewsModerationCaseCommand"],
  ["GET", "/backend/v3/api/news/comments/moderation", "comments.moderation.list", "comments.moderation", "CommentsModerationListResponse", "List comment moderation queue."],
  ["PATCH", "/backend/v3/api/news/comments/{commentId}/moderation", "comments.moderation.update", "comments.moderation", "NewsComment", "Update comment moderation.", "NewsCommentCommand"],
  ["GET", "/backend/v3/api/news/reports", "reports.management.list", "reports", "NewsReportListResponse", "List reports."],
  ["PATCH", "/backend/v3/api/news/reports/{reportId}", "reports.update", "reports", "NewsReport", "Update report.", "NewsReportCommand"],
  ["GET", "/backend/v3/api/news/trending/metrics", "trending.metrics.list", "trending.metrics", "TrendingMetricsListResponse", "List trending metrics."],
  ["PUT", "/backend/v3/api/news/trending/metrics", "trending.metrics.upsert", "trending.metrics", "NewsTrendingMetric", "Upsert trending metric.", "NewsTrendingMetricCommand", true],
  ["GET", "/backend/v3/api/news/items/metrics", "items.metrics.list", "items.metrics", "ItemsMetricsListResponse", "List item metrics."],
  ["GET", "/backend/v3/api/news/items/{itemId}/metrics", "items.metrics.retrieve", "items.metrics", "NewsItemMetricSnapshot", "Retrieve item metrics."],
  ["POST", "/backend/v3/api/news/items/metrics/rebuild", "items.metrics.rebuild", "items.metrics", "NewsApiResult", "Rebuild item metrics.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/feed/candidates", "feed.candidates.list", "feed.candidates", "NewsFeedCandidateListResponse", "List feed candidates."],
  ["PUT", "/backend/v3/api/news/feed/candidates", "feed.candidates.upsert", "feed.candidates", "NewsFeedCandidate", "Upsert feed candidate.", "NewsFeedCandidateCommand", true],
  ["DELETE", "/backend/v3/api/news/feed/candidates/{candidateId}", "feed.candidates.delete", "feed.candidates", "NewsApiResult", "Delete feed candidate."],
  ["GET", "/backend/v3/api/news/interests", "interests.management.list", "interests", "NewsUserInterestSignalListResponse", "List interest signals."],
  ["POST", "/backend/v3/api/news/interests/rebuild", "interests.rebuild", "interests", "NewsApiResult", "Rebuild interests.", "NewsGenericCommand", true],
  ["DELETE", "/backend/v3/api/news/interests/{interestId}", "interests.delete", "interests", "NewsApiResult", "Delete interest."],
  ["GET", "/backend/v3/api/news/search/suggestions", "search.suggestions.management.list", "search.suggestions", "NewsSearchSuggestionListResponse", "List search suggestions."],
  ["PUT", "/backend/v3/api/news/search/suggestions", "search.suggestions.upsert", "search.suggestions", "NewsSearchSuggestion", "Upsert search suggestion.", "NewsSearchSuggestionCommand", true],
  ["DELETE", "/backend/v3/api/news/search/suggestions/{suggestionId}", "search.suggestions.delete", "search.suggestions", "NewsApiResult", "Delete search suggestion."],
  ["GET", "/backend/v3/api/news/search/events", "search.events.list", "search.events", "SearchEventsListResponse", "List search events."],
  ["POST", "/backend/v3/api/news/search/projections/rebuild", "search.projections.rebuild", "search.projections", "NewsApiResult", "Rebuild search projections.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/experiments", "experiments.management.list", "experiments", "ExperimentsManagementListResponse", "List experiments."],
  ["POST", "/backend/v3/api/news/experiments", "experiments.create", "experiments", "NewsExperiment", "Create experiment.", "NewsExperimentCommand", true],
  ["PATCH", "/backend/v3/api/news/experiments/{experimentId}", "experiments.update", "experiments", "NewsExperiment", "Update experiment.", "NewsExperimentCommand"],
  ["POST", "/backend/v3/api/news/experiments/{experimentId}/archive", "experiments.archive", "experiments", "NewsApiResult", "Archive experiment.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/notification/subscriptions", "notification.subscriptions.management.list", "notification.subscriptions", "NewsNotificationSubscriptionListResponse", "List notification subscriptions."],
  ["DELETE", "/backend/v3/api/news/notification/subscriptions/{subscriptionId}", "notification.subscriptions.delete", "notification.subscriptions", "NewsApiResult", "Delete notification subscription."],
  ["GET", "/backend/v3/api/news/alerts/breaking", "alerts.breaking.management.list", "alerts.breaking", "NewsBreakingAlertListResponse", "List breaking alerts."],
  ["POST", "/backend/v3/api/news/alerts/breaking", "alerts.breaking.create", "alerts.breaking", "NewsBreakingAlert", "Create breaking alert.", "NewsBreakingAlertCommand", true],
  ["PATCH", "/backend/v3/api/news/alerts/breaking/{alertId}", "alerts.breaking.update", "alerts.breaking", "NewsBreakingAlert", "Update breaking alert.", "NewsBreakingAlertCommand"],
  ["POST", "/backend/v3/api/news/alerts/breaking/{alertId}/publish", "alerts.breaking.publish", "alerts.breaking", "NewsBreakingAlert", "Publish breaking alert.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/alerts/breaking/{alertId}/cancel", "alerts.breaking.cancel", "alerts.breaking", "NewsBreakingAlert", "Cancel breaking alert.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/digests", "digests.management.list", "digests", "NewsDigestIssueListResponse", "List digest issues."],
  ["POST", "/backend/v3/api/news/digests", "digests.create", "digests", "NewsDigestIssue", "Create digest issue.", "NewsDigestIssueCommand", true],
  ["POST", "/backend/v3/api/news/digests/{digestId}/publish", "digests.publish", "digests", "NewsDigestIssue", "Publish digest issue.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/digests/{digestId}/items", "digests.items.attach", "digests.items", "NewsApiResult", "Attach digest item.", "NewsDigestItemCommand", true],
  ["GET", "/backend/v3/api/news/trust/sources", "trust.sources.management.list", "trust.sources", "NewsSourceTrustProfileListResponse", "List source trust profiles."],
  ["PUT", "/backend/v3/api/news/trust/sources", "trust.sources.upsert", "trust.sources", "NewsSourceTrustProfile", "Upsert source trust profile.", "NewsSourceTrustProfileCommand", true],
  ["GET", "/backend/v3/api/news/trust/items/{itemId}", "trust.items.retrieve", "trust.items", "NewsItemTrustSnapshot", "Retrieve item trust snapshot."],
  ["PUT", "/backend/v3/api/news/trust/items/{itemId}", "trust.items.upsert", "trust.items", "NewsItemTrustSnapshot", "Upsert item trust snapshot.", "NewsItemTrustSnapshotCommand", true],
  ["GET", "/backend/v3/api/news/fact_checks", "factChecks.management.list", "factChecks", "NewsFactCheckListResponse", "List fact checks."],
  ["POST", "/backend/v3/api/news/fact_checks", "factChecks.create", "factChecks", "NewsFactCheck", "Create fact check.", "NewsFactCheckCommand", true],
  ["POST", "/backend/v3/api/news/fact_checks/{factCheckId}/publish", "factChecks.publish", "factChecks", "NewsFactCheck", "Publish fact check.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/fact_checks/{factCheckId}/archive", "factChecks.archive", "factChecks", "NewsFactCheck", "Archive fact check.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/corrections", "corrections.management.list", "corrections", "NewsCorrectionNoticeListResponse", "List corrections."],
  ["POST", "/backend/v3/api/news/corrections", "corrections.create", "corrections", "NewsCorrectionNotice", "Create correction.", "NewsCorrectionNoticeCommand", true],
  ["POST", "/backend/v3/api/news/corrections/{correctionId}/publish", "corrections.publish", "corrections", "NewsCorrectionNotice", "Publish correction.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/corrections/{correctionId}/archive", "corrections.archive", "corrections", "NewsCorrectionNotice", "Archive correction.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/live/events", "live.events.management.list", "live.events", "NewsLiveEventListResponse", "List live events."],
  ["POST", "/backend/v3/api/news/live/events", "live.events.create", "live.events", "NewsLiveEvent", "Create live event.", "NewsLiveEventCommand", true],
  ["PATCH", "/backend/v3/api/news/live/events/{eventId}", "live.events.update", "live.events", "NewsLiveEvent", "Update live event.", "NewsLiveEventCommand"],
  ["POST", "/backend/v3/api/news/live/events/{eventId}/publish", "live.events.publish", "live.events", "NewsLiveEvent", "Publish live event.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/live/events/{eventId}/close", "live.events.close", "live.events", "NewsLiveEvent", "Close live event.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/live/events/{eventId}/updates", "live.updates.create", "live.updates", "NewsLiveUpdate", "Create live update.", "NewsLiveUpdateCommand", true],
  ["PATCH", "/backend/v3/api/news/live/events/{eventId}/updates/{updateId}", "live.updates.update", "live.updates", "NewsLiveUpdate", "Update live update.", "NewsLiveUpdateCommand"],
  ["POST", "/backend/v3/api/news/live/events/{eventId}/updates/{updateId}/publish", "live.updates.publish", "live.updates", "NewsLiveUpdate", "Publish live update.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/live/events/{eventId}/items", "live.items.attach", "live.items", "NewsApiResult", "Attach live item.", "NewsLiveEventItemCommand", true],
  ["GET", "/backend/v3/api/news/stories", "stories.management.list", "stories", "NewsStoryPage", "List story packages."],
  ["POST", "/backend/v3/api/news/stories", "stories.create", "stories", "NewsStory", "Create story package.", "NewsStoryCommand", true],
  ["GET", "/backend/v3/api/news/stories/{storyId}", "stories.retrieve", "stories", "NewsStory", "Retrieve story package."],
  ["PATCH", "/backend/v3/api/news/stories/{storyId}", "stories.update", "stories", "NewsStory", "Update story package.", "NewsStoryCommand"],
  ["DELETE", "/backend/v3/api/news/stories/{storyId}", "stories.delete", "stories", "NewsApiResult", "Delete story package."],
  ["POST", "/backend/v3/api/news/stories/{storyId}/publish", "stories.publish", "stories", "NewsStory", "Publish story package.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/stories/{storyId}/archive", "stories.archive", "stories", "NewsStory", "Archive story package.", "NewsGenericCommand", true],
  ["POST", "/backend/v3/api/news/stories/{storyId}/items", "stories.items.attach", "stories.items", "NewsApiResult", "Attach story item.", "NewsStoryItemCommand", true],
  ["DELETE", "/backend/v3/api/news/stories/{storyId}/items/{itemId}", "stories.items.delete", "stories.items", "NewsApiResult", "Delete story item."],
  ["POST", "/backend/v3/api/news/stories/{storyId}/timeline", "stories.timeline.create", "stories.timeline", "NewsStoryTimeline", "Create story timeline entry.", "NewsStoryTimelineCommand", true],
  ["PATCH", "/backend/v3/api/news/stories/{storyId}/timeline/{timelineId}", "stories.timeline.update", "stories.timeline", "NewsStoryTimeline", "Update story timeline entry.", "NewsStoryTimelineCommand"],
  ["GET", "/backend/v3/api/news/editorial/assignments", "editorial.assignments.list", "editorial.assignments", "NewsEditorialAssignmentListResponse", "List editorial assignments."],
  ["POST", "/backend/v3/api/news/editorial/assignments", "editorial.assignments.create", "editorial.assignments", "NewsEditorialAssignment", "Create editorial assignment.", "NewsEditorialAssignmentCommand", true],
  ["PATCH", "/backend/v3/api/news/editorial/assignments/{assignmentId}", "editorial.assignments.update", "editorial.assignments", "NewsEditorialAssignment", "Update editorial assignment.", "NewsEditorialAssignmentCommand"],
  ["GET", "/backend/v3/api/news/editorial/review_tasks", "editorial.reviewTasks.list", "editorial.reviewTasks", "NewsReviewTaskListResponse", "List review tasks."],
  ["PATCH", "/backend/v3/api/news/editorial/review_tasks/{reviewTaskId}", "editorial.reviewTasks.update", "editorial.reviewTasks", "NewsReviewTask", "Update review task.", "NewsReviewTaskCommand"],
  ["POST", "/backend/v3/api/news/imports/ninjs", "imports.ninjs.create", "imports.ninjs", "NewsImportJob", "Import ninjs payload.", "NewsImportCommand", true],
  ["POST", "/backend/v3/api/news/imports/newsml_g2", "imports.newsmlG2.create", "imports.newsmlG2", "NewsImportJob", "Import NewsML-G2 payload.", "NewsImportCommand", true],
  ["GET", "/backend/v3/api/news/imports/{importJobId}", "imports.retrieve", "imports", "NewsImportJob", "Retrieve import job."],
  ["POST", "/backend/v3/api/news/exports/ninjs", "exports.ninjs.create", "exports.ninjs", "NewsExportJob", "Export ninjs payload.", "NewsExportCommand", true],
  ["POST", "/backend/v3/api/news/exports/schema_org", "exports.schemaOrg.create", "exports.schemaOrg", "NewsExportJob", "Export schema.org payload.", "NewsExportCommand", true],
  ["PUT", "/backend/v3/api/news/items/{itemId}/c2pa_provenance", "items.c2paProvenance.upsert", "items.c2paProvenance", "NewsC2paProvenance", "Upsert C2PA provenance.", "NewsC2paProvenanceCommand", true],
  ["PUT", "/backend/v3/api/news/items/{itemId}/rights", "items.rights.upsert", "items.rights", "NewsItemRights", "Upsert rights metadata.", "NewsItemRightsCommand", true],
  ["POST", "/backend/v3/api/news/items/{itemId}/body_blocks", "items.bodyBlocks.create", "items.bodyBlocks", "NewsBodyBlock", "Create structured body block.", "NewsBodyBlockCommand", true],
  ["PATCH", "/backend/v3/api/news/items/{itemId}/body_blocks/{blockId}", "items.bodyBlocks.update", "items.bodyBlocks", "NewsBodyBlock", "Update structured body block.", "NewsBodyBlockCommand"],
  ["POST", "/backend/v3/api/news/items/{itemId}/schema_org/rebuild", "items.schemaOrg.rebuild", "items.schemaOrg", "NewsSchemaOrgProjection", "Rebuild schema.org projection.", "NewsGenericCommand", true],
  ["GET", "/backend/v3/api/news/api_operation_audits", "apiOperationAudits.list", "apiOperationAudits", "NewsApiOperationAuditPage", "List API operation audits."],
];

function permissionFor(resource: string, method: NewsApiHttpMethod, operationId: string): string {
  if (operationId === "stories.create") {
    return "content.news.stories.write";
  }
  const action = method === "GET" ? "read" : "write";
  return `content.news.${resource.replaceAll(".", "_")}.${action}`;
}

function auditEventFor(resource: string, operationId: string): string {
  if (operationId === "stories.create") {
    return "content.news.story.created";
  }
  return `content.news.${resource.replaceAll(".", "_")}.${operationId.split(".").at(-1) ?? "called"}`;
}

function operation(surface: NewsApiSurface, seed: OperationSeed): NewsApiOperationDefinition {
  const [method, path, operationId, resource, responseSchema, summary, requestSchema, idempotent = false] = seed;
  const isOpen = surface === "open-api";
  return {
    authMode: isOpen ? "anonymous" : "dual-token",
    dataScope: isOpen ? undefined : "organization",
    idempotent,
    method,
    operationId,
    path,
    permission: isOpen ? undefined : permissionFor(resource, method, operationId),
    public: isOpen,
    requestSchema,
    resource,
    responseSchema,
    summary,
    surface,
    tenantScope: isOpen ? undefined : "tenant",
    auditEvent: isOpen ? undefined : auditEventFor(resource, operationId),
    todo: `TODO(news-api): materialize ${operationId} into OpenAPI, route manifests, SDK generation, service validation, and problem-detail tests.`,
  };
}

export const NEWS_PROFESSIONAL_API_OPERATIONS: readonly NewsApiOperationDefinition[] = [
  ...openOperationSeeds.map((seed) => operation("open-api", seed)),
  ...appOperationSeeds.map((seed) => operation("app-api", seed)),
  ...backendOperationSeeds.map((seed) => operation("backend-api", seed)),
];
