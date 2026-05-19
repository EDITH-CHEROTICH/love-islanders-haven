
-- 1. Extend profiles with all onboarding fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dob date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS gender_preference text,
  ADD COLUMN IF NOT EXISTS height_cm integer,
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS education text,
  ADD COLUMN IF NOT EXISTS exercise text,
  ADD COLUMN IF NOT EXISTS drinking_habit text,
  ADD COLUMN IF NOT EXISTS smoking_habit text,
  ADD COLUMN IF NOT EXISTS relationship_goal text,
  ADD COLUMN IF NOT EXISTS communication_style text,
  ADD COLUMN IF NOT EXISTS love_language text,
  ADD COLUMN IF NOT EXISTS zodiac_sign text,
  ADD COLUMN IF NOT EXISTS hometown text,
  ADD COLUMN IF NOT EXISTS pronouns text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS age_range_min integer DEFAULT 18,
  ADD COLUMN IF NOT EXISTS age_range_max integer DEFAULT 35,
  ADD COLUMN IF NOT EXISTS distance_preference integer DEFAULT 25,
  ADD COLUMN IF NOT EXISTS show_me_verified_only boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_age boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- 2. updated_at trigger on profiles
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Auto-create match on mutual right swipe
CREATE OR REPLACE FUNCTION public.handle_mutual_swipe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reciprocal_exists boolean;
  match_exists boolean;
BEGIN
  IF NEW.direction <> 'right' THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.swipes
    WHERE user_id = NEW.swiped_user_id
      AND swiped_user_id = NEW.user_id
      AND direction = 'right'
  ) INTO reciprocal_exists;

  IF reciprocal_exists THEN
    SELECT EXISTS (
      SELECT 1 FROM public.matches
      WHERE (user_id = NEW.user_id AND matched_user_id = NEW.swiped_user_id)
         OR (user_id = NEW.swiped_user_id AND matched_user_id = NEW.user_id)
    ) INTO match_exists;

    IF NOT match_exists THEN
      INSERT INTO public.matches (user_id, matched_user_id, status)
      VALUES (NEW.user_id, NEW.swiped_user_id, 'active');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS swipes_mutual_match ON public.swipes;
CREATE TRIGGER swipes_mutual_match
AFTER INSERT ON public.swipes
FOR EACH ROW EXECUTE FUNCTION public.handle_mutual_swipe();

-- 4. Helpful indexes
CREATE INDEX IF NOT EXISTS swipes_user_idx ON public.swipes (user_id);
CREATE INDEX IF NOT EXISTS swipes_swiped_idx ON public.swipes (swiped_user_id);
CREATE INDEX IF NOT EXISTS matches_user_idx ON public.matches (user_id, matched_user_id);
CREATE INDEX IF NOT EXISTS profile_images_profile_idx ON public.profile_images (profile_id, position);
