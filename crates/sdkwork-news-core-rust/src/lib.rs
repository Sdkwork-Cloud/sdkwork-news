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

