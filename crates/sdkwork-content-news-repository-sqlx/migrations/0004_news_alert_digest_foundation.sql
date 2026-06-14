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
