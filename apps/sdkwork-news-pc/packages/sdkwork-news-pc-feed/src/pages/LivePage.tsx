import { useState, useEffect } from 'react';
import type { NewsService } from '../services/news-service';
import type { NewsLiveEvent } from '../types';

export interface LivePageProps {
  newsService: NewsService;
  onBack?: () => void;
}

export function LivePage({ newsService, onBack }: LivePageProps) {
  const [events, setEvents] = useState<NewsLiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await newsService.getLiveEvents({ status: 'published' });
      setEvents((response as any) || []);
    } catch { setEvents([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="news-live">
      <header className="news-live__header">
        <button onClick={onBack}>Back</button>
        <h1>Live Events</h1>
      </header>
      {loading ? <div>Loading...</div> : (
        <div className="news-live__list">
          {events.length === 0 && <p>No live events</p>}
          {events.map(event => (
            <div key={event.id} className="news-live__event">
              <h3>{event.title}</h3>
              {event.summary && <p>{event.summary}</p>}
              <span className={`news-live__status news-live__status--${event.status}`}>{event.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
