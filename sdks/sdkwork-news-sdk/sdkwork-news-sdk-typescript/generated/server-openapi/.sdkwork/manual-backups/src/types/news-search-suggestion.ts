export interface NewsSearchSuggestion {
  tenantId: string;
  normalizedQuery: string;
  displayQuery: string;
  suggestionType: 'hot' | 'history' | 'topic' | 'source' | 'correction';
  rank: number;
  score: number;
  locale?: string;
}
