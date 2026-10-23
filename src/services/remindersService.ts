import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockStorage } from './mockStorage';
import { Reminder } from '../types';

export const remindersService = {
  async getReminders(userId: string): Promise<Reminder[]> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('time_of_day', { ascending: true });

      if (error) {
        console.warn('[remindersService] Erro ao carregar lembretes:', error);
        return [];
      }
      return (data || []) as Reminder[];
    }

    return mockStorage.getReminders(userId);
  },

  async saveReminder(userId: string, reminder: Omit<Reminder, 'id' | 'user_id'>, existingId?: string): Promise<Reminder> {
    if (isSupabaseReady() && supabase) {
      if (existingId) {
        const { data, error } = await supabase
          .from('reminders')
          .update({
            time_of_day: reminder.time_of_day,
            days_of_week: reminder.days_of_week,
            is_enabled: reminder.is_enabled,
            label: reminder.label,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingId)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (error) throw new Error('Falha ao atualizar lembrete.');
        return data as Reminder;
      } else {
        const { data, error } = await supabase
          .from('reminders')
          .insert({
            user_id: userId,
            time_of_day: reminder.time_of_day,
            days_of_week: reminder.days_of_week,
            is_enabled: reminder.is_enabled,
            label: reminder.label,
          })
          .select('*')
          .single();

        if (error) throw new Error('Falha ao criar lembrete.');
        return data as Reminder;
      }
    }

    return mockStorage.saveReminder(userId, reminder, existingId);
  },

  async deleteReminder(userId: string, id: string): Promise<boolean> {
    if (isSupabaseReady() && supabase) {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error('Falha ao excluir lembrete.');
      return true;
    }

    return mockStorage.deleteReminder(userId, id);
  },

  /**
   * Request browser notification permission explicitly with prior explanation.
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return await Notification.requestPermission();
  },

  getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },
};
