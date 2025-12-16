import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('admin_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('admin_token');
  });
  
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check if user is authenticated on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          const response = await authAPI.getCurrentUser();
          // Backend returns { user: {...} } format
          if (response.user?.role === 'admin') {
            setUser(response.user);
            localStorage.setItem('admin_user', JSON.stringify(response.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setInitializing(false);
    };

    initializeAuth();
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      console.log('Login response:', response); // Debug log
      
      // Backend returns: { message: "Login successful.", token: "...", user: {...} }
      // No need to check response.success - just check if we have token and user
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Check if user is admin
      if (response.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      // Store auth data
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));

      console.log('Auth state updated - token:', !!response.token, 'user role:', response.user.role);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  // Calculate isAuthenticated
  const isAuthenticated = !!(token && user && user.role === 'admin');

  console.log('Auth state:', { isAuthenticated, hasUser: !!user, hasToken: !!token, userRole: user?.role });

  const value = {
    user,
    token,
    loading,
    initializing,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}