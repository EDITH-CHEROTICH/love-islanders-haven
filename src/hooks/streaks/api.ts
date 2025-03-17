
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData, ProfileWithStreak } from "./types";
import { SongData } from "@/components/streaks/types";
import { toast } from "@/hooks/use-toast";

// Fetch streak posts from Supabase
export const fetchStreakPosts = async () => {
  const { data: streaksData, error } = await supabase
    .from('streaks')
    .select(`
      id,
      user_id,
      content,
      caption,
      created_at,
      streak_count,
      likes_count,
      comments_count,
      song_title,
      song_artist,
      song_album_art,
      song_preview_url,
      profiles(name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  
  return streaksData as StreakData[];
};

// Fetch top streak users
export const fetchTopStreaks = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, streak_count:streaks(streak_count)')
    .order('streak_count', { ascending: false })
    .limit(3);
    
  if (error) throw error;
  
  return data as ProfileWithStreak[];
};

// Check if user has posted today
export const checkUserDailyPost = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('streaks')
    .select('id, streak_count, created_at')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (error) throw error;
  
  return {
    hasPostedToday: data && data.length > 0,
    streakCount: data && data.length > 0 ? data[0].streak_count : null
  };
};

// Get user's latest streak count
export const getUserLatestStreakCount = async (userId: string) => {
  const { data, error } = await supabase
    .from('streaks')
    .select('streak_count')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (error) throw error;
  
  return data && data.length > 0 ? data[0].streak_count : 0;
};

// Create a new streak post
export const createStreakPost = async (
  userId: string, 
  content: string, 
  streakCount: number,
  caption?: string, 
  song?: SongData
) => {
  const { data, error } = await supabase
    .from('streaks')
    .insert({
      id: uuidv4(),
      user_id: userId,
      content: content,
      caption: caption || null,
      streak_count: streakCount,
      song_title: song?.title || null,
      song_artist: song?.artist || null,
      song_album_art: song?.album_art || null,
      song_preview_url: song?.preview_url || null
    })
    .select();
    
  if (error) throw error;
  
  return data[0] as StreakData;
};

// Like a streak post
export const likeStreakPost = async (userId: string, postId: string) => {
  // Check if user already liked this post
  const { data: existingLike, error: checkError } = await supabase
    .from('streak_likes')
    .select('id')
    .eq('streak_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
    
  if (checkError) throw checkError;
  
  if (existingLike) {
    return false; // Already liked
  }
  
  // Add a new like
  const { error } = await supabase
    .from('streak_likes')
    .insert({
      streak_id: postId,
      user_id: userId
    });
    
  if (error) throw error;
  
  return true; // Successfully liked
};
