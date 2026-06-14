import { useState, useEffect } from 'react';
import type { ConsoleNewsService } from '../services/console-news-service';

export interface ConsoleAnalyticsPageProps {
  consoleNewsService: ConsoleNewsService;
}

export function ConsoleAnalyticsPage({ consoleNewsService }: ConsoleAnalyticsPageProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await consoleNewsService.getAnalytics();
      setAnalytics(data);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div className="console-analytics">
      <h1>Analytics</h1>
      {loading ? <div>Loading...</div> : (
        <div className="console-analytics__stats">
          <div className="console-analytics__stat">
            <div className="console-analytics__stat-value">{analytics?.totalViews || 0}</div>
            <div className="console-analytics__stat-label">Total Views</div>
          </div>
          <div className="console-analytics__stat">
            <div className="console-analytics__stat-value">{analytics?.totalLikes || 0}</div>
            <div className="console-analytics__stat-label">Total Likes</div>
          </div>
          <div className="console-analytics__stat">
            <div className="console-analytics__stat-value">{analytics?.totalComments || 0}</div>
            <div className="console-analytics__stat-label">Total Comments</div>
          </div>
          <div className="console-analytics__stat">
            <div className="console-analytics__stat-value">{analytics?.totalShares || 0}</div>
            <div className="console-analytics__stat-label">Total Shares</div>
          </div>
        </div>
      )}
    </div>
  );
}
