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

