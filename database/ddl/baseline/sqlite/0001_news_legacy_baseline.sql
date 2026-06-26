-- legacy: 0001_news_foundation.sql
CREATE TABLE news_category (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES news_category(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  author_user_id TEXT,
  author_name TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  priority INTEGER NOT NULL DEFAULT 100,
  estimated_read_minutes INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  scheduled_for TEXT,
  archived_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_item_body (
  item_id TEXT PRIMARY KEY REFERENCES news_item(id) ON DELETE CASCADE,
  body_markdown TEXT NOT NULL,
  body_format TEXT NOT NULL DEFAULT 'markdown',
  content_checksum TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE news_tag (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_item_tag (
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES news_tag(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

CREATE TABLE news_publication_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_user_id TEXT,
  scheduled_for TEXT,
  occurred_at TEXT NOT NULL
);

CREATE TABLE news_read_state (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  read_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, user_id)
);

CREATE TABLE news_editorial_audit (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT,
  action TEXT NOT NULL,
  actor_user_id TEXT,
  before_json TEXT,
  after_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE news_schema_version (
  sequence INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  checksum TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE news_migration_lock (
  lock_name TEXT PRIMARY KEY,
  lock_owner TEXT NOT NULL,
  locked_until TEXT NOT NULL,
  heartbeat_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_news_category_tenant_priority ON news_category (tenant_id, enabled, priority);
CREATE INDEX idx_news_item_tenant_status_published_at ON news_item (tenant_id, status, published_at DESC);
CREATE INDEX idx_news_item_tenant_slug ON news_item (tenant_id, slug);
CREATE INDEX idx_news_item_tenant_category_status ON news_item (tenant_id, category_id, status);
CREATE INDEX idx_news_item_tenant_featured_priority ON news_item (tenant_id, featured, priority);
CREATE INDEX idx_news_tag_tenant_slug ON news_tag (tenant_id, slug);
CREATE INDEX idx_news_item_tag_tag ON news_item_tag (tag_id, item_id);
CREATE INDEX idx_news_publication_event_item ON news_publication_event (tenant_id, item_id, occurred_at DESC);
CREATE INDEX idx_news_read_state_user_item ON news_read_state (tenant_id, user_id, item_id);
CREATE INDEX idx_news_editorial_audit_item ON news_editorial_audit (tenant_id, item_id, created_at DESC);



-- legacy: 0002_news_industry_foundation.sql
CREATE TABLE news_source (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'publisher',
  trust_tier TEXT NOT NULL DEFAULT 'standard',
  locale TEXT,
  region TEXT,
  homepage_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_author (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  source_id TEXT,
  user_id TEXT,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_item_version (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  version_no INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  content_checksum TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft',
  actor_user_id TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, version_no)
);

CREATE TABLE news_media_asset (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  media_kind TEXT NOT NULL,
  media_source TEXT NOT NULL,
  uri TEXT,
  url TEXT,
  public_url TEXT,
  mime_type TEXT,
  size_bytes TEXT,
  width INTEGER,
  height INTEGER,
  duration_seconds REAL,
  alt_text TEXT,
  title TEXT,
  metadata_json TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT
);

CREATE TABLE news_item_media (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES news_media_asset(id) ON DELETE CASCADE,
  media_role TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, media_id, media_role)
);

CREATE TABLE news_topic (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  priority INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_item_topic (
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES news_topic(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (item_id, topic_id)
);

CREATE TABLE news_channel (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  channel_type TEXT NOT NULL DEFAULT 'editorial',
  status TEXT NOT NULL DEFAULT 'active',
  priority INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_channel_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  channel_id TEXT NOT NULL REFERENCES news_channel(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL DEFAULT 100,
  reason TEXT,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, channel_id, item_id)
);

CREATE TABLE news_feed_stream (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  stream_key TEXT NOT NULL,
  stream_type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, stream_key)
);

CREATE TABLE news_feed_cursor (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  stream_key TEXT NOT NULL,
  cursor_value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, user_id, stream_key)
);

CREATE TABLE news_recommendation_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  item_id TEXT NOT NULL,
  channel_id TEXT,
  event_type TEXT NOT NULL,
  dwell_ms INTEGER,
  trace_id TEXT,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT,
  payload_hash TEXT,
  UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE news_user_feedback (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  feedback_type TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE news_trending_metric (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  metric_window TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  computed_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, metric_window)
);

CREATE TABLE news_search_projection (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  locale TEXT,
  title_text TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  tag_text TEXT,
  topic_text TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  source_version INTEGER NOT NULL DEFAULT 0,
  rebuilt_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, locale)
);

CREATE TABLE news_experiment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  experiment_key TEXT NOT NULL,
  title TEXT NOT NULL,
  surface TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  allocation INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  archived_at TEXT,
  UNIQUE (tenant_id, experiment_key)
);

CREATE TABLE news_experiment_assignment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  experiment_id TEXT NOT NULL REFERENCES news_experiment(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  assigned_at TEXT NOT NULL,
  UNIQUE (tenant_id, experiment_id, user_id)
);

CREATE TABLE news_comment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  parent_id TEXT,
  user_id TEXT NOT NULL,
  body TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'active',
  like_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT
);

CREATE TABLE news_comment_moderation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  comment_id TEXT NOT NULL REFERENCES news_comment(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_user_id TEXT,
  reason TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE news_reaction (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, user_id, item_id)
);

CREATE TABLE news_favorite (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES news_item(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  deleted_at TEXT,
  UNIQUE (tenant_id, user_id, item_id)
);

CREATE TABLE news_share_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  item_id TEXT NOT NULL,
  channel TEXT,
  trace_id TEXT,
  occurred_at TEXT NOT NULL
);

CREATE TABLE news_follow (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  deleted_at TEXT,
  UNIQUE (tenant_id, user_id, target_type, target_id)
);

CREATE TABLE news_report (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE news_moderation_case (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'open',
  assignee_user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT,
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE news_content_risk_signal (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  severity INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE news_takedown_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor_user_id TEXT,
  occurred_at TEXT NOT NULL
);

CREATE INDEX idx_news_source_tenant_status ON news_source (tenant_id, status, title);
CREATE INDEX idx_news_author_tenant_source ON news_author (tenant_id, source_id, status);
CREATE INDEX idx_news_item_version_item ON news_item_version (tenant_id, item_id, version_no DESC);
CREATE INDEX idx_news_media_asset_tenant_kind ON news_media_asset (tenant_id, media_kind, status);
CREATE INDEX idx_news_item_media_item_role ON news_item_media (tenant_id, item_id, media_role, sort_order);
CREATE INDEX idx_news_topic_tenant_status_priority ON news_topic (tenant_id, status, priority);
CREATE INDEX idx_news_item_topic_topic ON news_item_topic (tenant_id, topic_id, item_id);
CREATE INDEX idx_news_channel_tenant_status_priority ON news_channel (tenant_id, status, priority);
CREATE INDEX idx_news_channel_item_channel_rank ON news_channel_item (tenant_id, channel_id, status, rank, updated_at DESC);
CREATE INDEX idx_news_feed_stream_tenant_type ON news_feed_stream (tenant_id, stream_type, status);
CREATE INDEX idx_news_feed_cursor_user_stream ON news_feed_cursor (tenant_id, user_id, stream_key);
CREATE INDEX idx_news_recommendation_event_user_time ON news_recommendation_event (tenant_id, user_id, occurred_at DESC);
CREATE INDEX idx_news_recommendation_event_item_type ON news_recommendation_event (tenant_id, item_id, event_type, occurred_at DESC);
CREATE INDEX idx_news_user_feedback_user_target ON news_user_feedback (tenant_id, user_id, target_type, target_id);
CREATE INDEX idx_news_trending_metric_window_rank ON news_trending_metric (tenant_id, metric_window, rank, score DESC);
CREATE INDEX idx_news_search_projection_status ON news_search_projection (tenant_id, status, rebuilt_at DESC);
CREATE INDEX idx_news_experiment_surface_status ON news_experiment (tenant_id, surface, status);
CREATE INDEX idx_news_experiment_assignment_user ON news_experiment_assignment (tenant_id, user_id, experiment_id);
CREATE INDEX idx_news_comment_item_status_time ON news_comment (tenant_id, item_id, moderation_status, created_at DESC);
CREATE INDEX idx_news_comment_parent ON news_comment (tenant_id, parent_id, created_at ASC);
CREATE INDEX idx_news_comment_moderation_comment ON news_comment_moderation (tenant_id, comment_id, created_at DESC);
CREATE INDEX idx_news_reaction_user_item ON news_reaction (tenant_id, user_id, item_id);
CREATE INDEX idx_news_favorite_user_time ON news_favorite (tenant_id, user_id, created_at DESC);
CREATE INDEX idx_news_share_event_item_time ON news_share_event (tenant_id, item_id, occurred_at DESC);
CREATE INDEX idx_news_follow_user_target ON news_follow (tenant_id, user_id, target_type, target_id);
CREATE INDEX idx_news_report_target_status ON news_report (tenant_id, target_type, target_id, status);
CREATE INDEX idx_news_moderation_case_status_priority ON news_moderation_case (tenant_id, status, priority, created_at);
CREATE INDEX idx_news_content_risk_signal_target ON news_content_risk_signal (tenant_id, target_type, target_id, severity);
CREATE INDEX idx_news_takedown_event_item_time ON news_takedown_event (tenant_id, item_id, occurred_at DESC);


-- legacy: 0003_news_personalization_foundation.sql
CREATE TABLE news_user_interest_signal (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  affinity_score INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  UNIQUE (tenant_id, user_id, target_type, target_id)
);

CREATE TABLE news_feed_candidate (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  stream_key TEXT NOT NULL,
  item_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  reason_code TEXT NOT NULL,
  trace_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  generated_at TEXT NOT NULL,
  expires_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, user_id, stream_key, item_id)
);

CREATE TABLE news_item_metric_snapshot (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  impression_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  favorite_count INTEGER NOT NULL DEFAULT 0,
  reaction_count INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  hot_score INTEGER NOT NULL DEFAULT 0,
  computed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id)
);

CREATE TABLE news_search_suggestion (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  display_query TEXT NOT NULL,
  suggestion_type TEXT NOT NULL DEFAULT 'hot',
  rank INTEGER NOT NULL DEFAULT 100,
  score INTEGER NOT NULL DEFAULT 0,
  locale TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  computed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, normalized_query, suggestion_type, locale)
);

CREATE TABLE news_search_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  normalized_query TEXT NOT NULL,
  display_query TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  clicked_item_id TEXT,
  trace_id TEXT,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT,
  payload_hash TEXT
);

CREATE INDEX idx_news_user_interest_signal_user_target ON news_user_interest_signal (tenant_id, user_id, status, affinity_score DESC, updated_at DESC);
CREATE INDEX idx_news_feed_candidate_stream_score ON news_feed_candidate (tenant_id, stream_key, status, score DESC, generated_at DESC);
CREATE INDEX idx_news_feed_candidate_user_stream_score ON news_feed_candidate (tenant_id, user_id, stream_key, status, score DESC);
CREATE INDEX idx_news_item_metric_snapshot_hot ON news_item_metric_snapshot (tenant_id, hot_score DESC, computed_at DESC);
CREATE INDEX idx_news_search_suggestion_query_rank ON news_search_suggestion (tenant_id, status, normalized_query, rank, score DESC);
CREATE INDEX idx_news_search_event_query_time ON news_search_event (tenant_id, normalized_query, occurred_at DESC);
CREATE INDEX idx_news_search_event_user_time ON news_search_event (tenant_id, user_id, occurred_at DESC);


-- legacy: 0004_news_alert_digest_foundation.sql
CREATE TABLE news_notification_subscription (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily',
  status TEXT NOT NULL DEFAULT 'active',
  quiet_start TEXT,
  quiet_end TEXT,
  locale TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  UNIQUE (tenant_id, user_id, target_type, target_id, channel)
);

CREATE TABLE news_breaking_alert (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  item_id TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'breaking',
  audience_type TEXT NOT NULL DEFAULT 'all',
  target_type TEXT,
  target_id TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TEXT,
  published_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  cancelled_at TEXT
);

CREATE TABLE news_digest_issue (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  digest_key TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  digest_type TEXT NOT NULL DEFAULT 'daily',
  audience_type TEXT NOT NULL DEFAULT 'all',
  locale TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  archived_at TEXT,
  UNIQUE (tenant_id, digest_key)
);

CREATE TABLE news_digest_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  digest_id TEXT NOT NULL REFERENCES news_digest_issue(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 100,
  section TEXT,
  reason TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, digest_id, item_id)
);

CREATE INDEX idx_news_notification_subscription_user_target ON news_notification_subscription (tenant_id, user_id, status, target_type, target_id);
CREATE INDEX idx_news_notification_subscription_target ON news_notification_subscription (tenant_id, target_type, target_id, status, frequency);
CREATE INDEX idx_news_breaking_alert_status_time ON news_breaking_alert (tenant_id, status, priority, published_at DESC, scheduled_at DESC);
CREATE INDEX idx_news_breaking_alert_target ON news_breaking_alert (tenant_id, target_type, target_id, status);
CREATE INDEX idx_news_digest_issue_status_time ON news_digest_issue (tenant_id, status, published_at DESC, digest_key DESC);
CREATE INDEX idx_news_digest_item_digest_rank ON news_digest_item (tenant_id, digest_id, rank);


-- legacy: 0005_news_trust_correction_foundation.sql
CREATE TABLE news_source_trust_profile (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  trust_score INTEGER NOT NULL DEFAULT 0,
  trust_tier TEXT NOT NULL DEFAULT 'standard',
  credibility_status TEXT NOT NULL DEFAULT 'unverified',
  fact_check_rating TEXT,
  correction_count INTEGER NOT NULL DEFAULT 0,
  reviewer_user_id TEXT,
  notes TEXT,
  reviewed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, source_id)
);

