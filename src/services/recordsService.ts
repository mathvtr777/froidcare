import { supabase, isSupabaseReady } from '../lib/supabase';
import { mockStorage } from './mockStorage';
import { EmotionalRecord, EmotionalRecordInput } from '../types';

export interface RecordsFilter {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  emotion?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const recordsService = {
  async fetchRecords(userId: string, filter?: RecordsFilter): Promise<{ records: EmotionalRecord[]; total: number }> {
    if (isSupabaseReady() && supabase) {
      let query = supabase
        .from('emotional_records')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('record_timestamp', { ascending: false });

      if (filter?.startDate) {
        // Start of local date converted to ISO
        const startIso = new Date(`${filter.startDate}T00:00:00`).toISOString();
        query = query.gte('record_timestamp', startIso);
      }

      if (filter?.endDate) {
        // End of local date converted to ISO
        const endIso = new Date(`${filter.endDate}T23:59:59.999`).toISOString();
        query = query.lte('record_timestamp', endIso);
      }

      if (filter?.emotion && filter.emotion !== 'all') {
        query = query.eq('primary_emotion', filter.emotion);
      }

      if (filter?.search && filter.search.trim()) {
        const term = `%${filter.search.trim()}%`;
        query = query.or(`notes.ilike.${term},context.ilike.${term}`);
      }

      if (filter?.limit) {
        const offset = filter.offset || 0;
        query = query.range(offset, offset + filter.limit - 1);
      }

      const { data, count, error } = await query;
      if (error) {
        console.error('[recordsService] Erro ao buscar registros:', error);
        throw new Error('Não foi possível carregar os registros.');
      }

      return {
        records: (data || []) as EmotionalRecord[],
        total: count || (data?.length ?? 0),
      };
    }

    // Demo/Offline storage
    let list = mockStorage.getRecords(userId);

    if (filter?.startDate) {
      const startMs = new Date(`${filter.startDate}T00:00:00`).getTime();
      list = list.filter((r) => new Date(r.record_timestamp).getTime() >= startMs);
    }

    if (filter?.endDate) {
      const endMs = new Date(`${filter.endDate}T23:59:59.999`).getTime();
      list = list.filter((r) => new Date(r.record_timestamp).getTime() <= endMs);
    }

    if (filter?.emotion && filter.emotion !== 'all') {
      list = list.filter((r) => r.primary_emotion === filter.emotion);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.notes && r.notes.toLowerCase().includes(q)) ||
          (r.context && r.context.toLowerCase().includes(q)) ||
          (r.triggers && r.triggers.some((t) => t.toLowerCase().includes(q)))
      );
    }

    const total = list.length;
    if (filter?.limit) {
      const offset = filter.offset || 0;
      list = list.slice(offset, offset + filter.limit);
    }

    return { records: list, total };
  },

  async getRecordById(userId: string, id: string): Promise<EmotionalRecord | null> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('emotional_records')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data as EmotionalRecord;
    }

    const records = mockStorage.getRecords(userId);
    return records.find((r) => r.id === id) || null;
  },

  async createRecord(userId: string, input: EmotionalRecordInput): Promise<EmotionalRecord> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('emotional_records')
        .insert({
          user_id: userId,
          record_timestamp: input.record_timestamp || new Date().toISOString(),
          primary_emotion: input.primary_emotion,
          secondary_emotions: input.secondary_emotions || [],
          intensity: input.intensity,
          context: input.context || null,
          triggers: input.triggers || [],
          sleep_quality: input.sleep_quality || null,
          notes: input.notes || null,
          activity_used: input.activity_used || null,
          post_intensity: input.post_intensity || null,
        })
        .select('*')
        .single();

      if (error) {
        console.error('[recordsService] Erro ao criar registro:', error);
        throw new Error('Falha ao salvar o registro no banco de dados.');
      }
      return data as EmotionalRecord;
    }

    return mockStorage.saveRecord(userId, input);
  },

  async updateRecord(userId: string, id: string, input: EmotionalRecordInput): Promise<EmotionalRecord> {
    if (isSupabaseReady() && supabase) {
      const { data, error } = await supabase
        .from('emotional_records')
        .update({
          record_timestamp: input.record_timestamp,
          primary_emotion: input.primary_emotion,
          secondary_emotions: input.secondary_emotions || [],
          intensity: input.intensity,
          context: input.context || null,
          triggers: input.triggers || [],
          sleep_quality: input.sleep_quality || null,
          notes: input.notes || null,
          activity_used: input.activity_used || null,
          post_intensity: input.post_intensity || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('[recordsService] Erro ao atualizar registro:', error);
        throw new Error('Falha ao atualizar o registro.');
      }
      return data as EmotionalRecord;
    }

    return mockStorage.saveRecord(userId, input, id);
  },

  async deleteRecord(userId: string, id: string): Promise<boolean> {
    if (isSupabaseReady() && supabase) {
      const { error } = await supabase
        .from('emotional_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('[recordsService] Erro ao excluir registro:', error);
        throw new Error('Falha ao excluir o registro.');
      }
      return true;
    }

    return mockStorage.deleteRecord(userId, id);
  },

  async deleteAllRecords(userId: string): Promise<boolean> {
    if (isSupabaseReady() && supabase) {
      const { error } = await supabase
        .from('emotional_records')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('[recordsService] Erro ao excluir todos os registros:', error);
        throw new Error('Falha ao excluir todos os registros.');
      }
      return true;
    }

    mockStorage.deleteAllRecords(userId);
    return true;
  },
};
