
-- Enable Row Level Security on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own likes
CREATE POLICY "Users can insert their own likes" ON public.likes
FOR INSERT WITH CHECK (auth.uid() = liker_id);

-- Allow users to view likes where they are the liker or liked
CREATE POLICY "Users can view likes they're involved in" ON public.likes
FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = liked_id);

-- Enable Row Level Security on matches table
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own matches
CREATE POLICY "Users can view their own matches" ON public.matches
FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
