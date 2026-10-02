'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(supabaseUser: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: { full_name?: string; phone?: string };
}): AuthUser {
  const email = supabaseUser.email ?? '';
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || email.split('@')[0] || 'Member',
    email,
    phone: supabaseUser.user_metadata?.phone,
    createdAt: supabaseUser.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? toAuthUser(data.user) : null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAuthUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, logout }}>
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