CREATE TABLE news_fact_check (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT,
  claim TEXT NOT NULL,
  verdict TEXT NOT NULL,
  summary TEXT NOT NULL,
  evidence_url TEXT,
  reviewer_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  archived_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE news_correction_notice (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  correction_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  actor_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  archived_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE news_item_trust_snapshot (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  trust_score INTEGER NOT NULL DEFAULT 0,
  source_trust_score INTEGER,
  fact_check_verdict TEXT,
  correction_count INTEGER NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'unknown',
  computed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, item_id)
);

CREATE INDEX idx_news_source_trust_profile_score ON news_source_trust_profile (tenant_id, credibility_status, trust_score DESC, reviewed_at DESC);
CREATE INDEX idx_news_fact_check_item_status ON news_fact_check (tenant_id, item_id, status, published_at DESC);
CREATE INDEX idx_news_fact_check_verdict_status ON news_fact_check (tenant_id, verdict, status, published_at DESC);
CREATE INDEX idx_news_correction_notice_item_status ON news_correction_notice (tenant_id, item_id, status, published_at DESC);
CREATE INDEX idx_news_item_trust_snapshot_risk ON news_item_trust_snapshot (tenant_id, risk_level, trust_score DESC, computed_at DESC);


-- legacy: 0006_news_live_coverage_foundation.sql
CREATE TABLE news_live_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'developing_story',
  priority INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'draft',
  region TEXT,
  locale TEXT,
  started_at TEXT,
  published_at TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_live_update (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  live_event_id TEXT NOT NULL REFERENCES news_live_event(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'text',
  importance INTEGER NOT NULL DEFAULT 0,
  source_id TEXT,
  author_id TEXT,
  item_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE news_live_event_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  live_event_id TEXT NOT NULL REFERENCES news_live_event(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'related',
  rank INTEGER NOT NULL DEFAULT 100,
  note TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, live_event_id, item_id, relation_type)
);

CREATE INDEX idx_news_live_event_status_priority ON news_live_event (tenant_id, status, priority, published_at DESC, started_at DESC);
CREATE INDEX idx_news_live_event_slug ON news_live_event (tenant_id, slug);
CREATE INDEX idx_news_live_update_event_status_time ON news_live_update (tenant_id, live_event_id, status, published_at DESC, importance DESC);
CREATE INDEX idx_news_live_update_item ON news_live_update (tenant_id, item_id, status, published_at DESC);
CREATE INDEX idx_news_live_event_item_event_rank ON news_live_event_item (tenant_id, live_event_id, rank, item_id);


-- legacy: 0007_news_professional_newsroom_foundation.sql
-- Professional Newsroom Foundation Migration
-- Creates planned tables for story packaging, editorial workflow, trust, imports/exports, and more.

-- Story packaging tables
CREATE TABLE news_story (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  story_type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'draft',
  canonical_item_id TEXT,
  locale TEXT,
  region TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  published_at TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TEXT,
  deleted_by TEXT,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE news_story_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary',
  rank INTEGER NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, story_id, item_id, relation_type)
);

CREATE TABLE news_story_timeline (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  timeline_type TEXT NOT NULL,
  title TEXT,
  body TEXT,
  occurred_at TEXT NOT NULL,
  source_id TEXT,
  item_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Body block tables
CREATE TABLE news_body_block (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  version_id TEXT,
  block_type TEXT NOT NULL,
  block_order INTEGER NOT NULL DEFAULT 0,
  body TEXT,
  data_json TEXT,
  media_id TEXT,
  content_checksum TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Trust and rights tables
CREATE TABLE news_item_rights (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  rights_status TEXT NOT NULL DEFAULT 'draft',
  copyright_holder TEXT,
  license_code TEXT,
  embargo_until TEXT,
  usage_terms TEXT,
  geography_scope TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id)
);

CREATE TABLE news_item_c2pa_provenance (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  manifest_url TEXT,
  manifest_hash TEXT,
  trust_level TEXT NOT NULL DEFAULT 'unverified',
  verified_at TEXT,
  verification_result TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id)
);

-- Editorial workflow tables
CREATE TABLE news_editorial_assignment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  story_id TEXT,
  assignee_user_id TEXT NOT NULL,
  assignment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  due_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE news_editorial_review_task (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  story_id TEXT,
  reviewer_user_id TEXT NOT NULL,
  review_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  decision TEXT,
  comments TEXT,
  decided_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Import/export tables
CREATE TABLE news_import_job (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_format TEXT NOT NULL,
  source_url TEXT,
  source_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  imported_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE news_export_job (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  target_format TEXT NOT NULL,
  target_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  exported_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Schema.org projection tables
CREATE TABLE news_schema_org_projection (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  projection_type TEXT NOT NULL,
  json_ld TEXT NOT NULL,
  content_checksum TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, item_id, projection_type)
);

-- API audit tables
CREATE TABLE news_api_operation_audit (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  surface TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  request_hash TEXT,
  response_status INTEGER,
  actor_user_id TEXT,
  occurred_at TEXT NOT NULL,
  duration_ms INTEGER,
  created_at TEXT NOT NULL
);

-- External feed tables
CREATE TABLE news_external_feed (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  feed_type TEXT NOT NULL,
  poll_interval_seconds INTEGER NOT NULL DEFAULT 3600,
  last_polled_at TEXT,
  last_success_at TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, feed_url)
);

CREATE TABLE news_external_feed_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  feed_id TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT,
  url TEXT,
  published_at TEXT,
  content_hash TEXT NOT NULL,
  imported_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, feed_id, external_id)
);

