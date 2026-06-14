import React from 'react';
import type { NewsItem } from '../types';

export interface NewsCardProps {
  item: NewsItem;
  onFavorite?: (itemId: string) => void;
  onShare?: (itemId: string) => void;
  onReport?: (itemId: string) => void;
  onClick?: (item: NewsItem) => void;
  isFavorited?: boolean;
  showAuthor?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

export function NewsCard({
  item,
  onFavorite,
  onShare,
  onReport,
  onClick,
  isFavorited = false,
  showAuthor = true,
  showTags = true,
  showReadTime = true,
  variant = 'default',
}: NewsCardProps) {
  const handleClick = () => {
    onClick?.(item);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(item.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(item.id);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReport?.(item.id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const readTimeText = `${item.estimatedReadMinutes || 0} min read`;

  return (
    <article
      className={`news-card news-card--${variant}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="news-card__content">
        <div className="news-card__meta">
          {item.categoryId && (
            <span className="news-card__category">{item.categoryId}</span>
          )}
          {showReadTime && item.estimatedReadMinutes && (
            <span className="news-card__read-time">{readTimeText}</span>
          )}
        </div>
        <h3 className="news-card__title">{item.title}</h3>
        <p className="news-card__summary">{item.summary}</p>
        {showTags && item.tags && item.tags.length > 0 && (
          <div className="news-card__tags">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="news-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="news-card__footer">
          {showAuthor && item.authorName && (
            <span className="news-card__author">{item.authorName}</span>
          )}
          <span className="news-card__date">{formatDate(item.publishedAt)}</span>
          <div className="news-card__actions">
            <button
              className={`news-card__action ${isFavorited ? 'news-card__action--active' : ''}`}
              onClick={handleFavorite}
              aria-label={isFavorited ? 'Unfavorite' : 'Favorite'}
            >
              {isFavorited ? '★' : '☆'}
            </button>
            <button
              className="news-card__action"
              onClick={handleShare}
              aria-label="Share"
            >
              ↗
            </button>
            <button
              className="news-card__action"
              onClick={handleReport}
              aria-label="Report"
            >
              ⚑
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
