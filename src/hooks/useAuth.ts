import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        const authUser = localStorage.getItem('authUser');

        if (authStatus === 'true' && authUser) {
          setIsAuthenticated(true);
          setUser(authUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (username: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authUser', username);
      }
      setIsAuthenticated(true);
      setUser(username);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authUser');
      }
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    requireAuth
  };
}
