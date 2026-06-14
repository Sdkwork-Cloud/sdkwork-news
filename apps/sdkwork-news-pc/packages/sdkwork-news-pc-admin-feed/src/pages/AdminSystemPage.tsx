import { useState, useEffect } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';

export interface AdminSystemPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminSystemPage({ adminNewsService }: AdminSystemPageProps) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminNewsService.getSystemSettings();
      setSettings(data as Record<string, any>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-system">
      <h1>System Settings</h1>
      {error && <div className="admin-system__error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="admin-system__content">
          {Object.keys(settings).length === 0 ? (
            <p>No system settings configured.</p>
          ) : (
            <div className="admin-system__settings">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="admin-system__setting">
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
