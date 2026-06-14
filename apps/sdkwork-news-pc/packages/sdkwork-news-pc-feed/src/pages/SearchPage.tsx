import { useState, useEffect } from 'react';
import type { NewsService } from '../services/news-service';
import type { NewsItem, NewsSearchSuggestion } from '../types';
import { NewsCard } from '../components';

export interface SearchPageProps {
  newsService: NewsService;
  initialQuery?: string;
  onBack?: () => void;
}

export function SearchPage({ newsService, initialQuery = '', onBack }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<NewsItem[]>([]);
  const [suggestions, setSuggestions] = useState<NewsSearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  }, []);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await newsService.search({ q: q.trim(), limit: '20' });
      const searchResult = response as any;
      setResults(searchResult?.items || searchResult || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const response = await newsService.getSearchSuggestions({ q, limit: '5' });
      setSuggestions((response as any) || []);
    } catch { setSuggestions([]); }
  };

  return (
    <div className="news-search">
      <header className="news-search__header">
        <button onClick={onBack}>Back</button>
        <h1>Search</h1>
      </header>
      <div className="news-search__form">
        <input value={query} onChange={e => handleSuggest(e.target.value)} placeholder="Search news..." />
        <button onClick={() => handleSearch(query)}>Search</button>
      </div>
      {suggestions.length > 0 && (
        <div className="news-search__suggestions">
          {suggestions.map((s, i) => (
            <div key={i} className="news-search__suggestion" onClick={() => { setQuery(s.query); handleSearch(s.query); setSuggestions([]); }}>
              {s.query}
            </div>
          ))}
        </div>
      )}
      {error && <div className="news-search__error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="news-search__results">
          {results.map(item => <NewsCard key={item.id} item={item} />)}
          {results.length === 0 && query && !error && <p>No results found</p>}
        </div>
      )}
    </div>
  );
}
