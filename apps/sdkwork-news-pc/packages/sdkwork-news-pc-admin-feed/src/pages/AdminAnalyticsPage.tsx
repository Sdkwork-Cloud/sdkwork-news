import { useState, useEffect } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';

export interface AdminAnalyticsPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminAnalyticsPage({ adminNewsService }: AdminAnalyticsPageProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminNewsService.getAnalytics();
      setAnalytics(data);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div className="admin-analytics">
      <h1>Analytics</h1>
      {loading ? <div>Loading...</div> : (
        <div className="admin-analytics__stats">
          <div className="admin-analytics__stat">
            <div className="admin-analytics__stat-value">{analytics?.totalUsers || 0}</div>
            <div className="admin-analytics__stat-label">Total Users</div>
          </div>
          <div className="admin-analytics__stat">
            <div className="admin-analytics__stat-value">{analytics?.totalTenants || 0}</div>
            <div className="admin-analytics__stat-label">Total Tenants</div>
          </div>
          <div className="admin-analytics__stat">
            <div className="admin-analytics__stat-value">{analytics?.totalNews || 0}</div>
            <div className="admin-analytics__stat-label">Total News</div>
          </div>
          <div className="admin-analytics__stat">
            <div className="admin-analytics__stat-value">{analytics?.totalViews || 0}</div>
            <div className="admin-analytics__stat-label">Total Views</div>
          </div>
        </div>
      )}
    </div>
  );
}
