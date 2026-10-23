export type EmotionCategory = 'calm' | 'anxious' | 'heavy' | 'energized' | 'reflective';

export interface EmotionDefinition {
  id: string;
  label: string;
  description: string;
  category: EmotionCategory;
  accentColor: string;
}

export interface IntensityLevel {
  value: number;
  label: string;
  description: string;
}

export interface EmotionalRecord {
  id: string;
  user_id: string;
  record_timestamp: string; // ISO 8601 string
  primary_emotion: string;
  secondary_emotions?: string[];
  intensity: number; // 0 to 10
  context?: string | null;
  triggers?: string[];
  sleep_quality?: number | null; // 1 to 5
  notes?: string | null;
  activity_used?: string | null;
  post_intensity?: number | null; // 0 to 10
  created_at: string;
  updated_at: string;
}

export interface EmotionalRecordInput {
  record_timestamp?: string;
  primary_emotion: string;
  secondary_emotions?: string[];
  intensity: number;
  context?: string | null;
  triggers?: string[];
  sleep_quality?: number | null;
  notes?: string | null;
  activity_used?: string | null;
  post_intensity?: number | null;
}

export interface UserPreferences {
  user_id: string;
  display_name: string;
  reduced_motion: boolean;
  theme: 'dark' | 'dim';
  preferred_exercise_mode: 'all' | 'calm' | 'somatic' | 'cognitive';
  timezone: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  time_of_day: string; // 'HH:mm'
  days_of_week: number[]; // 0 = Domingo, 1 = Segunda, etc.
  is_enabled: boolean;
  label: string;
  created_at?: string;
  updated_at?: string;
}

export type ExerciseId = 
  | 'breathing'
  | 'grounding'
  | 'relaxation'
  | 'thought_organizer'
  | 'free_writing';

export interface ExerciseMeta {
  id: ExerciseId;
  title: string;
  shortDescription: string;
  durationMinutes: number;
  category: 'respiracao' | 'sensorial' | 'corporal' | 'cognitivo' | 'expressivo';
  icon: string;
}

export interface ReportConfig {
  periodType: '7d' | '30d' | 'month' | 'custom';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  includeNotes: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  includeActivities: boolean;
  displayName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  created_at?: string;
}