-- Newsletter tables
CREATE TABLE news_newsletter (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE news_newsletter_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  newsletter_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, newsletter_id, item_id)
);

-- Paywall tables
CREATE TABLE news_paywall_policy (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  policy_name TEXT NOT NULL,
  policy_type TEXT NOT NULL,
  rules_json TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, policy_name)
);

CREATE TABLE news_metered_access_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Syndication tables
CREATE TABLE news_syndication_partner (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  partner_type TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  auth_config_json TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, partner_name)
);

CREATE TABLE news_syndication_delivery (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivered_at TEXT,
  receipt_json TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Translation memory tables
CREATE TABLE news_translation_memory (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_locale TEXT NOT NULL,
  target_locale TEXT NOT NULL,
  source_text TEXT NOT NULL,
  target_text TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, source_locale, target_locale, content_hash)
);

-- Compliance tables
CREATE TABLE news_retention_policy (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  policy_name TEXT NOT NULL,
  retention_days INTEGER NOT NULL,
  applies_to TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, policy_name)
);

CREATE TABLE news_legal_hold (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  hold_reason TEXT NOT NULL,
  applies_to TEXT NOT NULL,
  reference_ids TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- CDN invalidation tables
CREATE TABLE news_cdn_invalidation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  invalidation_pattern TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TEXT NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL
);

