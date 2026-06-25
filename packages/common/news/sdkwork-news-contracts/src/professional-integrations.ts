export type NewsIntegrationCapabilityKey =
  | "analytics-warehouse"
  | "appbase-iam"
  | "cdn-cache"
  | "c2pa-provenance"
  | "external-feed"
  | "drive-media"
  | "moderation-ai"
  | "newsletter-delivery"
  | "ninjs"
  | "paywall-entitlement"
  | "newsml-g2"
  | "notification-delivery"
  | "privacy-compliance"
  | "schema-org"
  | "search-index"
  | "syndication-delivery"
  | "translation-localization";

export interface NewsIntegrationCapability {
  readonly key: NewsIntegrationCapabilityKey;
  readonly ownerBoundary: string;
  readonly requiredSdkFamily?: string;
  readonly summary: string;
  readonly todo: string;
}

export interface NewsProfessionalImplementationChecklistItem {
  readonly owner: string;
  readonly target: string;
  readonly todo: string;
}

export interface NewsDriveMediaIntegrationPort {
  // TODO(news-integration): call Drive app/backend SDK or Drive server-side uploader; never persist presigned URLs as news identity.
  attachDriveMedia(command: unknown): Promise<unknown>;
  // TODO(news-integration): resolve fresh Drive download grants through Drive SDK before exposing media delivery hints.
  resolveMediaResource(command: unknown): Promise<unknown>;
}

export interface NewsSearchIndexIntegrationPort {
  // TODO(news-integration): rebuild search projection and schema.org projection from committed news item/story facts.
  rebuildProjection(command: unknown): Promise<unknown>;
  // TODO(news-integration): record index lag, source version, and projection checksum for drift detection.
  publishIndexDocument(command: unknown): Promise<unknown>;
}

export interface NewsNotificationIntegrationPort {
  // TODO(news-integration): deliver breaking alerts and digests through the approved communication/notification SDK.
  deliverBreakingAlert(command: unknown): Promise<unknown>;
  // TODO(news-integration): fan out digest notifications with quiet-hour and subscription policy enforcement.
  deliverDigestIssue(command: unknown): Promise<unknown>;
}

export interface NewsIndustryFormatIntegrationPort {
  // TODO(news-integration): parse ninjs 2.x payloads into source, author, story, item, media, rights, and trust commands.
  importNinjs(command: unknown): Promise<unknown>;
  // TODO(news-integration): parse NewsML-G2 package items into normalized news aggregates and import job records.
  importNewsmlG2(command: unknown): Promise<unknown>;
  // TODO(news-integration): export published item/story projections to ninjs JSON.
  exportNinjs(command: unknown): Promise<unknown>;
  // TODO(news-integration): export JSON-LD for Schema.org NewsArticle, LiveBlogPosting, and ClaimReview.
  exportSchemaOrg(command: unknown): Promise<unknown>;
}

export interface NewsExternalFeedIntegrationPort {
  // TODO(news-integration): poll external feeds and persist normalized source payloads.
  pollExternalFeed(command: unknown): Promise<unknown>;
  // TODO(news-integration): upsert feed items, payload hashes, and last-seen timestamps.
  ingestExternalFeedItem(command: unknown): Promise<unknown>;
}

export interface NewsSyndicationIntegrationPort {
  // TODO(news-integration): deliver story packages to syndication partners with idempotency.
  deliverStoryPackage(command: unknown): Promise<unknown>;
  // TODO(news-integration): capture partner delivery receipts and retry metadata.
  recordDeliveryReceipt(command: unknown): Promise<unknown>;
}

export interface NewsNewsletterIntegrationPort {
  // TODO(news-integration): compose newsletter issues from curated news item/story selections.
  composeNewsletterIssue(command: unknown): Promise<unknown>;
  // TODO(news-integration): deliver newsletter issues via approved communication channels.
  deliverNewsletterIssue(command: unknown): Promise<unknown>;
}

export interface NewsPaywallIntegrationPort {
  // TODO(news-integration): evaluate entitlement and metered-access policy before article access.
  evaluateAccessRule(command: unknown): Promise<unknown>;
  // TODO(news-integration): record access events for paywall analytics and subscription windows.
  recordMeteredAccessEvent(command: unknown): Promise<unknown>;
}

export interface NewsCdnCacheIntegrationPort {
  // TODO(news-integration): invalidate CDN or edge caches after published content changes.
  requestInvalidation(command: unknown): Promise<unknown>;
  // TODO(news-integration): observe invalidation completion and retry transient provider failures.
  confirmInvalidation(command: unknown): Promise<unknown>;
}

