import React from 'react';

export interface AdminCardProps {
  title: string;
  value: string | number;
  icon?: string;
  className?: string;
}

export function AdminCard({ title, value, icon, className = '' }: AdminCardProps) {
  return (
    <div className={`admin-card ${className}`}>
      {icon && <div className="admin-card__icon">{icon}</div>}
      <div className="admin-card__content">
        <div className="admin-card__value">{value}</div>
        <div className="admin-card__title">{title}</div>
      </div>
    </div>
  );
}

export interface AdminTableColumn<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
}

export interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function AdminTable<T extends { id: string }>({ columns, data, loading, onRowClick }: AdminTableProps<T>) {
  if (loading) {
    return <div className="admin-table__loading">Loading...</div>;
  }

  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} onClick={() => onRowClick?.(item)}>
              {columns.map(column => (
                <td key={column.key}>
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface AdminFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function AdminForm({ children, onSubmit, className = '' }: AdminFormProps) {
  return (
    <form className={`admin-form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export interface AdminFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function AdminFormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: AdminFormFieldProps) {
  return (
    <div className="admin-form__field">
      <label className="admin-form__label" htmlFor={name}>
        {label}
        {required && <span className="admin-form__required">*</span>}
      </label>
      <input
        className="admin-form__input"
        id={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export function AdminStatsCard({ title, value, change, changeType = 'neutral', icon }: AdminStatsCardProps) {
  return (
    <div className="admin-stats-card">
      {icon && <div className="admin-stats-card__icon">{icon}</div>}
      <div className="admin-stats-card__content">
        <div className="admin-stats-card__value">{value}</div>
        <div className="admin-stats-card__title">{title}</div>
        {change && (
          <div className={`admin-stats-card__change admin-stats-card__change--${changeType}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
