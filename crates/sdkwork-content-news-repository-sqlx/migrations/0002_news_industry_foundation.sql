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
