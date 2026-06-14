import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createIamRuntime } from '../bootstrap/iamRuntime';
import type { User } from '../bootstrap/iamRuntime';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [iamRuntime] = useState(() => createIamRuntime());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await iamRuntime.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [iamRuntime]);

  const login = useCallback(async (username: string, password: string) => {
    await iamRuntime.login(username, password);
    const currentUser = await iamRuntime.getCurrentUser();
    setUser(currentUser);
  }, [iamRuntime]);

  const logout = useCallback(async () => {
    await iamRuntime.logout();
    setUser(null);
  }, [iamRuntime]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