export interface NewsTranslationIntegrationPort {
  // TODO(news-integration): request editorial translation jobs for item, story, and live coverage content.
  requestTranslation(command: unknown): Promise<unknown>;
  // TODO(news-integration): update translation memory and localized variants after review.
  upsertTranslationMemory(command: unknown): Promise<unknown>;
}

export interface NewsModerationAiIntegrationPort {
  // TODO(news-integration): classify moderation risk signals from item, comment, and source content.
  classifyRisk(command: unknown): Promise<unknown>;
  // TODO(news-integration): explain the moderation decision with auditable evidence markers.
  explainDecision(command: unknown): Promise<unknown>;
}

export interface NewsComplianceIntegrationPort {
  // TODO(news-integration): apply legal hold and retention policy changes with audit evidence.
  applyLegalHold(command: unknown): Promise<unknown>;
  // TODO(news-integration): evaluate retention policy and soft-delete or archive eligibility.
  evaluateRetentionPolicy(command: unknown): Promise<unknown>;
}

export interface NinjsPayload {
  readonly headlines?: ReadonlyArray<{ readonly value?: string }>;
  readonly body_text?: string;
  readonly byline?: string;
  readonly uri?: string;
  readonly versioncreated?: string;
  readonly language?: string;
  readonly located?: string;
  readonly urgency?: number;
  readonly type?: string;
  readonly content_type?: string;
  readonly copyrightnotice?: string;
  readonly usageterms?: string;
}

export interface NewsmlG2Package {
  readonly itemMeta?: {
    readonly uri?: string;
    readonly version?: string;
    readonly provider?: string;
    readonly pubStatus?: string;
  };
  readonly contentMeta?: {
    readonly headline?: string;
    readonly located?: string;
    readonly language?: string;
    readonly creditline?: string;
  };
  readonly itemSet?: {
    readonly newsItem?: ReadonlyArray<unknown>;
  };
}

export interface NormalizedNewsImport {
  readonly sourceId?: string;
  readonly authorName?: string;
  readonly title: string;
  readonly summary: string;
  readonly body?: string;
  readonly language?: string;
  readonly region?: string;
  readonly priority: number;
  readonly externalId: string;
  readonly provider: string;
  readonly payloadHash: string;
  readonly rightsStatus?: string;
  readonly copyrightHolder?: string;
  readonly usageTerms?: string;
}

export interface NinjsExportItem {
  readonly id: string;
  readonly title: string;
  readonly body_text?: string;
  readonly summary?: string;
  readonly language?: string;
  readonly versioncreated?: string;
  readonly located?: string;
  readonly urgency?: number;
  readonly type?: string;
  readonly content_type?: string;
  readonly copyrightnotice?: string;
  readonly usageterms?: string;
}

export interface SchemaOrgExportItem {
  readonly "@type": string;
  readonly "@id": string;
  readonly headline: string;
  readonly description?: string;
  readonly datePublished?: string;
  readonly author?: { readonly "@type": string; readonly name: string };
  readonly publisher?: { readonly "@type": string; readonly name: string };
  readonly inLanguage?: string;
  readonly isPartOf?: { readonly "@type": string; readonly "@id": string };
}

export function computePayloadHash(payload: string): string {
  let hash = 0xcbf29ce484222325;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 0x100000001b3) >>> 0;
  }
  return `news-import-hash:${hash.toString(16).padStart(16, "0")}`;
}

export function extractPriorityFromUrgency(urgency: number | undefined): number {
  if (urgency === undefined || urgency === null) return 100;
  return Math.max(1, Math.min(100, (6 - urgency) * 20));
}

export class NewsIndustryFormatAdapter implements NewsIndustryFormatIntegrationPort {
  async import_ninjs(command: unknown): Promise<unknown> {
    return this.importNinjs(command);
  }

  async import_newsml_g2(command: unknown): Promise<unknown> {
    return this.importNewsmlG2(command);
  }

  async export_schema_org(command: unknown): Promise<unknown> {
    return this.exportSchemaOrg(command);
  }

  async importNinjs(command: unknown): Promise<NormalizedNewsImport> {
    const payload = command as NinjsPayload;
    const headline = payload.headlines?.[0]?.value ?? payload.body_text?.slice(0, 100) ?? "Untitled";
    const summary = payload.body_text?.slice(0, 300) ?? "";
    const externalId = payload.uri ?? `ninjs-${Date.now()}`;
    const payloadStr = JSON.stringify(payload);
    const payloadHash = computePayloadHash(payloadStr);

    return {
      title: headline,
      summary,
      body: payload.body_text,
      authorName: payload.byline,
      language: payload.language,
      region: payload.located,
      priority: extractPriorityFromUrgency(payload.urgency),
      externalId,
      provider: "ninjs",
      payloadHash,
      rightsStatus: payload.copyrightnotice ? "copyrighted" : undefined,
      copyrightHolder: payload.copyrightnotice,
      usageTerms: payload.usageterms,
    };
  }

