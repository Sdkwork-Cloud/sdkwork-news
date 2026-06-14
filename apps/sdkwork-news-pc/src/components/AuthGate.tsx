import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

export function AuthGate({ children, fallback, requiredPermission, requiredRole }: AuthGateProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="auth-gate__loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return <LoginPage />;
  }

  // Check role if required
  if (requiredRole && user) {
    const userRole = (user as any).role;
    if (userRole !== requiredRole && userRole !== 'super_admin') {
      return (
        <div className="auth-gate__forbidden" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <a href="/news">Go to News</a>
        </div>
      );
    }
  }

  // Check permission if required
  if (requiredPermission && user) {
    const userPermissions = (user as any).permissions || [];
    if (!userPermissions.includes(requiredPermission)) {
      return (
        <div className="auth-gate__forbidden" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
          <h2>Access Denied</h2>
          <p>You don't have the required permission: {requiredPermission}</p>
          <a href="/news">Go to News</a>
        </div>
      );
    }
  }

  return <>{children}</>;
}
