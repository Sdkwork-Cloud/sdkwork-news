#[derive(Clone, Debug, Eq, PartialEq)]
pub enum NewsItemStatus {
    Draft,
    Published,
    Scheduled,
    Archived,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum NewsEditorialAction {
    Archive,
    Feature,
    Publish,
    Schedule,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsItem {
    pub id: &'static str,
    pub tenant_id: &'static str,
    pub category_id: &'static str,
    pub slug: &'static str,
    pub title: &'static str,
    pub summary: &'static str,
    pub body: Option<&'static str>,
    pub tags: Vec<&'static str>,
    pub status: NewsItemStatus,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsEditorialReadiness {
    pub ready: bool,
    pub can_archive: bool,
    pub can_feature: bool,
    pub can_publish: bool,
    pub can_schedule: bool,
    pub issues: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsCapabilityManifest {
    pub owner: &'static str,
    pub domain: &'static str,
    pub statuses: Vec<&'static str>,
    pub operations: Vec<&'static str>,
}

pub fn news_capability_manifest() -> NewsCapabilityManifest {
    NewsCapabilityManifest {
        owner: "sdkwork-news",
        domain: "news",
        statuses: vec!["draft", "published", "scheduled", "archived"],
        operations: vec![
            "categories.list",
            "items.list",
            "items.retrieve",
            "items.bySlug.retrieve",
            "overview.retrieve",
            "channels.list",
            "channels.feed.list",
            "topics.list",
            "topics.items.list",
            "feed.personalized.list",
            "items.related.list",
            "trending.list",
            "search.list",
            "search.suggestions.list",
            "events.create",
            "favorites.list",
            "favorites.create",
            "favorites.delete",
            "reactions.upsert",
            "comments.list",
            "comments.create",
            "reports.create",
            "feedback.create",
            "history.list",
            "follows.list",
            "follows.create",
            "follows.delete",
            "interests.list",
            "interests.upsert",
            "notification.subscriptions.list",
            "notification.subscriptions.upsert",
            "notification.subscriptions.delete",
            "alerts.breaking.list",
            "digests.list",
            "trust.item.retrieve",
            "factChecks.list",
            "corrections.list",
            "categories.management.list",
            "categories.create",
            "categories.update",
            "categories.delete",
            "items.management.list",
            "items.create",
            "items.update",
            "items.delete",
            "items.publish",
            "items.schedule",
            "items.archive",
            "items.feature",
            "items.editorialReadiness.retrieve",
            "sources.management.list",
            "sources.create",
            "sources.update",
            "sources.delete",
            "authors.management.list",
            "authors.create",
            "authors.update",
            "authors.delete",
            "channels.management.list",
            "channels.create",
            "channels.update",
            "channels.delete",
            "topics.management.list",
            "topics.create",
            "topics.update",
            "topics.delete",
            "items.versions.list",
            "items.versions.create",
            "items.media.list",
            "items.media.attach",
            "items.media.delete",
            "moderation.cases.list",
            "moderation.cases.retrieve",
            "moderation.cases.update",
            "comments.moderation.list",
            "comments.moderation.update",
            "reports.management.list",
            "reports.update",
            "trending.metrics.list",
            "trending.metrics.upsert",
            "items.metrics.list",
            "items.metrics.retrieve",
            "items.metrics.rebuild",
            "feed.candidates.list",
            "feed.candidates.upsert",
            "feed.candidates.delete",
            "interests.management.list",
            "interests.rebuild",
            "interests.delete",
            "search.suggestions.management.list",
            "search.suggestions.upsert",
            "search.suggestions.delete",
            "search.events.list",
            "search.projections.rebuild",
            "experiments.management.list",
            "experiments.create",
            "experiments.update",
            "experiments.archive",
            "notification.subscriptions.management.list",
            "notification.subscriptions.delete",
            "alerts.breaking.management.list",
            "alerts.breaking.create",
            "alerts.breaking.update",
            "alerts.breaking.publish",
            "alerts.breaking.cancel",
            "digests.management.list",
            "digests.create",
            "digests.publish",
            "digests.items.attach",
            "trust.sources.management.list",
            "trust.sources.upsert",
            "trust.items.retrieve",
            "trust.items.upsert",
            "factChecks.management.list",
            "factChecks.create",
            "factChecks.publish",
            "factChecks.archive",
            "corrections.management.list",
            "corrections.create",
            "corrections.publish",
            "corrections.archive",
        ],
    }
}

pub fn evaluate_editorial_readiness(
    item: &NewsItem,
    action: NewsEditorialAction,
) -> NewsEditorialReadiness {
    let mut issues = Vec::new();
    if item.title.trim().is_empty() {
        issues.push("missing-title");
    }
    if item.summary.trim().is_empty() {
        issues.push("missing-summary");
    }
    if item.body.map(str::trim).unwrap_or_default().is_empty() {
        issues.push("missing-body");
    }
    if item.tags.iter().filter(|tag| !tag.trim().is_empty()).count() == 0 {
        issues.push("missing-tags");
    }
    if matches!(action, NewsEditorialAction::Archive)
        && !matches!(item.status, NewsItemStatus::Published)
    {
        issues.push("unpublished");
    }

    let content_ready = !issues.iter().any(|issue| issue.starts_with("missing-"));
    let can_archive = matches!(item.status, NewsItemStatus::Published);
    let can_feature = can_archive;
    let can_publish = content_ready;
    let can_schedule = content_ready;

    NewsEditorialReadiness {
        ready: issues.is_empty(),
        can_archive,
        can_feature,
        can_publish,
        can_schedule,
        issues,
    }
}
