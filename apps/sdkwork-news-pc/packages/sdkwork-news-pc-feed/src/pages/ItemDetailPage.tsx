import { useState, useEffect } from 'react';
import type { NewsService } from '../services/news-service';
import type { NewsItem } from '../types';
import { NewsCard } from '../components';

export interface ItemDetailPageProps {
  newsService: NewsService;
  itemSlug: string;
  onBack?: () => void;
}

export function ItemDetailPage({ newsService, itemSlug, onBack }: ItemDetailPageProps) {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadItem();
  }, [itemSlug]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getItemBySlug(itemSlug);
      setItem(data as any);
      if (data?.id) {
        const related = await newsService.getRelatedItems(data.id, { limit: '3' });
        setRelatedItems((related as any) || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load item'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="news-detail__loading">Loading...</div>;
  }

  if (error || !item) {
    return (
      <div className="news-detail__error">
        <h2>Error</h2>
        <p>{error?.message || 'Item not found'}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="news-detail">
      <header className="news-detail__header">
        <button onClick={onBack}>Back</button>
        {item.categoryId && <span className="news-detail__category">{item.categoryId}</span>}
        {item.estimatedReadMinutes && <span className="news-detail__read-time">{item.estimatedReadMinutes} min read</span>}
      </header>
      <article className="news-detail__article">
        <h1 className="news-detail__title">{item.title}</h1>
        {item.authorName && <p className="news-detail__author">By {item.authorName}</p>}
        <p className="news-detail__summary">{item.summary}</p>
        {item.body && <div className="news-detail__body">{item.body}</div>}
        {item.tags && item.tags.length > 0 && (
          <div className="news-detail__tags">
            {item.tags.map((tag, i) => <span key={i} className="news-detail__tag">{tag}</span>)}
          </div>
        )}
      </article>
      {relatedItems.length > 0 && (
        <section className="news-detail__related">
          <h3>Related News</h3>
          <div className="news-detail__related-list">
            {relatedItems.map(ri => <NewsCard key={ri.id} item={ri} variant="compact" />)}
          </div>
        </section>
      )}
    </div>
  );
}
