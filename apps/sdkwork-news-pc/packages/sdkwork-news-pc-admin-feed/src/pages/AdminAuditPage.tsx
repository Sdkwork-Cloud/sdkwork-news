import { useState, useEffect } from 'react';
import type { AdminNewsService } from '../services/admin-news-service';

export interface AdminAuditPageProps {
  adminNewsService: AdminNewsService;
}

export function AdminAuditPage({ adminNewsService }: AdminAuditPageProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminNewsService.getAuditLogs();
      setLogs((data as any)?.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-audit">
      <h1>Audit Logs</h1>
      {error && <div className="admin-audit__error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="admin-audit__list">
          {logs.length === 0 ? <p>No audit logs</p> : (
            <table>
              <thead>
                <tr><th>ID</th><th>User</th><th>Action</th><th>Resource</th><th>Time</th></tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.username || log.userId}</td>
                    <td>{log.action}</td>
                    <td>{log.resource}</td>
                    <td>{log.createdAt}</td>
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
