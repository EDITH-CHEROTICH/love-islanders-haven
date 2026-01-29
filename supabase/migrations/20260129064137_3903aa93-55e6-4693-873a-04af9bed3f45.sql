-- Add missing columns to date_plans table
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES public.safety_contacts(id);
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS location_sharing_enabled BOOLEAN DEFAULT false;

-- Add name and phone_number columns to safety_contacts (keeping existing columns for backward compatibility)
ALTER TABLE public.safety_contacts ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.safety_contacts ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update safety_contacts to copy data from old columns to new columns
UPDATE public.safety_contacts SET name = contact_name WHERE name IS NULL AND contact_name IS NOT NULL;
UPDATE public.safety_contacts SET phone_number = contact_phone WHERE phone_number IS NULL AND contact_phone IS NOT NULL;

-- Add streak_count column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Create streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  caption TEXT,
  streak_count INTEGER DEFAULT 1,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all streaks" 
ON public.streaks FOR SELECT USING (true);

CREATE POLICY "Users can create their own streaks" 
ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streaks" 
ON public.streaks FOR DELETE USING (auth.uid() = user_id);

-- Create streak_likes table
CREATE TABLE IF NOT EXISTS public.streak_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  streak_id UUID REFERENCES public.streaks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_id)
);

ALTER TABLE public.streak_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all streak likes" 
ON public.streak_likes FOR SELECT USING (true);

CREATE POLICY "Users can like streaks" 
ON public.streak_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their likes" 
ON public.streak_likes FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for streaks
ALTER PUBLICATION supabase_realtime ADD TABLE public.streaks;