  async importNewsmlG2(command: unknown): Promise<NormalizedNewsImport> {
    const pkg = command as NewsmlG2Package;
    const itemMeta = pkg.itemMeta ?? {};
    const contentMeta = pkg.contentMeta ?? {};
    const headline = contentMeta.headline ?? "Untitled";
    const externalId = itemMeta.uri ?? `newsml-${Date.now()}`;
    const payloadStr = JSON.stringify(command);
    const payloadHash = computePayloadHash(payloadStr);

    return {
      title: headline,
      summary: headline,
      language: contentMeta.language,
      region: contentMeta.located,
      priority: 100,
      externalId,
      provider: itemMeta.provider ?? "newsml-g2",
      payloadHash,
      rightsStatus: contentMeta.creditline ? "copyrighted" : undefined,
      copyrightHolder: contentMeta.creditline,
    };
  }

  async exportNinjs(command: unknown): Promise<NinjsExportItem> {
    const item = command as { readonly id: string; readonly title: string; readonly body?: string; readonly summary?: string; readonly publishedAt?: string; readonly locale?: string; readonly region?: string; readonly priority?: number };
    return {
      id: item.id,
      title: item.title,
      body_text: item.body,
      summary: item.summary,
      language: item.locale ?? "en",
      versioncreated: item.publishedAt,
      located: item.region,
      urgency: item.priority ? Math.max(1, Math.min(5, Math.round((100 - item.priority) / 20) + 1)) : 3,
      type: "text",
      content_type: "application/nitf",
    };
  }

  async exportSchemaOrg(command: unknown): Promise<SchemaOrgExportItem> {
    const item = command as { readonly id: string; readonly title: string; readonly summary?: string; readonly publishedAt?: string; readonly authorName?: string; readonly locale?: string; readonly storyId?: string };
    const result: SchemaOrgExportItem = {
      "@type": "NewsArticle",
      "@id": item.id,
      headline: item.title,
    };
    if (item.summary) {
      (result as { description?: string }).description = item.summary;
    }
    if (item.publishedAt) {
      (result as { datePublished?: string }).datePublished = item.publishedAt;
    }
    if (item.authorName) {
      (result as { author?: { readonly "@type": string; readonly name: string } }).author = { "@type": "Person", name: item.authorName };
    }
    if (item.locale) {
      (result as { inLanguage?: string }).inLanguage = item.locale;
    }
    if (item.storyId) {
      (result as { isPartOf?: { readonly "@type": string; readonly "@id": string } }).isPartOf = { "@type": "CreativeWork", "@id": item.storyId };
    }
    return result;
  }
}

export interface DriveMediaAttachCommand {
  readonly tenantId: string;
  readonly itemId: string;
  readonly driveNodeId: string;
  readonly mediaRole?: string;
  readonly sortOrder?: number;
}

export interface DriveMediaResolveCommand {
  readonly tenantId: string;
  readonly mediaId: string;
}

export interface DriveMediaResult {
  readonly id: string;
  readonly driveNodeId: string;
  readonly downloadUrl?: string;
  readonly mimeType?: string;
  readonly expiresAt?: string;
}

export class NewsDriveMediaAdapter implements NewsDriveMediaIntegrationPort {
  async attachDriveMedia(command: unknown): Promise<DriveMediaResult> {
    const cmd = command as DriveMediaAttachCommand;
    if (!cmd.driveNodeId || cmd.driveNodeId.trim().length === 0) {
      throw new Error("driveNodeId is required: must reference a Drive node, never a presigned URL.");
    }
    return {
      id: `media_${cmd.tenantId}_${cmd.itemId}_${cmd.driveNodeId}`,
      driveNodeId: cmd.driveNodeId,
    };
  }

  async resolveMediaResource(command: unknown): Promise<DriveMediaResult> {
    const cmd = command as DriveMediaResolveCommand;
    if (!cmd.mediaId || cmd.mediaId.trim().length === 0) {
      throw new Error("mediaId is required.");
    }
    return {
      id: cmd.mediaId,
      driveNodeId: cmd.mediaId,
      downloadUrl: undefined,
      expiresAt: undefined,
    };
  }
}

export interface SearchProjectionCommand {
  readonly tenantId: string;
  readonly itemId: string;
  readonly sourceVersion: number;
}

export interface SearchIndexDocumentCommand {
  readonly tenantId: string;
  readonly itemId: string;
  readonly title: string;
  readonly summary: string;
  readonly body?: string;
  readonly tags?: readonly string[];
  readonly publishedAt?: string;
  readonly schemaOrgJsonLd?: string;
}

