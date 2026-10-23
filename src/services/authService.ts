import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockStorage } from './mockStorage';
import { UserProfile } from '../types';

export interface AuthResult {
  user: UserProfile | null;
  error: string | null;
}

function translateSupabaseError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (lower.includes('user already registered')) {
    return 'Este e-mail já está cadastrado em nosso sistema.';
  }
  if (lower.includes('password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Por favor, confirme seu e-mail através do link enviado antes de entrar.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Falha na conexão com o servidor. Verifique sua internet.';
  }
  return errorMsg || 'Ocorreu um erro ao processar sua solicitação.';
}

export const authService = {
  async getSessionUser(): Promise<UserProfile | null> {
    if (isSupabaseReady() && supabase) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;

      const user = session.user;
      // Fetch display_name from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        display_name: profile?.display_name || user.user_metadata?.display_name || (user.email ? user.email.split('@')[0] : 'Usuário'),
        created_at: user.created_at,
      };
    }

    return mockStorage.getUser();
  },

  async signUp(email: string, password: string, displayName: string): Promise<AuthResult> {
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim() || trimmedEmail.split('@')[0];

    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: trimmedName,
          },
        },
      });

      if (error) {
        return { user: null, error: translateSupabaseError(error.message) };
      }

      if (!data.user) {
        return { user: null, error: 'Não foi possível completar o cadastro.' };
      }

      // Profile is auto-created by DB trigger, but ensure client state
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || trimmedEmail,
        display_name: trimmedName,
        created_at: data.user.created_at,
      };

      return { user: profile, error: null };
    }

    // Demo / Offline mode
    const demoUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      display_name: trimmedName,
      created_at: new Date().toISOString(),
    };
    mockStorage.setUser(demoUser);
    return { user: demoUser, error: null };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const trimmedEmail = email.trim();

    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return { user: null, error: translateSupabaseError(error.message) };
      }

      if (!data.user) {
        return { user: null, error: 'Credenciais inválidas.' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', data.user.id)
        .single();

      return {
        user: {
          id: data.user.id,
          email: data.user.email || trimmedEmail,
          display_name: profile?.display_name || data.user.user_metadata?.display_name || trimmedEmail.split('@')[0],
          created_at: data.user.created_at,
        },
        error: null,
      };
    }

    // Demo mode login
    let user = mockStorage.getUser();
    if (!user) {
      user = mockStorage.initDemoUser();
    }
    user.email = trimmedEmail;
    mockStorage.setUser(user);
    return { user, error: null };
  },

  async signOut(): Promise<void> {
    if (isSupabaseReady() && supabase) {
      await supabase.auth.signOut();
    }
    mockStorage.setUser(null);
  },

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    const trimmedEmail = email.trim();
    if (isSupabaseReady() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }
      return { success: true, error: null };
    }

    // Demo mode: pretend success with delay
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, error: null };
  },

  async updateDisplayName(userId: string, newName: string): Promise<{ success: boolean; error: string | null }> {
    const trimmed = newName.trim();
    if (!trimmed) {
      return { success: false, error: 'O nome de exibição não pode ser vazio.' };
    }

    if (isSupabaseReady() && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: trimmed, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }
      return { success: true, error: null };
    }

    const current = mockStorage.getUser();
    if (current && current.id === userId) {
      current.display_name = trimmed;
      mockStorage.setUser(current);
    }
    return { success: true, error: null };
  },
};
