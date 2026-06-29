import type { NewsNotificationSubscription } from './news-notification-subscription';

export interface NotificationSubscriptionsUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
