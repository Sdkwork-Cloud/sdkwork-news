import { useState, useEffect } from 'react';
import type { NewsService } from '../services/news-service';
import type { NewsItem } from '../types';
import { NewsCard } from '../components';

export interface ProfilePageProps {
  newsService: NewsService;
  onBack?: () => void;
}

export function ProfilePage({ newsService, onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'follows'>('favorites');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<NewsItem[]>([]);
  const [follows, setFollows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTab(activeTab); }, [activeTab]);

  const loadTab = async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'favorites') {
        const r = await newsService.getFavorites();
        const favResult = r as any;
        setFavorites(favResult?.items || favResult || []);
      } else if (tab === 'history') {
        const r = await newsService.getHistory();
        const histResult = r as any;
        setHistory(histResult?.items || histResult || []);
      } else {
        const r = await newsService.getFollows();
        const followResult = r as any;
        setFollows(followResult?.items || followResult || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-profile">
      <header className="news-profile__header">
        <button onClick={onBack}>Back</button>
        <h1>Profile</h1>
      </header>
      <nav className="news-profile__tabs">
        <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favorites</button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>History</button>
        <button className={activeTab === 'follows' ? 'active' : ''} onClick={() => setActiveTab('follows')}>Following</button>
      </nav>
      <main className="news-profile__content">
        {error && <div className="news-profile__error">{error}</div>}
        {loading ? <div>Loading...</div> : (
          <>
            {activeTab === 'favorites' && (
              favorites.length === 0 ? <p>No favorites yet</p> :
              <div className="news-profile__list">
                {favorites.map((fav: any) => (
                  <div key={fav.id} className="news-profile__item">{fav.itemId || fav.id}</div>
                ))}
              </div>
            )}
            {activeTab === 'history' && (
              history.length === 0 ? <p>No history yet</p> :
              <div className="news-profile__list">
                {history.map(item => <NewsCard key={item.id} item={item} variant="compact" />)}
              </div>
            )}
            {activeTab === 'follows' && (
              follows.length === 0 ? <p>Not following anyone yet</p> :
              <div className="news-profile__list">
                {follows.map((follow: any) => (
                  <div key={follow.id} className="news-profile__item">
                    <span>{follow.targetType}: {follow.targetId}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