export interface SearchProjectionResult {
  readonly itemId: string;
  readonly searchVersion: number;
  readonly schemaOrgVersion: number;
  readonly checksum: string;
  readonly indexedAt: string;
}

export class NewsSearchIndexAdapter implements NewsSearchIndexIntegrationPort {
  async rebuildProjection(command: unknown): Promise<SearchProjectionResult> {
    const cmd = command as SearchProjectionCommand;
    const now = new Date().toISOString();
    return {
      itemId: cmd.itemId,
      searchVersion: cmd.sourceVersion,
      schemaOrgVersion: cmd.sourceVersion,
      checksum: `search-checksum-${cmd.itemId}-${cmd.sourceVersion}`,
      indexedAt: now,
    };
  }

  async publishIndexDocument(command: unknown): Promise<SearchProjectionResult> {
    const cmd = command as SearchIndexDocumentCommand;
    const now = new Date().toISOString();
    const contentHash = computePayloadHash(JSON.stringify({ title: cmd.title, summary: cmd.summary, body: cmd.body }));
    return {
      itemId: cmd.itemId,
      searchVersion: 1,
      schemaOrgVersion: 1,
      checksum: contentHash,
      indexedAt: now,
    };
  }
}

export interface BreakingAlertCommand {
  readonly tenantId: string;
  readonly alertId: string;
  readonly title: string;
  readonly summary: string;
  readonly severity: string;
  readonly targetUserIds?: readonly string[];
  readonly targetChannels?: readonly string[];
}

export interface DigestIssueCommand {
  readonly tenantId: string;
  readonly digestId: string;
  readonly title: string;
  readonly items: ReadonlyArray<{ readonly itemId: string; readonly rank: number }>;
  readonly scheduledAt?: string;
  readonly quietStart?: string;
  readonly quietEnd?: string;
}

export interface NotificationDeliveryResult {
  readonly deliveryId: string;
  readonly recipientCount: number;
  readonly status: "delivered" | "queued" | "throttled";
}

export class NewsNotificationAdapter implements NewsNotificationIntegrationPort {
  async deliverBreakingAlert(command: unknown): Promise<NotificationDeliveryResult> {
    const cmd = command as BreakingAlertCommand;
    const recipientCount = (cmd.targetUserIds?.length ?? 0) + (cmd.targetChannels?.length ?? 0);
    return {
      deliveryId: `alert-delivery-${cmd.alertId}-${Date.now()}`,
      recipientCount,
      status: recipientCount > 0 ? "queued" : "delivered",
    };
  }

  async deliverDigestIssue(command: unknown): Promise<NotificationDeliveryResult> {
    const cmd = command as DigestIssueCommand;
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const currentMinutes = hour * 60 + minute;

    if (cmd.quietStart && cmd.quietEnd) {
      const [startH = 0, startM = 0] = cmd.quietStart.split(":").map(Number);
      const [endH = 0, endM = 0] = cmd.quietEnd.split(":").map(Number);
      const quietStartMinutes = startH * 60 + startM;
      const quietEndMinutes = endH * 60 + endM;

      const inQuietHours = quietStartMinutes <= quietEndMinutes
        ? currentMinutes >= quietStartMinutes && currentMinutes < quietEndMinutes
        : currentMinutes >= quietStartMinutes || currentMinutes < quietEndMinutes;

      if (inQuietHours) {
        return {
          deliveryId: `digest-delivery-${cmd.digestId}-deferred`,
          recipientCount: 0,
          status: "throttled",
        };
      }
    }

    return {
      deliveryId: `digest-delivery-${cmd.digestId}-${Date.now()}`,
      recipientCount: cmd.items.length,
      status: "queued",
    };
  }
}

export interface ExternalFeedPollCommand {
  readonly tenantId: string;
  readonly feedId: string;
  readonly feedUrl: string;
  readonly lastPolledAt?: string;
  readonly etag?: string;
}

export interface ExternalFeedIngestCommand {
  readonly tenantId: string;
  readonly feedId: string;
  readonly externalId: string;
  readonly title: string;
  readonly content: string;
  readonly publishedAt?: string;
  readonly url?: string;
}

export interface ExternalFeedPollResult {
  readonly feedId: string;
  readonly itemCount: number;
  readonly newItems: number;
  readonly etag?: string;
  readonly polledAt: string;
}

export class NewsExternalFeedAdapter implements NewsExternalFeedIntegrationPort {
  async pollExternalFeed(command: unknown): Promise<ExternalFeedPollResult> {
    const cmd = command as ExternalFeedPollCommand;
    return {
      feedId: cmd.feedId,
      itemCount: 0,
      newItems: 0,
      polledAt: new Date().toISOString(),
    };
  }

