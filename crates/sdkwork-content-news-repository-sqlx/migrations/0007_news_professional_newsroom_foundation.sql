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