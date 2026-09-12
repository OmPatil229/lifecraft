import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  email: string;
  displayName: string;
  class: string;
  timezone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await apiFetch('/auth/me');
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
