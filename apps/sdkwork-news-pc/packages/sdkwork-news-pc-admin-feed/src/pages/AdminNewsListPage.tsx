import { useState, useEffect } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';

export interface AdminNewsListPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminNewsListPage({ adminNewsService }: AdminNewsListPageProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminNewsService.getNewsList();
      setNews(Array.isArray(response) ? response : ((response as any)?.items || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleFeature = async (id: string) => {
    try {
      await adminNewsService.featureNewsItem(id);
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to feature item');
    }
  };

  return (
    <div className="admin-news-list">
      <h1>News Management</h1>
      {error && <div className="admin-news-list__error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="admin-news-list__table">
          {news.length === 0 ? <p>No news items</p> : (
            <table>
              <thead>
                <tr><th>ID</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {news.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.status}</td>
                    <td>
                      <button onClick={() => handleFeature(item.id)}>Feature</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
