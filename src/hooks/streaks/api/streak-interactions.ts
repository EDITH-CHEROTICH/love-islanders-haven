
import { supabase } from "@/integrations/supabase/client";
import { TopStreakUser, UserStreakStatus } from "../types";

/**
 * Like a streak post
 */
export const likeStreakPost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from('streak_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('streak_id', postId)
      .maybeSingle();
      
    if (existingLike) {
      return false; // User already liked this post
    }
    
    // Create like record
    const { error } = await supabase
      .from('streak_likes')
      .insert({
        user_id: userId,
        streak_id: postId
      });
      
    if (error) {
      throw error;
    }
    
    return true; // Successfully liked the post
  } catch (error) {
    console.error("Error liking streak post:", error);
    return false;
  }
};

/**
 * Check if user has posted today
 */
export const checkUserDailyPost = async (userId: string): Promise<UserStreakStatus> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('streak_count')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    return { 
      hasPostedToday: data && data.length > 0, 
      streakCount: data && data.length > 0 ? data[0].streak_count : 0
    };
  } catch (error) {
    console.error("Error checking daily post:", error);
    return { hasPostedToday: false, streakCount: 0 };
  }
};

/**
 * Get top users by streak count
 */
export const getTopStreaks = async (limit = 3): Promise<TopStreakUser[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, streak_count')
      .order('streak_count', { ascending: false })
      .gt('streak_count', 0)
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(profile => ({
      id: profile.id,
      name: profile.name || 'Anonymous',
      count: profile.streak_count || 0,
      streak_count: [{ streak_count: profile.streak_count || 0 }]
    }));
  } catch (error) {
    console.error("Error fetching top streaks:", error);
    return [];
  }
};

/**
 * Get user's latest streak count
 */
export const getUserLatestStreakCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('streak_count')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data?.streak_count || 0;
  } catch (error) {
    console.error("Error in getUserLatestStreakCount:", error);
    return 0;
  }
};
