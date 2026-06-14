#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsRepositoryBinding {
    pub domain: &'static str,
    pub repository_name: &'static str,
    pub tables: Vec<&'static str>,
    pub requires_transaction: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStorageMigration {
    pub sequence: u32,
    pub name: &'static str,
    pub domain: &'static str,
    pub source_path: &'static str,
    pub sql: &'static str,
    pub checksum: String,
    pub required_tables: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStorageCapabilityManifest {
    pub name: &'static str,
    pub schema_version: &'static str,
    pub tables: Vec<&'static str>,
    pub indexes: Vec<&'static str>,
    pub migrations: Vec<&'static str>,
    pub migration_plan: Vec<NewsStorageMigration>,
    pub repository_bindings: Vec<NewsRepositoryBinding>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsCategory {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: i64,
    pub enabled: bool,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItem {
    pub id: String,
    pub tenant_id: String,
    pub category_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub body_markdown: String,
    pub author_name: Option<String>,
    pub priority: i64,
    pub estimated_read_minutes: i64,
    pub tags: Vec<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsChannel {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub slug: String,
    pub title: String,
    pub channel_type: String,
    pub priority: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsChannelItem {
    pub id: String,
    pub tenant_id: String,
    pub channel_id: String,
    pub item_id: String,
    pub rank: i64,
    pub reason: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsRecommendationEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub item_id: String,
    pub channel_id: Option<String>,
    pub event_type: String,
    pub dwell_ms: Option<i64>,
    pub trace_id: Option<String>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsUserFeedback {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub target_type: String,
    pub target_id: String,
    pub feedback_type: String,
    pub reason: Option<String>,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsFavorite {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsReaction {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub reaction_type: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsTrendingMetric {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub metric_window: String,
    pub score: i64,
    pub rank: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsUserInterestSignal {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub target_type: String,
    pub target_id: String,
    pub affinity_score: i64,
    pub confidence: i64,
    pub source: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredUserInterestSignal {
    pub target_type: String,
    pub target_id: String,
    pub affinity_score: i64,
    pub confidence: i64,
    pub source: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsFeedCandidate {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub stream_key: String,
    pub item_id: String,
    pub score: i64,
    pub reason_code: String,
    pub trace_id: Option<String>,
    pub generated_at: String,
    pub expires_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredFeedCandidate {
    pub item_id: String,
    pub score: i64,
    pub reason_code: String,
    pub trace_id: Option<String>,
    pub generated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItemMetricSnapshot {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub impression_count: i64,
    pub click_count: i64,
    pub share_count: i64,
    pub comment_count: i64,
    pub favorite_count: i64,
    pub reaction_count: i64,
    pub report_count: i64,
    pub hot_score: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredItemMetricSnapshot {
    pub item_id: String,
    pub impression_count: i64,
    pub click_count: i64,
    pub share_count: i64,
    pub comment_count: i64,
    pub favorite_count: i64,
    pub reaction_count: i64,
    pub report_count: i64,
    pub hot_score: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSearchSuggestion {
    pub id: String,
    pub tenant_id: String,
    pub normalized_query: String,
    pub display_query: String,
    pub suggestion_type: String,
    pub rank: i64,
    pub score: i64,
    pub locale: Option<String>,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredSearchSuggestion {
    pub normalized_query: String,
    pub display_query: String,
    pub suggestion_type: String,
    pub rank: i64,
    pub score: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSearchEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub normalized_query: String,
    pub display_query: String,
    pub result_count: i64,
    pub clicked_item_id: Option<String>,
    pub trace_id: Option<String>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsNotificationSubscription {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub target_type: String,
    pub target_id: String,
    pub channel: String,
    pub frequency: String,
    pub quiet_start: Option<String>,
    pub quiet_end: Option<String>,
    pub locale: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredNotificationSubscription {
    pub id: String,
    pub target_type: String,
    pub target_id: String,
    pub channel: String,
    pub frequency: String,
    pub status: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsBreakingAlert {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub item_id: Option<String>,
    pub title: String,
    pub summary: String,
    pub severity: String,
    pub audience_type: String,
    pub target_type: Option<String>,
    pub target_id: Option<String>,
    pub priority: i64,
    pub scheduled_at: Option<String>,
    pub expires_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredBreakingAlert {
    pub id: String,
    pub item_id: Option<String>,
    pub title: String,
    pub summary: String,
    pub severity: String,
    pub audience_type: String,
    pub priority: i64,
    pub published_at: Option<String>,
    pub expires_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsDigestIssue {
    pub id: String,
    pub tenant_id: String,
    pub digest_key: String,
    pub title: String,
    pub summary: Option<String>,
    pub digest_type: String,
    pub audience_type: String,
    pub locale: Option<String>,
    pub published_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredDigestIssue {
    pub id: String,
    pub digest_key: String,
    pub title: String,
    pub summary: Option<String>,
    pub digest_type: String,
    pub audience_type: String,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsDigestItem {
    pub id: String,
    pub tenant_id: String,
    pub digest_id: String,
    pub item_id: String,
    pub rank: i64,
    pub section: Option<String>,
    pub reason: Option<String>,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredDigestItem {
    pub item_id: String,
    pub rank: i64,
    pub section: Option<String>,
    pub reason: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSourceTrustProfile {
    pub id: String,
    pub tenant_id: String,
    pub source_id: String,
    pub trust_score: i64,
    pub trust_tier: String,
    pub credibility_status: String,
    pub fact_check_rating: Option<String>,
    pub correction_count: i64,
    pub reviewer_user_id: Option<String>,
    pub notes: Option<String>,
    pub reviewed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredSourceTrustProfile {
    pub source_id: String,
    pub trust_score: i64,
    pub trust_tier: String,
    pub credibility_status: String,
    pub fact_check_rating: Option<String>,
    pub correction_count: i64,
    pub reviewed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsFactCheck {
    pub id: String,
    pub tenant_id: String,
    pub item_id: Option<String>,
    pub claim: String,
    pub verdict: String,
    pub summary: String,
    pub evidence_url: Option<String>,
    pub reviewer_user_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredFactCheck {
    pub id: String,
    pub item_id: Option<String>,
    pub claim: String,
    pub verdict: String,
    pub summary: String,
    pub evidence_url: Option<String>,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsCorrectionNotice {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub correction_type: String,
    pub title: String,
    pub body: String,
    pub actor_user_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredCorrectionNotice {
    pub id: String,
    pub item_id: String,
    pub correction_type: String,
    pub title: String,
    pub body: String,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItemTrustSnapshot {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub trust_score: i64,
    pub source_trust_score: Option<i64>,
    pub fact_check_verdict: Option<String>,
    pub correction_count: i64,
    pub risk_level: String,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredItemTrustSnapshot {
    pub item_id: String,
    pub trust_score: i64,
    pub source_trust_score: Option<i64>,
    pub fact_check_verdict: Option<String>,
    pub correction_count: i64,
    pub risk_level: String,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsLiveEvent {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub event_type: String,
    pub priority: i64,
    pub region: Option<String>,
    pub locale: Option<String>,
    pub started_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredLiveEvent {
    pub id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub event_type: String,
    pub priority: i64,
    pub status: String,
    pub region: Option<String>,
    pub locale: Option<String>,
    pub started_at: Option<String>,
    pub published_at: Option<String>,
    pub closed_at: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsLiveUpdate {
    pub id: String,
    pub tenant_id: String,
    pub live_event_id: String,
    pub title: Option<String>,
    pub body: String,
    pub update_type: String,
    pub importance: i64,
    pub source_id: Option<String>,
    pub author_id: Option<String>,
    pub item_id: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredLiveUpdate {
    pub id: String,
    pub live_event_id: String,
    pub title: Option<String>,
    pub body: String,
    pub update_type: String,
    pub importance: i64,
    pub source_id: Option<String>,
    pub author_id: Option<String>,
    pub item_id: Option<String>,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsLiveEventItem {
    pub id: String,
    pub tenant_id: String,
    pub live_event_id: String,
    pub item_id: String,
    pub relation_type: String,
    pub rank: i64,
    pub note: Option<String>,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredLiveEventItem {
    pub item_id: String,
    pub relation_type: String,
    pub rank: i64,
    pub note: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredItem {
    pub id: String,
    pub tenant_id: String,
    pub category_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub body_markdown: String,
    pub status: String,
    pub author_name: Option<String>,
    pub featured: bool,
    pub priority: i64,
    pub estimated_read_minutes: i64,
    pub tags: Vec<String>,
    pub published_at: Option<String>,
    pub scheduled_for: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredTrendingMetric {
    pub item_id: String,
    pub metric_window: String,
    pub score: i64,
    pub rank: i64,
    pub computed_at: String,
}