  async ingestExternalFeedItem(command: unknown): Promise<{ readonly id: string; readonly status: string }> {
    const cmd = command as ExternalFeedIngestCommand;
    const payloadHash = computePayloadHash(JSON.stringify({ title: cmd.title, content: cmd.content }));
    return {
      id: `feed-item-${cmd.feedId}-${cmd.externalId}`,
      status: "ingested",
    };
  }
}

export interface SyndicationDeliverCommand {
  readonly tenantId: string;
  readonly partnerId: string;
  readonly storyId: string;
  readonly itemId?: string;
  readonly deliveryFormat: string;
  readonly idempotencyKey: string;
}

export interface SyndicationReceiptCommand {
  readonly tenantId: string;
  readonly deliveryId: string;
  readonly partnerId: string;
  readonly status: "delivered" | "failed" | "retry";
  readonly receiptData?: string;
  readonly retryAfterMs?: number;
}

export interface SyndicationDeliveryResult {
  readonly deliveryId: string;
  readonly status: "delivered" | "queued" | "failed";
  readonly attemptCount: number;
  readonly nextRetryAt?: string;
}

export class NewsSyndicationAdapter implements NewsSyndicationIntegrationPort {
  async deliverStoryPackage(command: unknown): Promise<SyndicationDeliveryResult> {
    const cmd = command as SyndicationDeliverCommand;
    return {
      deliveryId: `syndication-${cmd.partnerId}-${cmd.storyId}-${Date.now()}`,
      status: "queued",
      attemptCount: 1,
    };
  }

  async recordDeliveryReceipt(command: unknown): Promise<SyndicationDeliveryResult> {
    const cmd = command as SyndicationReceiptCommand;
    const nextRetryAt = cmd.status === "retry" && cmd.retryAfterMs
      ? new Date(Date.now() + cmd.retryAfterMs).toISOString()
      : undefined;
    return {
      deliveryId: cmd.deliveryId,
      status: cmd.status === "failed" ? "failed" : "delivered",
      attemptCount: 1,
      nextRetryAt,
    };
  }
}

export interface NewsletterComposeCommand {
  readonly tenantId: string;
  readonly newsletterId: string;
  readonly title: string;
  readonly itemIds: readonly string[];
  readonly scheduledAt?: string;
}

export interface NewsletterDeliverCommand {
  readonly tenantId: string;
  readonly newsletterId: string;
  readonly issueId: string;
  readonly recipientUserIds: readonly string[];
  readonly deliveryChannel: string;
}

export interface NewsletterComposeResult {
  readonly issueId: string;
  readonly itemCount: number;
  readonly status: "composed" | "scheduled";
}

export class NewsNewsletterAdapter implements NewsNewsletterIntegrationPort {
  async composeNewsletterIssue(command: unknown): Promise<NewsletterComposeResult> {
    const cmd = command as NewsletterComposeCommand;
    return {
      issueId: `issue-${cmd.newsletterId}-${Date.now()}`,
      itemCount: cmd.itemIds.length,
      status: cmd.scheduledAt ? "scheduled" : "composed",
    };
  }

  async deliverNewsletterIssue(command: unknown): Promise<NotificationDeliveryResult> {
    const cmd = command as NewsletterDeliverCommand;
    return {
      deliveryId: `newsletter-delivery-${cmd.issueId}-${Date.now()}`,
      recipientCount: cmd.recipientUserIds.length,
      status: "queued",
    };
  }
}

export interface PaywallAccessCommand {
  readonly tenantId: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly itemId: string;
  readonly ruleId?: string;
}

export interface PaywallAccessResult {
  readonly allowed: boolean;
  readonly reason: "subscribed" | "metered" | "blocked" | "free";
  readonly remainingViews?: number;
  readonly windowResetAt?: string;
}

export interface MeteredAccessEventCommand {
  readonly tenantId: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly itemId: string;
  readonly ruleId?: string;
  readonly accessResult: string;
}

export class NewsPaywallAdapter implements NewsPaywallIntegrationPort {
  async evaluateAccessRule(command: unknown): Promise<PaywallAccessResult> {
    const cmd = command as PaywallAccessCommand;
    return {
      allowed: true,
      reason: "free",
    };
  }

  async recordMeteredAccessEvent(command: unknown): Promise<{ readonly id: string; readonly recorded: boolean }> {
    const cmd = command as MeteredAccessEventCommand;
    const idempotencyKey = `metered-${cmd.tenantId}-${cmd.userId ?? cmd.anonymousId}-${cmd.itemId}-${new Date().toISOString().slice(0, 10)}`;
    return {
      id: idempotencyKey,
      recorded: true,
    };
  }
}

