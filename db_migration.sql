
-- Check if 'is_like' and 'is_super' columns exist in 'likes' table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'likes' AND column_name = 'is_like') THEN
        ALTER TABLE public.likes ADD COLUMN is_like BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'likes' AND column_name = 'is_super') THEN
        ALTER TABLE public.likes ADD COLUMN is_super BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
