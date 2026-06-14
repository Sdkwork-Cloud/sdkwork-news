import React from 'react';

export interface ConsoleCardProps {
  title: string;
  value: string | number;
  icon?: string;
  className?: string;
}

export function ConsoleCard({ title, value, icon, className = '' }: ConsoleCardProps) {
  return (
    <div className={`console-card ${className}`}>
      {icon && <div className="console-card__icon">{icon}</div>}
      <div className="console-card__content">
        <div className="console-card__value">{value}</div>
        <div className="console-card__title">{title}</div>
      </div>
    </div>
  );
}

export interface ConsoleTableColumn<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
}

export interface ConsoleTableProps<T> {
  columns: ConsoleTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function ConsoleTable<T extends { id: string }>({ columns, data, loading, onRowClick }: ConsoleTableProps<T>) {
  if (loading) {
    return <div className="console-table__loading">Loading...</div>;
  }

  return (
    <div className="console-table">
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

export interface ConsoleFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function ConsoleForm({ children, onSubmit, className = '' }: ConsoleFormProps) {
  return (
    <form className={`console-form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export interface ConsoleFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function ConsoleFormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: ConsoleFormFieldProps) {
  return (
    <div className="console-form__field">
      <label className="console-form__label" htmlFor={name}>
        {label}
        {required && <span className="console-form__required">*</span>}
      </label>
      <input
        className="console-form__input"
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
