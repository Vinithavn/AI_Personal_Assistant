'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, signupUser } from '@/lib/api';
import { LoginCredentials, SignupCredentials } from '@/lib/types';

export interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = 'ai_assistant_username';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authentication from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUsername) {
      setUser(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { username, password };
      await loginUser(credentials);
      
      // Store username in localStorage and state
      localStorage.setItem(AUTH_STORAGE_KEY, username);
      setUser(username);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const credentials: SignupCredentials = { username, password };
      await signupUser(credentials);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear localStorage and state
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
