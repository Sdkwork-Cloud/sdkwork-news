export interface ConsoleLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ConsoleLayout({ children, className = '' }: ConsoleLayoutProps) {
  return (
    <div className={`console-layout ${className}`}>
      <aside className="console-layout__sidebar">
        <div className="console-layout__logo">Console</div>
        <nav className="console-layout__nav">
          <a href="/console" className="console-layout__nav-link">Dashboard</a>
          <a href="/console/news" className="console-layout__nav-link">News</a>
          <a href="/console/channels" className="console-layout__nav-link">Channels</a>
          <a href="/console/topics" className="console-layout__nav-link">Topics</a>
          <a href="/console/comments" className="console-layout__nav-link">Comments</a>
          <a href="/console/analytics" className="console-layout__nav-link">Analytics</a>
          <a href="/console/settings" className="console-layout__nav-link">Settings</a>
        </nav>
      </aside>
      <main className="console-layout__main">
        <header className="console-layout__header">
          <div className="console-layout__breadcrumb">Console</div>
          <div className="console-layout__actions">
            <a href="/console/profile" className="console-layout__action">Profile</a>
          </div>
        </header>
        <div className="console-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
}
