export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`layout ${className}`}>
      <header className="layout__header">
        <div className="layout__logo">News</div>
        <nav className="layout__nav">
          <a href="/news" className="layout__nav-link">Home</a>
          <a href="/news/channels" className="layout__nav-link">Channels</a>
          <a href="/news/topics" className="layout__nav-link">Topics</a>
          <a href="/news/trending" className="layout__nav-link">Trending</a>
          <a href="/news/live" className="layout__nav-link">Live</a>
        </nav>
        <div className="layout__actions">
          <a href="/news/search" className="layout__action">Search</a>
          <a href="/news/profile" className="layout__action">Profile</a>
        </div>
      </header>
      <main className="layout__main">
        {children}
      </main>
      <footer className="layout__footer">
        <p>&copy; 2026 News. All rights reserved.</p>
      </footer>
    </div>
  );
}