-- Homepage layout tables
CREATE TABLE news_homepage_layout (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  layout_name TEXT NOT NULL,
  layout_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, layout_name)
);

-- Add indexes for performance
CREATE INDEX idx_news_story_status_priority ON news_story(tenant_id, status, priority, published_at);
CREATE INDEX idx_news_story_item_story_rank ON news_story_item(tenant_id, story_id, rank);
CREATE INDEX idx_news_story_timeline_story_time ON news_story_timeline(tenant_id, story_id, occurred_at);
CREATE INDEX idx_news_body_block_item_order ON news_body_block(tenant_id, item_id, block_order);
CREATE INDEX idx_news_editorial_assignment_item ON news_editorial_assignment(tenant_id, item_id, status);
CREATE INDEX idx_news_editorial_review_task_item ON news_editorial_review_task(tenant_id, item_id, status);
CREATE INDEX idx_news_import_job_status ON news_import_job(tenant_id, status);
CREATE INDEX idx_news_export_job_status ON news_export_job(tenant_id, status);
CREATE INDEX idx_news_api_operation_audit_operation ON news_api_operation_audit(tenant_id, operation_id, occurred_at);
CREATE INDEX idx_news_external_feed_status ON news_external_feed(tenant_id, status);
CREATE INDEX idx_news_external_feed_item_status ON news_external_feed_item(tenant_id, status);
CREATE INDEX idx_news_newsletter_status ON news_newsletter(tenant_id, status);
CREATE INDEX idx_news_metered_access_event_user ON news_metered_access_event(tenant_id, user_id, occurred_at);
CREATE INDEX idx_news_syndication_delivery_status ON news_syndication_delivery(tenant_id, status);
CREATE INDEX idx_news_cdn_invalidation_status ON news_cdn_invalidation(tenant_id, status);
