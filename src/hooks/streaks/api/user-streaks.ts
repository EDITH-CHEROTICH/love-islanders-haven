
import { supabase } from "@/integrations/supabase/client";

// Check if user has posted today
export const checkUserDailyPost = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('streaks')
      .select('id, streak_count, created_at')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Error checking user daily post:", error);
      throw error;
    }
    
    return {
      hasPostedToday: data && data.length > 0,
      streakCount: data && data.length > 0 ? data[0].streak_count : null
    };
  } catch (error) {
    console.error("Error in checkUserDailyPost:", error);
    return { hasPostedToday: false, streakCount: null };
  }
};

// Get user's latest streak count
export const getUserLatestStreakCount = async (userId: string) => {
  try {
    // First try to get it from the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('streak_count')
      .eq('id', userId)
      .single();
      
    if (!profileError && profileData && profileData.streak_count !== null) {
      return profileData.streak_count;
    }
    
    // Fallback to checking the streaks table
    const { data, error } = await supabase
      .from('streaks')
      .select('streak_count')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Error getting user latest streak count:", error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0].streak_count : 0;
  } catch (error) {
    console.error("Error in getUserLatestStreakCount:", error);
    return 0;
  }
};
