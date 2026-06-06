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
