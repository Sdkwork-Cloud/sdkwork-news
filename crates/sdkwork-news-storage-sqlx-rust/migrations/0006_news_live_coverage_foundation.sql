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
