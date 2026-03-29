/*
  # Create Prayer and Quran Tracking Tables

  1. New Tables
    - `prayer_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date, not null) - Date of the prayer
      - `prayer_key` (text, not null) - fajr, dhuhr, asr, maghrib, isha
      - `fard` (boolean, default false) - Fard prayer completed
      - `sunnah_before` (boolean, default false) - Sunnah before fard
      - `sunnah_after` (boolean, default false) - Sunnah after fard
      - `created_at` (timestamptz, default now())
      - Unique constraint on user_id, date, prayer_key

    - `quran_readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date, not null)
      - `pages_read` (integer, not null) - Number of pages read in this session
      - `from_page` (integer) - Starting page number
      - `to_page` (integer) - Ending page number
      - `surah_name` (text) - Surah name if specified
      - `created_at` (timestamptz, default now())

    - `quran_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `pages_completed` (jsonb, default '{}') - Track which pages have been read {page_number: count}
      - `total_pages_read` (integer, default 0) - Total count of all pages
      - `current_khitmah_pages` (integer, default 0) - Pages in current khitmah (0-604)
      - `completed_khitmahs` (integer, default 0) - Number of completed khitmahs
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS prayer_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  prayer_key text NOT NULL,
  fard boolean DEFAULT false,
  sunnah_before boolean DEFAULT false,
  sunnah_after boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date, prayer_key)
);

CREATE TABLE IF NOT EXISTS quran_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  pages_read integer NOT NULL,
  from_page integer,
  to_page integer,
  surah_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quran_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  pages_completed jsonb DEFAULT '{}'::jsonb,
  total_pages_read integer DEFAULT 0,
  current_khitmah_pages integer DEFAULT 0,
  completed_khitmahs integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prayer logs"
  ON prayer_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer logs"
  ON prayer_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer logs"
  ON prayer_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer logs"
  ON prayer_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quran readings"
  ON quran_readings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quran readings"
  ON quran_readings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quran readings"
  ON quran_readings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quran readings"
  ON quran_readings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quran progress"
  ON quran_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quran progress"
  ON quran_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quran progress"
  ON quran_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quran progress"
  ON quran_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_date ON prayer_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_quran_readings_user_date ON quran_readings(user_id, date);
CREATE INDEX IF NOT EXISTS idx_quran_progress_user ON quran_progress(user_id);
