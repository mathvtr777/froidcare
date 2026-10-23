-- Migration 00001: Initial schema for Froid Care
-- Enables RLS and creates tables for user profiles, preferences, emotional records, favorites, and reminders.

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  reduced_motion BOOLEAN NOT NULL DEFAULT false,
  theme TEXT NOT NULL DEFAULT 'dark',
  preferred_exercise_mode TEXT NOT NULL DEFAULT 'all',
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. EMOTIONAL RECORDS (DIÁRIO EMOCIONAL)
CREATE TABLE IF NOT EXISTS public.emotional_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  primary_emotion TEXT NOT NULL,
  secondary_emotions TEXT[] DEFAULT ARRAY[]::TEXT[],
  intensity INTEGER NOT NULL CHECK (intensity >= 0 AND intensity <= 10),
  context TEXT,
  triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
  sleep_quality INTEGER CHECK (sleep_quality IS NULL OR (sleep_quality >= 1 AND sleep_quality <= 5)),
  notes TEXT CHECK (notes IS NULL OR length(notes) <= 5000),
  activity_used TEXT,
  post_intensity INTEGER CHECK (post_intensity IS NULL OR (post_intensity >= 0 AND post_intensity <= 10)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.emotional_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional records"
  ON public.emotional_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional records"
  ON public.emotional_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotional records"
  ON public.emotional_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotional records"
  ON public.emotional_records FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_emotional_records_user_timestamp
  ON public.emotional_records (user_id, record_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_emotional_records_user_emotion
  ON public.emotional_records (user_id, primary_emotion);

-- 4. FAVORITE ACTIVITIES
CREATE TABLE IF NOT EXISTS public.favorite_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_activity UNIQUE (user_id, activity_id)
);

ALTER TABLE public.favorite_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorite activities"
  ON public.favorite_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite activities"
  ON public.favorite_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite activities"
  ON public.favorite_activities FOR DELETE
  USING (auth.uid() = user_id);

-- 5. REMINDERS
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_of_day TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  label TEXT DEFAULT 'Check-in de bem-estar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Helper trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_emotional_records_updated_at ON public.emotional_records;
CREATE TRIGGER set_emotional_records_updated_at
  BEFORE UPDATE ON public.emotional_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to automatically create profile and default preferences on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_preferences (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
