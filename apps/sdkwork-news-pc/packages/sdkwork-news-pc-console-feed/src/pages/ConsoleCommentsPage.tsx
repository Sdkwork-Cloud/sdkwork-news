import { useState, useEffect } from 'react';
import type { ConsoleNewsService } from '../services/console-news-service';

export interface ConsoleCommentsPageProps {
  consoleNewsService: ConsoleNewsService;
}

export function ConsoleCommentsPage({ consoleNewsService }: ConsoleCommentsPageProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadComments(); }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsResponse = await consoleNewsService.getNewsList({ status: 'published' });
      const items = Array.isArray(newsResponse) ? newsResponse : ((newsResponse as any)?.items || []);
      const allComments: any[] = [];
      for (const item of items.slice(0, 5)) {
        try {
          const itemComments = await consoleNewsService.getComments(item.id);
          const commentsList = Array.isArray(itemComments) ? itemComments : ((itemComments as any)?.items || []);
          allComments.push(...commentsList);
        } catch { /* skip failed items */ }
      }
      setComments(allComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      await consoleNewsService.moderateComment(id, action);
      await loadComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate comment');
    }
  };

  return (
    <div className="console-comments">
      <h1>Comment Moderation</h1>
      {error && <div className="console-comments__error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="console-comments__list">
          {comments.length === 0 ? <p>No comments to moderate</p> : (
            <table>
              <thead>
                <tr><th>ID</th><th>Item</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {comments.map((comment: any) => (
                  <tr key={comment.id}>
                    <td>{comment.id}</td>
                    <td>{comment.itemId}</td>
                    <td>{comment.status || comment.moderationStatus}</td>
                    <td>
                      <button onClick={() => handleModerate(comment.id, 'approve')}>Approve</button>
                      <button onClick={() => handleModerate(comment.id, 'reject')}>Reject</button>
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
