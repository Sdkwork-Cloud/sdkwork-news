export interface AdminNavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  permission?: string;
  role?: string;
}

export interface AdminNavigationProps {
  items: AdminNavItem[];
  className?: string;
  hasPermission?: (permission: string) => boolean;
  hasRole?: (role: string) => boolean;
}

export function AdminNavigation({ items, className = '', hasPermission, hasRole }: AdminNavigationProps) {
  const filteredItems = items.filter(item => {
    if (item.permission && hasPermission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.role && hasRole && !hasRole(item.role)) {
      return false;
    }
    return true;
  });

  return (
    <nav className={`admin-navigation ${className}`}>
      <ul className="admin-navigation__list">
        {filteredItems.map((item, index) => (
          <li key={index} className="admin-navigation__item">
            <a
              href={item.href}
              className={`admin-navigation__link ${item.active ? 'admin-navigation__link--active' : ''}`}
            >
              {item.icon && <span className="admin-navigation__icon">{item.icon}</span>}
              <span className="admin-navigation__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
