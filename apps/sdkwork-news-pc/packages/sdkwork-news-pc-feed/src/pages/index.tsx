import React, { useEffect, useState } from 'react';
import { NewsCard } from '../components';
import { useNewsState } from '../state';
import type { NewsItem, NewsCategory } from '../types';
import type { NewsService } from '../services/news-service';

export interface HomePageProps {
  newsService: NewsService;
  onItemSelect?: (item: NewsItem) => void;
  onCategorySelect?: (category: NewsCategory) => void;
  onSearch?: (query: string) => void;
}

export function HomePage({
  newsService,
  onItemSelect,
  onCategorySelect,
  onSearch,
}: HomePageProps) {
  const {
    state,
    setLoading,
    setError,
    setCategories,
    setItems,
  } = useNewsState();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResponse, itemsResponse] = await Promise.all([
        newsService.getCategories(),
        newsService.getItems({ status: 'published' }),
      ]);

      setCategories(categoriesResponse || []);
      setItems(itemsResponse || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: NewsCategory) => {
    setSelectedCategory(category.id);
    onCategorySelect?.(category);
  };

  const handleItemSelect = (item: NewsItem) => {
    onItemSelect?.(item);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const filteredItems = selectedCategory
    ? state.items.filter(item => item.categoryId === selectedCategory)
    : state.items;

  if (state.loading) {
    return (
      <div className="news-home">
        <div className="news-home__loading">
          <div className="news-home__loading-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="news-home">
        <div className="news-home__error">
          <h2>Error</h2>
          <p>Something went wrong</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-home">
      <header className="news-home__header">
        <h1>News</h1>
        <p>Stay informed with the latest news</p>
        <form className="news-home__search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="news-home__search-input"
          />
          <button type="submit" className="news-home__search-button">
            🔍
          </button>
        </form>
      </header>

      <nav className="news-home__categories">
        <button
          className={`news-home__category ${!selectedCategory ? 'news-home__category--active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </button>
        {state.categories.map(category => (
          <button
            key={category.id}
            className={`news-home__category ${selectedCategory === category.id ? 'news-home__category--active' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            {category.title}
          </button>
        ))}
      </nav>

      <main className="news-home__content">
        <section className="news-home__items">
          <div className="news-home__items-grid">
            {filteredItems.map(item => (
              <NewsCard
                key={item.id}
                item={item}
                onClick={handleItemSelect}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
