export interface NewsSearchSuggestionCommand {
  normalizedQuery: string;
  displayQuery: string;
  suggestionType: 'hot' | 'history' | 'topic' | 'source' | 'correction';
  rank: number;
  score: number;
  locale?: string;
  computedAt: string;
}
