export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

export function Loading({ size = 'medium' }: LoadingProps) {
  return (
    <div className={`loading loading--${size}`}>
      <div className="loading__spinner" />
    </div>
  );
}

export interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorProps) {
  return (
    <div className="error">
      <p className="error__message">{message}</p>
      {onRetry && (
        <button className="error__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
