export interface ConsoleNavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  permission?: string;
}

export interface ConsoleNavigationProps {
  items: ConsoleNavItem[];
  className?: string;
  hasPermission?: (permission: string) => boolean;
}

export function ConsoleNavigation({ items, className = '', hasPermission }: ConsoleNavigationProps) {
  const filteredItems = hasPermission
    ? items.filter(item => !item.permission || hasPermission(item.permission))
    : items;

  return (
    <nav className={`console-navigation ${className}`}>
      <ul className="console-navigation__list">
        {filteredItems.map((item, index) => (
          <li key={index} className="console-navigation__item">
            <a
              href={item.href}
              className={`console-navigation__link ${item.active ? 'console-navigation__link--active' : ''}`}
            >
              {item.icon && <span className="console-navigation__icon">{item.icon}</span>}
              <span className="console-navigation__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