export interface CdnInvalidationCommand {
  readonly tenantId: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly invalidationPattern: string;
  readonly provider: string;
}

export interface CdnConfirmationCommand {
  readonly tenantId: string;
  readonly invalidationId: string;
  readonly status: "completed" | "failed" | "retry";
  readonly retryAfterMs?: number;
}

export interface CdnInvalidationResult {
  readonly invalidationId: string;
  readonly status: "pending" | "completed" | "failed";
  readonly completedAt?: string;
}

export class NewsCdnCacheAdapter implements NewsCdnCacheIntegrationPort {
  async requestInvalidation(command: unknown): Promise<CdnInvalidationResult> {
    const cmd = command as CdnInvalidationCommand;
    return {
      invalidationId: `cdn-${cmd.provider}-${cmd.resourceType}-${cmd.resourceId}-${Date.now()}`,
      status: "pending",
    };
  }

  async confirmInvalidation(command: unknown): Promise<CdnInvalidationResult> {
    const cmd = command as CdnConfirmationCommand;
    return {
      invalidationId: cmd.invalidationId,
      status: cmd.status === "failed" ? "failed" : "completed",
      completedAt: cmd.status === "completed" ? new Date().toISOString() : undefined,
    };
  }
}

export interface TranslationRequestCommand {
  readonly tenantId: string;
  readonly itemId: string;
  readonly sourceLocale: string;
  readonly targetLocale: string;
  readonly provider: string;
  readonly requestedByUserId?: string;
}

export interface TranslationMemoryCommand {
  readonly tenantId: string;
  readonly sourceLocale: string;
  readonly targetLocale: string;
  readonly sourceText: string;
  readonly translatedText: string;
  readonly provider?: string;
  readonly qualityScore?: number;
}

export interface TranslationResult {
  readonly translationJobId: string;
  readonly status: "queued" | "completed" | "failed";
  readonly translatedText?: string;
}

export class NewsTranslationAdapter implements NewsTranslationIntegrationPort {
  async requestTranslation(command: unknown): Promise<TranslationResult> {
    const cmd = command as TranslationRequestCommand;
    const payloadHash = computePayloadHash(`${cmd.itemId}-${cmd.sourceLocale}-${cmd.targetLocale}`);
    return {
      translationJobId: `translation-${payloadHash}-${Date.now()}`,
      status: "queued",
    };
  }

  async upsertTranslationMemory(command: unknown): Promise<{ readonly id: string; readonly isNew: boolean }> {
    const cmd = command as TranslationMemoryCommand;
    const sourceHash = computePayloadHash(cmd.sourceText);
    return {
      id: `memory-${cmd.tenantId}-${cmd.sourceLocale}-${cmd.targetLocale}-${sourceHash}`,
      isNew: true,
    };
  }
}

export interface ModerationClassifyCommand {
  readonly tenantId: string;
  readonly targetType: "item" | "comment" | "media" | "source";
  readonly targetId: string;
  readonly content: string;
  readonly sourceTrustScore?: number;
}

export interface ModerationExplainCommand {
  readonly tenantId: string;
  readonly caseId: string;
  readonly decision: string;
  readonly signals: readonly string[];
}

export interface ModerationClassifyResult {
  readonly caseId: string;
  readonly riskLevel: "low" | "medium" | "high" | "critical";
  readonly riskScore: number;
  readonly signals: readonly string[];
  readonly recommendedAction: "approve" | "review" | "reject" | "escalate";
}

export class NewsModerationAiAdapter implements NewsModerationAiIntegrationPort {
  async classifyRisk(command: unknown): Promise<ModerationClassifyResult> {
    const cmd = command as ModerationClassifyCommand;
    const trustDiscount = cmd.sourceTrustScore ? Math.max(0, 1 - cmd.sourceTrustScore / 100) : 0.5;
    const baseRisk = this.computeBaseRisk(cmd.content);
    const riskScore = Math.min(100, Math.round(baseRisk * (1 + trustDiscount)));
    const riskLevel = riskScore >= 80 ? "critical" : riskScore >= 60 ? "high" : riskScore >= 30 ? "medium" : "low";

    return {
      caseId: `moderation-${cmd.targetType}-${cmd.targetId}-${Date.now()}`,
      riskLevel,
      riskScore,
      signals: this.extractSignals(cmd.content),
      recommendedAction: riskLevel === "critical" ? "reject" : riskLevel === "high" ? "review" : "approve",
    };
  }

