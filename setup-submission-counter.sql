-- This SQL script sets up the submission counter functionality in Supabase
-- Run this in the Supabase SQL Editor

-- Create the submissions_count table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_submissions_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'submissions_count'
  ) THEN
    -- Create the table
    CREATE TABLE public.submissions_count (
      id INTEGER PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );
    
    -- Insert initial record with id=1 and count=0
    INSERT INTO public.submissions_count (id, count) VALUES (1, 0);
  END IF;
END;
$$;

-- Function to increment the submission count
CREATE OR REPLACE FUNCTION public.increment_submission_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create table if it doesn't exist
  PERFORM create_submissions_table();
  
  -- Increment the count
  UPDATE public.submissions_count
  SET count = count + 1
  WHERE id = 1;
  
  -- If no rows were updated, insert a new record
  IF NOT FOUND THEN
    INSERT INTO public.submissions_count (id, count)
    VALUES (1, 1);
  END IF;
END;
$$;

-- Function to get the current submission count
CREATE OR REPLACE FUNCTION public.get_submission_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Create table if it doesn't exist
  PERFORM create_submissions_table();
  
  -- Get the current count
  SELECT count INTO current_count
  FROM public.submissions_count
  WHERE id = 1;
  
  RETURN COALESCE(current_count, 0);
END;
$$;

-- Grant access to these functions
GRANT EXECUTE ON FUNCTION public.create_submissions_table TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_submission_count TO service_role;
GRANT EXECUTE ON FUNCTION public.get_submission_count TO service_role;

-- Set up RLS policies for the submissions_count table
ALTER TABLE public.submissions_count ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service_role to read the table
CREATE POLICY "Service role can read submissions_count"
  ON public.submissions_count
  FOR SELECT
  TO service_role
  USING (true);

-- Create policy to allow service_role to update the table
CREATE POLICY "Service role can update submissions_count"
  ON public.submissions_count
  FOR UPDATE
  TO service_role
  USING (true);

-- Create policy to allow service_role to insert into the table
CREATE POLICY "Service role can insert into submissions_count"
  ON public.submissions_count
  FOR INSERT
  TO service_role
  WITH CHECK (true);
