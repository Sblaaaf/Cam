'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import pb, { User } from '@/lib/pocketbase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authData = pb.authStore.model;
    if (authData) {
      setUser(authData as any);
    }
    setLoading(false);

    // Listen to auth changes
    pb.authStore.onChange(() => {
      setUser(pb.authStore.model as any | null);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    setUser(authData.record as any);
  };

  const register = async (email: string, password: string, username: string) => {
    const data = {
      email,
      password,
      passwordConfirm: password,
      username,
      role: 'user',
      credits: 1000, // Starting credits
    };
    await pb.collection('users').create(data);
    await login(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isModerator }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