  async explainDecision(command: unknown): Promise<{ readonly caseId: string; readonly explanation: string; readonly evidenceMarkers: readonly string[] }> {
    const cmd = command as ModerationExplainCommand;
    return {
      caseId: cmd.caseId,
      explanation: `Decision: ${cmd.decision}. Signals: ${cmd.signals.join(", ")}.`,
      evidenceMarkers: cmd.signals.map((s, i) => `evidence-${i + 1}`),
    };
  }

  private computeBaseRisk(content: string): number {
    const length = content.length;
    if (length > 5000) return 40;
    if (length > 1000) return 25;
    return 10;
  }

  private extractSignals(content: string): string[] {
    const signals: string[] = [];
    if (content.length > 5000) signals.push("long-content");
    if (/[!]{3,}/.test(content)) signals.push("excessive-punctuation");
    if (/[A-Z]{10,}/.test(content)) signals.push("excessive-caps");
    return signals.length > 0 ? signals : ["normal-content"];
  }
}

export interface ComplianceLegalHoldCommand {
  readonly tenantId: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly holdReason: string;
  readonly caseReference: string;
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly createdByUserId: string;
}

export interface ComplianceRetentionPolicyCommand {
  readonly tenantId: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly retentionDays: number;
  readonly deleteMode: "soft" | "hard";
  readonly legalHoldRequired: boolean;
}

export interface ComplianceLegalHoldResult {
  readonly id: string;
  readonly status: "active" | "expired" | "released";
  readonly holdsChanges: boolean;
}

export interface ComplianceRetentionResult {
  readonly canDelete: boolean;
  readonly canArchive: boolean;
  readonly hasLegalHold: boolean;
  readonly retentionExpired: boolean;
  readonly reason?: string;
}

export class NewsComplianceAdapter implements NewsComplianceIntegrationPort {
  async applyLegalHold(command: unknown): Promise<ComplianceLegalHoldResult> {
    const cmd = command as ComplianceLegalHoldCommand;
    return {
      id: `hold-${cmd.targetType}-${cmd.targetId}-${Date.now()}`,
      status: "active",
      holdsChanges: true,
    };
  }

  async evaluateRetentionPolicy(command: unknown): Promise<ComplianceRetentionResult> {
    const cmd = command as ComplianceRetentionPolicyCommand;
    if (cmd.legalHoldRequired) {
      return {
        canDelete: false,
        canArchive: false,
        hasLegalHold: true,
        retentionExpired: false,
        reason: "Legal hold prevents deletion or archival.",
      };
    }
    return {
      canDelete: true,
      canArchive: true,
      hasLegalHold: false,
      retentionExpired: true,
    };
  }
}

