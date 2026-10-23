import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockStorage } from './mockStorage';
import { UserPreferences } from '../types';

export const preferencesService = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[preferencesService] Erro ao carregar preferências:', error);
      }

      if (data) {
        return data as UserPreferences;
      }

      // If record doesn't exist, create default
      const defaultPrefs: UserPreferences = {
        user_id: userId,
        display_name: 'Visitante',
        reduced_motion: false,
        theme: 'dark',
        preferred_exercise_mode: 'all',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
        onboarding_completed: false,
      };

      await supabase.from('user_preferences').insert(defaultPrefs);
      return defaultPrefs;
    }

    return mockStorage.getPreferences(userId);
  },

  async updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('user_preferences')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('[preferencesService] Erro ao salvar preferências:', error);
        throw new Error('Falha ao atualizar preferências.');
      }
      return data as UserPreferences;
    }

    const current = mockStorage.getPreferences(userId);
    const updated = { ...current, ...updates };
    mockStorage.savePreferences(updated);
    return updated;
  },

  async getFavorites(userId: string): Promise<string[]> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('favorite_activities')
        .select('activity_id')
        .eq('user_id', userId);

      if (error) {
        console.warn('[preferencesService] Erro ao buscar favoritos:', error);
        return ['breathing', 'grounding'];
      }
      return (data || []).map((row) => row.activity_id);
    }

    return mockStorage.getFavorites(userId);
  },

  async toggleFavorite(userId: string, activityId: string): Promise<string[]> {
    if (isSupabaseReady() && supabase) {
      const current = await this.getFavorites(userId);
      const isFav = current.includes(activityId);

      if (isFav) {
        await supabase
          .from('favorite_activities')
          .delete()
          .eq('user_id', userId)
          .eq('activity_id', activityId);
        return current.filter((id) => id !== activityId);
      } else {
        await supabase
          .from('favorite_activities')
          .insert({ user_id: userId, activity_id: activityId });
        return [...current, activityId];
      }
    }

    return mockStorage.toggleFavorite(userId, activityId);
  },
};
