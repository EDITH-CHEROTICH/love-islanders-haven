-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  age INTEGER,
  location TEXT,
  interests TEXT[],
  verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create profile_onboarding table
CREATE TABLE public.profile_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed BOOLEAN DEFAULT false,
  current_step TEXT DEFAULT 'basics',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for profile_onboarding
ALTER TABLE public.profile_onboarding ENABLE ROW LEVEL SECURITY;

-- Policies for profile_onboarding
CREATE POLICY "Users can view their own onboarding" 
ON public.profile_onboarding 
FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own onboarding" 
ON public.profile_onboarding 
FOR UPDATE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own onboarding" 
ON public.profile_onboarding 
FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profile_onboarding_updated_at
BEFORE UPDATE ON public.profile_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();