export const NEWS_NEWSROOM_INTEGRATION_CAPABILITIES: readonly NewsIntegrationCapability[] = [
  {
    key: "drive-media",
    ownerBoundary: "drive",
    requiredSdkFamily: "sdkwork-drive-app-sdk",
    summary: "Drive-backed MediaResource attachment, download grant, and server-side import boundary.",
    todo: "TODO(news-integration): declare Drive SDK dependency and implement media attachment through Drive references only.",
  },
  {
    key: "appbase-iam",
    ownerBoundary: "iam",
    requiredSdkFamily: "sdkwork-iam-app-sdk",
    summary: "Dual-token user, tenant, organization, role, and permission context supplied by appbase IAM.",
    todo: "TODO(news-integration): map editor, reviewer, operator, and reader permissions to appbase IAM policy checks.",
  },
  {
    key: "search-index",
    ownerBoundary: "content.news.search",
    summary: "News item, story, topic, source, and schema.org projections for search and discovery.",
    todo: "TODO(news-integration): implement projection rebuild worker and index drift verification.",
  },
  {
    key: "notification-delivery",
    ownerBoundary: "communication",
    summary: "Breaking alert, digest, and subscription fan-out through the communication domain.",
    todo: "TODO(news-integration): integrate notification delivery SDK after communication authority is selected.",
  },
  {
    key: "newsletter-delivery",
    ownerBoundary: "communication",
    summary: "Newsletter issue composition and delivery for curated newsroom mailouts.",
    todo: "TODO(news-integration): integrate newsletter delivery with approved communication SDK and quiet-hour policy.",
  },
  {
    key: "analytics-warehouse",
    ownerBoundary: "analytics",
    summary: "Append-only event export for impressions, clicks, search, shares, and editorial audits.",
    todo: "TODO(news-integration): publish privacy-safe warehouse events and retention controls.",
  },
  {
    key: "newsml-g2",
    ownerBoundary: "external-newswire",
    summary: "IPTC NewsML-G2 import adapter for professional newsroom wires and syndication packages.",
    todo: "TODO(news-integration): implement NewsML-G2 parser, payload hash, source identity, and import job mapping.",
  },
  {
    key: "ninjs",
    ownerBoundary: "external-newswire",
    summary: "IPTC ninjs import/export adapter for JSON news interchange.",
    todo: "TODO(news-integration): implement ninjs 2.x bidirectional mapping and contract fixtures.",
  },
  {
    key: "schema-org",
    ownerBoundary: "public-seo",
    summary: "Schema.org NewsArticle, LiveBlogPosting, and ClaimReview JSON-LD projection.",
    todo: "TODO(news-integration): implement projection worker, endpoint schema, and cache invalidation.",
  },
  {
    key: "external-feed",
    ownerBoundary: "integration",
    summary: "External feed polling and normalized story/item ingestion for wires and partners.",
    todo: "TODO(news-integration): integrate feed polling, payload hashing, and duplicate suppression.",
  },
  {
    key: "syndication-delivery",
    ownerBoundary: "integration",
    summary: "Partner delivery of story packages, newsletters, and live coverage distributions.",
    todo: "TODO(news-integration): integrate partner delivery receipts and idempotent retries.",
  },
  {
    key: "paywall-entitlement",
    ownerBoundary: "commerce",
    summary: "Metered access and subscription entitlement checks before article visibility.",
    todo: "TODO(news-integration): integrate paywall entitlement and metered-access event capture.",
  },
  {
    key: "cdn-cache",
    ownerBoundary: "cdn",
    summary: "CDN and edge invalidation after publish, archive, or correction updates.",
    todo: "TODO(news-integration): integrate cache invalidation and completion tracking.",
  },
  {
    key: "translation-localization",
    ownerBoundary: "localization",
    summary: "Editorial translation jobs, memory, and localized variants.",
    todo: "TODO(news-integration): integrate translation jobs and localization memory updates.",
  },
  {
    key: "moderation-ai",
    ownerBoundary: "trust",
    summary: "Automated moderation risk classification and explainable decision support.",
    todo: "TODO(news-integration): integrate moderation classifier and decision explanation artifacts.",
  },
  {
    key: "privacy-compliance",
    ownerBoundary: "compliance",
    summary: "Legal hold, retention policy, and archival controls for regulated news content.",
    todo: "TODO(news-integration): integrate retention and legal-hold policy evaluation.",
  },
  {
    key: "c2pa-provenance",
    ownerBoundary: "trust",
    summary: "C2PA provenance verification for editorial media and generated assets.",
    todo: "TODO(news-integration): implement manifest verification, signer capture, and trust snapshot mapping.",
  },
];

export function createNewsProfessionalImplementationChecklist(): readonly NewsProfessionalImplementationChecklistItem[] {
  return [
    {
      owner: "database",
      target: "crates/sdkwork-content-news-repository-sqlx/schema/news-professional-schema.registry.json",
      todo: "TODO(news-db): generate migration v7 for planned story, rights, import/export, provenance, audit, and structured body tables.",
    },
    {
      owner: "api",
      target: "apis/_registry/news-professional-api.operations.json",
      todo: "TODO(news-api): materialize operation registry into OpenAPI 3.1.2 paths and SDK generation input.",
    },
    {
      owner: "service",
      target: "crates/sdkwork-content-news-service/src/professional.rs",
      todo: "TODO(news-service): implement story packaging, editorial workflow, trust, import/export, and media orchestration use cases.",
    },
    {
      owner: "repository",
      target: "crates/sdkwork-content-news-repository-sqlx/src/professional_schema.rs",
      todo: "TODO(news-repository): implement SQLx repositories for every planned table and tenant-scoped query.",
    },
    {
      owner: "sdk",
      target: "packages/common/news/sdkwork-news-sdk-ports/src/professional.ts",
      todo: "TODO(news-sdk): bind generated open/app/backend SDK resource methods to professional service ports.",
    },
    {
      owner: "drive",
      target: "NewsDriveMediaIntegrationPort",
      todo: "TODO(news-integration): use Drive SDK/Uploader instead of app-local upload, object key, or presign logic.",
    },
    {
      owner: "search",
      target: "NewsSearchIndexIntegrationPort",
      todo: "TODO(news-integration): build search and schema.org projection workers with drift checks.",
    },
    {
      owner: "notification",
      target: "NewsNotificationIntegrationPort",
      todo: "TODO(news-integration): route alert and digest fan-out through communication SDK once authority is selected.",
    },
    {
      owner: "industry-formats",
      target: "NewsIndustryFormatIntegrationPort",
      todo: "TODO(news-integration): add ninjs and NewsML-G2 fixtures, import idempotency, and export conformance tests.",
    },
    {
      owner: "trust",
      target: "news_c2pa_provenance",
      todo: "TODO(news-trust): verify C2PA manifests and feed provenance into item trust snapshots.",
    },
  ];
}
