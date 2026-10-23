import { EmotionalRecord, EmotionalRecordInput, Reminder, UserPreferences, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'froid_mock_user',
  RECORDS: 'froid_mock_records',
  PREFERENCES: 'froid_mock_preferences',
  FAVORITES: 'froid_mock_favorites',
  REMINDERS: 'froid_mock_reminders',
};

// Default initial user for instant testability in demo mode
const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-123456',
  email: 'usuario.demo@froidcare.com',
  display_name: 'Visitante',
  created_at: new Date().toISOString(),
};

export const mockStorage = {
  getUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  initDemoUser(): UserProfile {
    let user = this.getUser();
    if (!user) {
      user = { ...DEFAULT_USER };
      this.setUser(user);
    }
    return user;
  },

  getRecords(userId: string): EmotionalRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    try {
      const all: EmotionalRecord[] = JSON.parse(raw);
      return all
        .filter((r) => r.user_id === userId)
        .sort((a, b) => new Date(b.record_timestamp).getTime() - new Date(a.record_timestamp).getTime());
    } catch {
      return [];
    }
  },

  saveRecord(userId: string, input: EmotionalRecordInput, existingId?: string): EmotionalRecord {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    let all: EmotionalRecord[] = raw ? JSON.parse(raw) : [];

    const nowIso = new Date().toISOString();

    if (existingId) {
      const index = all.findIndex((r) => r.id === existingId && r.user_id === userId);
      if (index === -1) {
        throw new Error('Registro não encontrado para atualização.');
      }
      const updated: EmotionalRecord = {
        ...all[index],
        record_timestamp: input.record_timestamp || all[index].record_timestamp,
        primary_emotion: input.primary_emotion,
        secondary_emotions: input.secondary_emotions || [],
        intensity: input.intensity,
        context: input.context ?? null,
        triggers: input.triggers || [],
        sleep_quality: input.sleep_quality ?? null,
        notes: input.notes ?? null,
        activity_used: input.activity_used ?? all[index].activity_used,
        post_intensity: input.post_intensity ?? all[index].post_intensity,
        updated_at: nowIso,
      };
      all[index] = updated;
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(all));
      return updated;
    } else {
      const newRecord: EmotionalRecord = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId,
        record_timestamp: input.record_timestamp || nowIso,
        primary_emotion: input.primary_emotion,
        secondary_emotions: input.secondary_emotions || [],
        intensity: input.intensity,
        context: input.context ?? null,
        triggers: input.triggers || [],
        sleep_quality: input.sleep_quality ?? null,
        notes: input.notes ?? null,
        activity_used: input.activity_used ?? null,
        post_intensity: input.post_intensity ?? null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      all.push(newRecord);
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(all));
      return newRecord;
    }
  },

  deleteRecord(userId: string, recordId: string): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return false;
    const all: EmotionalRecord[] = JSON.parse(raw);
    const initialLen = all.length;
    const filtered = all.filter((r) => !(r.id === recordId && r.user_id === userId));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filtered));
    return filtered.length < initialLen;
  },

  deleteAllRecords(userId: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return;
    const all: EmotionalRecord[] = JSON.parse(raw);
    const remaining = all.filter((r) => r.user_id !== userId);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(remaining));
  },

  getPreferences(userId: string): UserPreferences {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) {
      try {
        const prefsMap = JSON.parse(raw);
        if (prefsMap[userId]) return prefsMap[userId];
      } catch {
        // fallback
      }
    }
    return {
      user_id: userId,
      display_name: 'Visitante',
      reduced_motion: false,
      theme: 'dark',
      preferred_exercise_mode: 'all',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
      onboarding_completed: false,
    };
  },

  savePreferences(prefs: UserPreferences) {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const prefsMap = raw ? JSON.parse(raw) : {};
    prefsMap[prefs.user_id] = prefs;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefsMap));
  },

  getFavorites(userId: string): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return ['breathing', 'grounding'];
    try {
      const favMap = JSON.parse(raw);
      return favMap[userId] || ['breathing', 'grounding'];
    } catch {
      return ['breathing', 'grounding'];
    }
  },

  toggleFavorite(userId: string, activityId: string): string[] {
    const current = this.getFavorites(userId);
    const updated = current.includes(activityId)
      ? current.filter((id) => id !== activityId)
      : [...current, activityId];
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favMap = raw ? JSON.parse(raw) : {};
    favMap[userId] = updated;
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favMap));
    return updated;
  },

  getReminders(userId: string): Reminder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return [];
    try {
      const all: Reminder[] = JSON.parse(raw);
      return all.filter((r) => r.user_id === userId);
    } catch {
      return [];
    }
  },

  saveReminder(userId: string, reminder: Omit<Reminder, 'id' | 'user_id'>, existingId?: string): Reminder {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    let all: Reminder[] = raw ? JSON.parse(raw) : [];

    if (existingId) {
      const index = all.findIndex((r) => r.id === existingId && r.user_id === userId);
      if (index === -1) throw new Error('Lembrete não encontrado.');
      all[index] = { ...all[index], ...reminder, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(all));
      return all[index];
    } else {
      const created: Reminder = {
        ...reminder,
        id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      all.push(created);
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(all));
      return created;
    }
  },

  deleteReminder(userId: string, id: string): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return false;
    const all: Reminder[] = JSON.parse(raw);
    const filtered = all.filter((r) => !(r.id === id && r.user_id === userId));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(filtered));
    return true;
  },
};
