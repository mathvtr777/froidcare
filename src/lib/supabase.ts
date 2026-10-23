import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('seu-projeto')
);

// Fallback dummy client for when Supabase is not yet configured, to avoid null crashes
let clientInstance: SupabaseClient | null = null;

if (isConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('[Froid Care] Erro ao instanciar cliente Supabase:', err);
  }
}

export const supabase = clientInstance;

export function isSupabaseReady(): boolean {
  return isConfigured && clientInstance !== null;
}
