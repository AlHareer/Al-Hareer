'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alhareer_auth_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse auth user', e);
      }
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alhareer_auth_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alhareer_auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
      }}
    >
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
