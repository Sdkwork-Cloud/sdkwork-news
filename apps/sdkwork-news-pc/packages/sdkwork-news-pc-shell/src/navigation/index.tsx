export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export function Navigation({ items, className = '' }: NavigationProps) {
  return (
    <nav className={`navigation ${className}`}>
      <ul className="navigation__list">
        {items.map((item, index) => (
          <li key={index} className="navigation__item">
            <a
              href={item.href}
              className={`navigation__link ${item.active ? 'navigation__link--active' : ''}`}
            >
              {item.icon && <span className="navigation__icon">{item.icon}</span>}
              <span className="navigation__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
