import React, { useEffect, useState } from 'react';
import type { ConsoleNewsService } from '../services/console-news-service';
import type { ConsoleDashboardStats } from '../types';

export interface ConsoleDashboardPageProps {
  consoleNewsService: ConsoleNewsService;
}

export function ConsoleDashboardPage({ consoleNewsService }: ConsoleDashboardPageProps) {
  const [stats, setStats] = useState<ConsoleDashboardStats>({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalChannels: 0,
    totalTopics: 0,
    pendingComments: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [newsResponse, channelsResponse, topicsResponse] = await Promise.all([
        consoleNewsService.getNewsList(),
        consoleNewsService.getChannels(),
        consoleNewsService.getTopics(),
      ]);

      const newsItems = Array.isArray(newsResponse) ? newsResponse : [];
      const channelItems = Array.isArray(channelsResponse) ? channelsResponse : [];
      const topicItems = Array.isArray(topicsResponse) ? topicsResponse : [];

      setStats({
        totalNews: newsItems.length,
        publishedNews: newsItems.filter((i: any) => i.status === 'published').length,
        draftNews: newsItems.filter((i: any) => i.status === 'draft').length,
        totalChannels: channelItems.length,
        totalTopics: topicItems.length,
        pendingComments: 0,
        totalViews: 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="console-dashboard__loading">Loading...</div>;
  }

  return (
    <div className="console-dashboard">
      <h1>Dashboard</h1>
      <div className="console-dashboard__stats">
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.totalNews}</div>
          <div className="console-dashboard__stat-label">Total News</div>
        </div>
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.publishedNews}</div>
          <div className="console-dashboard__stat-label">Published</div>
        </div>
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.draftNews}</div>
          <div className="console-dashboard__stat-label">Drafts</div>
        </div>
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.totalChannels}</div>
          <div className="console-dashboard__stat-label">Channels</div>
        </div>
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.totalTopics}</div>
          <div className="console-dashboard__stat-label">Topics</div>
        </div>
        <div className="console-dashboard__stat">
          <div className="console-dashboard__stat-value">{stats.pendingComments}</div>
          <div className="console-dashboard__stat-label">Pending Comments</div>
        </div>
      </div>
    </div>
  );
}

export interface ConsoleNewsListPageProps {
  consoleNewsService: ConsoleNewsService;
  onCreateNews?: () => void;
  onEditNews?: (newsId: string) => void;
}

export function ConsoleNewsListPage({ consoleNewsService, onCreateNews, onEditNews }: ConsoleNewsListPageProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await consoleNewsService.getNewsList();
      setNews(Array.isArray(response) ? response : ((response as any)?.items || []));
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (newsId: string) => {
    try {
      await consoleNewsService.publishNewsItem(newsId);
      await loadNews();
    } catch (err) {
      console.error('Failed to publish news:', err);
    }
  };

  const handleArchive = async (newsId: string) => {
    try {
      await consoleNewsService.archiveNewsItem(newsId);
      await loadNews();
    } catch (err) {
      console.error('Failed to archive news:', err);
    }
  };

  const handleDelete = async (newsId: string) => {
    try {
      await consoleNewsService.deleteNewsItem(newsId);
      await loadNews();
    } catch (err) {
      console.error('Failed to delete news:', err);
    }
  };

  if (loading) {
    return <div className="console-news-list__loading">Loading...</div>;
  }

  return (
    <div className="console-news-list">
      <div className="console-news-list__header">
        <h1>News</h1>
        <button className="console-news-list__create" onClick={onCreateNews}>
          Create News
        </button>
      </div>
      <div className="console-news-list__table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.status}</td>
                <td>{item.categoryId}</td>
                <td>{item.authorName}</td>
                <td>
                  <button onClick={() => onEditNews?.(item.id)}>Edit</button>
                  {item.status === 'draft' && (
                    <button onClick={() => handlePublish(item.id)}>Publish</button>
                  )}
                  {item.status === 'published' && (
                    <button onClick={() => handleArchive(item.id)}>Archive</button>
                  )}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ConsoleChannelListPageProps {
  consoleNewsService: ConsoleNewsService;
  onCreateChannel?: () => void;
  onEditChannel?: (channelId: string) => void;
}

export function ConsoleChannelListPage({ consoleNewsService, onCreateChannel, onEditChannel }: ConsoleChannelListPageProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setLoading(true);
      const response = await consoleNewsService.getChannels();
      setChannels(Array.isArray(response) ? response : ((response as any)?.items || []));
    } catch (err) {
      console.error('Failed to load channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (channelId: string) => {
    try {
      await consoleNewsService.deleteChannel(channelId);
      await loadChannels();
    } catch (err) {
      console.error('Failed to delete channel:', err);
    }
  };

  if (loading) {
    return <div className="console-channel-list__loading">Loading...</div>;
  }

  return (
    <div className="console-channel-list">
      <div className="console-channel-list__header">
        <h1>Channels</h1>
        <button className="console-channel-list__create" onClick={onCreateChannel}>
          Create Channel
        </button>
      </div>
      <div className="console-channel-list__table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {channels.map(channel => (
              <tr key={channel.id}>
                <td>{channel.title}</td>
                <td>{channel.slug}</td>
                <td>{channel.channelType}</td>
                <td>{channel.status}</td>
                <td>
                  <button onClick={() => onEditChannel?.(channel.id)}>Edit</button>
                  <button onClick={() => handleDelete(channel.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ConsoleTopicListPageProps {
  consoleNewsService: ConsoleNewsService;
  onCreateTopic?: () => void;
  onEditTopic?: (topicId: string) => void;
}

export function ConsoleTopicListPage({ consoleNewsService, onCreateTopic, onEditTopic }: ConsoleTopicListPageProps) {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const response = await consoleNewsService.getTopics();
      setTopics(Array.isArray(response) ? response : ((response as any)?.items || []));
    } catch (err) {
      console.error('Failed to load topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topicId: string) => {
    try {
      await consoleNewsService.deleteTopic(topicId);
      await loadTopics();
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  if (loading) {
    return <div className="console-topic-list__loading">Loading...</div>;
  }

  return (
    <div className="console-topic-list">
      <div className="console-topic-list__header">
        <h1>Topics</h1>
        <button className="console-topic-list__create" onClick={onCreateTopic}>
          Create Topic
        </button>
      </div>
      <div className="console-topic-list__table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={topic.id}>
                <td>{topic.title}</td>
                <td>{topic.slug}</td>
                <td>{topic.status}</td>
                <td>
                  <button onClick={() => onEditTopic?.(topic.id)}>Edit</button>
                  <button onClick={() => handleDelete(topic.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
