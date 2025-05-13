/*
  # Create comments table for PC components articles

  1. New Tables
    - `comments`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `article_id` (bigint)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `comments` table
    - Add policies for authenticated users to:
      - Read all comments
      - Create their own comments
      - Update their own comments
      - Delete their own comments
*/

CREATE TABLE IF NOT EXISTS comments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users NOT NULL,
  article_id bigint NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  USING (true);

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);