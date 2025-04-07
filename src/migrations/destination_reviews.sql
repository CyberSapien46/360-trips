
-- Create table for destination reviews
CREATE TABLE IF NOT EXISTS public.destination_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('vr', 'real_life')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.destination_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting reviews (anyone can read reviews)
CREATE POLICY "Anyone can read reviews"
  ON public.destination_reviews
  FOR SELECT
  USING (true);

-- Create policy for inserting reviews (only authenticated users)
CREATE POLICY "Authenticated users can create reviews"
  ON public.destination_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for updating reviews (only review owner)
CREATE POLICY "Users can update their own reviews"
  ON public.destination_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for deleting reviews (only review owner)
CREATE POLICY "Users can delete their own reviews"
  ON public.destination_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS destination_reviews_destination_id_idx ON public.destination_reviews(destination_id);
CREATE INDEX IF NOT EXISTS destination_reviews_user_id_idx ON public.destination_reviews(user_id);
