import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { supabase, isSupabaseReady } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isSupabaseReady();

  const loadSession = useCallback(async () => {
    try {
      const u = await authService.getSessionUser();
      setUser(u);
    } catch (err) {
      console.warn('[AuthContext] Falha ao recuperar sessão:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    if (isSupabaseReady() && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await authService.getSessionUser();
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }
  }, [loadSession]);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await authService.signIn(email, pass);
      if (res.user) {
        setUser(res.user);
        return { success: true, error: null };
      }
      return { success: false, error: res.error || 'Erro ao realizar login.' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const res = await authService.signUp(email, pass, name);
      if (res.user) {
        setUser(res.user);
        return { success: true, error: null };
      }
      return { success: false, error: res.error || 'Erro ao criar conta.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };
    const res = await authService.updateDisplayName(user.id, name);
    if (res.success) {
      setUser((prev) => (prev ? { ...prev, display_name: name.trim() } : null));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

