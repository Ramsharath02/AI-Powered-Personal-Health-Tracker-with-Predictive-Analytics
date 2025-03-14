/*
  # Create health_data table

  1. New Tables
    - `health_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `date` (date, not null)
      - `weight` (numeric, not null)
      - `height` (numeric, not null)
      - `steps` (integer, not null)
      - `sleep_hours` (numeric, not null)
      - `heart_rate` (integer)
      - `blood_pressure` (text)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `health_data` table
    - Add policies for authenticated users to read, insert, update, and delete their own health data
*/

CREATE TABLE IF NOT EXISTS health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  weight numeric NOT NULL,
  height numeric NOT NULL,
  steps integer NOT NULL,
  sleep_hours numeric NOT NULL,
  heart_rate integer,
  blood_pressure text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS health_data_user_id_idx ON health_data(user_id);
CREATE INDEX IF NOT EXISTS health_data_date_idx ON health_data(date);

ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own health data"
  ON health_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
  ON health_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data"
  ON health_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data"
  ON health_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);