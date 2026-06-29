export interface NewsSearchEvent {
  tenantId: string;
  userId?: string;
  normalizedQuery: string;
  displayQuery: string;
  resultCount: number;
  clickedItemId?: string;
  traceId?: string;
  occurredAt: string;
}
