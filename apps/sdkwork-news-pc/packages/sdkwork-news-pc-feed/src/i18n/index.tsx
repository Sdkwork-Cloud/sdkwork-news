export interface NewsI18nMessages {
  'news.home.title': string;
  'news.home.subtitle': string;
  'news.category.title': string;
  'news.category.all': string;
  'news.item.readMore': string;
  'news.item.readTime': string;
  'news.item.publishedAt': string;
  'news.item.author': string;
  'news.item.tags': string;
  'news.item.related': string;
  'news.item.comments': string;
  'news.item.favorite': string;
  'news.item.unfavorite': string;
  'news.item.share': string;
  'news.item.report': string;
  'news.item.like': string;
  'news.item.dislike': string;
  'news.search.title': string;
  'news.search.placeholder': string;
  'news.search.noResults': string;
  'news.search.suggestions': string;
  'news.channels.title': string;
  'news.channel.title': string;
  'news.topics.title': string;
  'news.topic.title': string;
  'news.trending.title': string;
  'news.live.title': string;
  'news.live.event.title': string;
  'news.live.updates.title': string;
  'news.digests.title': string;
  'news.favorites.title': string;
  'news.favorites.empty': string;
  'news.history.title': string;
  'news.history.empty': string;
  'news.follows.title': string;
  'news.follows.empty': string;
  'news.interests.title': string;
  'news.interests.empty': string;
  'news.notifications.title': string;
  'news.notifications.empty': string;
  'news.settings.title': string;
  'news.loading': string;
  'news.error.title': string;
  'news.error.message': string;
  'news.error.retry': string;
  'news.empty.title': string;
  'news.empty.message': string;
  'news.pagination.loadMore': string;
  'news.pagination.loading': string;
  'news.pagination.noMore': string;
  'news.actions.follow': string;
  'news.actions.unfollow': string;
  'news.actions.subscribe': string;
  'news.actions.unsubscribe': string;
  'news.actions.share': string;
  'news.actions.copyLink': string;
  'news.actions.report': string;
  'news.actions.feedback': string;
  'news.trust.title': string;
  'news.trust.score': string;
  'news.trust.level.high': string;
  'news.trust.level.medium': string;
  'news.trust.level.low': string;
  'news.factChecks.title': string;
  'news.corrections.title': string;
  'news.breaking.title': string;
  'news.breaking.severity.high': string;
  'news.breaking.severity.medium': string;
  'news.breaking.severity.low': string;
}

export const defaultNewsI18nMessages: NewsI18nMessages = {
  'news.home.title': 'News',
  'news.home.subtitle': 'Stay informed with the latest news',
  'news.category.title': 'Category',
  'news.category.all': 'All Categories',
  'news.item.readMore': 'Read More',
  'news.item.readTime': '{minutes} min read',
  'news.item.publishedAt': 'Published',
  'news.item.author': 'Author',
  'news.item.tags': 'Tags',
  'news.item.related': 'Related News',
  'news.item.comments': 'Comments',
  'news.item.favorite': 'Favorite',
  'news.item.unfavorite': 'Unfavorite',
  'news.item.share': 'Share',
  'news.item.report': 'Report',
  'news.item.like': 'Like',
  'news.item.dislike': 'Dislike',
  'news.search.title': 'Search',
  'news.search.placeholder': 'Search news...',
  'news.search.noResults': 'No results found',
  'news.search.suggestions': 'Suggestions',
  'news.channels.title': 'Channels',
  'news.channel.title': 'Channel',
  'news.topics.title': 'Topics',
  'news.topic.title': 'Topic',
  'news.trending.title': 'Trending',
  'news.live.title': 'Live',
  'news.live.event.title': 'Live Event',
  'news.live.updates.title': 'Live Updates',
  'news.digests.title': 'Digests',
  'news.favorites.title': 'Favorites',
  'news.favorites.empty': 'No favorites yet',
  'news.history.title': 'History',
  'news.history.empty': 'No history yet',
  'news.follows.title': 'Following',
  'news.follows.empty': 'Not following anyone yet',
  'news.interests.title': 'Interests',
  'news.interests.empty': 'No interests yet',
  'news.notifications.title': 'Notifications',
  'news.notifications.empty': 'No notifications yet',
  'news.settings.title': 'Settings',
  'news.loading': 'Loading...',
  'news.error.title': 'Error',
  'news.error.message': 'Something went wrong',
  'news.error.retry': 'Retry',
  'news.empty.title': 'No News',
  'news.empty.message': 'No news available at the moment',
  'news.pagination.loadMore': 'Load More',
  'news.pagination.loading': 'Loading...',
  'news.pagination.noMore': 'No more items',
  'news.actions.follow': 'Follow',
  'news.actions.unfollow': 'Unfollow',
  'news.actions.subscribe': 'Subscribe',
  'news.actions.unsubscribe': 'Unsubscribe',
  'news.actions.share': 'Share',
  'news.actions.copyLink': 'Copy Link',
  'news.actions.report': 'Report',
  'news.actions.feedback': 'Feedback',
  'news.trust.title': 'Trust',
  'news.trust.score': 'Trust Score',
  'news.trust.level.high': 'High',
  'news.trust.level.medium': 'Medium',
  'news.trust.level.low': 'Low',
  'news.factChecks.title': 'Fact Checks',
  'news.corrections.title': 'Corrections',
  'news.breaking.title': 'Breaking News',
  'news.breaking.severity.high': 'High',
  'news.breaking.severity.medium': 'Medium',
  'news.breaking.severity.low': 'Low',
};

export interface NewsI18n {
  t(key: keyof NewsI18nMessages, params?: Record<string, string | number>): string;
  locale: string;
}

export function createNewsI18n(locale: string = 'en', messages: Partial<NewsI18nMessages> = {}): NewsI18n {
  const allMessages = { ...defaultNewsI18nMessages, ...messages };

  return {
    t(key: keyof NewsI18nMessages, params?: Record<string, string | number>): string {
      let message = allMessages[key] || key;
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          message = message.replace(`{${paramKey}}`, String(paramValue));
        }
      }
      return message;
    },
    locale,
  };
}

export const newsI18n = createNewsI18n();
