export interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className = '' }: AdminLayoutProps) {
  return (
    <div className={`admin-layout ${className}`}>
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__logo">Admin</div>
        <nav className="admin-layout__nav">
          <a href="/admin" className="admin-layout__nav-link">Dashboard</a>
          <a href="/admin/users" className="admin-layout__nav-link">Users</a>
          <a href="/admin/tenants" className="admin-layout__nav-link">Tenants</a>
          <a href="/admin/news" className="admin-layout__nav-link">News</a>
          <a href="/admin/moderation" className="admin-layout__nav-link">Moderation</a>
          <a href="/admin/analytics" className="admin-layout__nav-link">Analytics</a>
          <a href="/admin/system" className="admin-layout__nav-link">System</a>
          <a href="/admin/audit" className="admin-layout__nav-link">Audit</a>
        </nav>
      </aside>
      <main className="admin-layout__main">
        <header className="admin-layout__header">
          <div className="admin-layout__breadcrumb">Admin</div>
          <div className="admin-layout__actions">
            <a href="/admin/profile" className="admin-layout__action">Profile</a>
          </div>
        </header>
        <div className="admin-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
}
