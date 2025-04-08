
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData } from "../types";

// Fetch streak posts from Supabase - simplified version
export const fetchStreakPosts = async (): Promise<StreakData[]> => {
  try {
    const { data, error } = await supabase
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
        expires_at,
        profiles (name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching streak posts:", error);
      return [];
    }
    
    // Handle possible error with profiles relation by providing a default
    return data.map(item => {
      // Create a fallback profile object
      const defaultProfile = { name: 'Unknown User' };
      
      // Check if profiles exists and is not null before accessing it
      const profileData = item.profiles ? 
        (typeof item.profiles === 'object' && !('error' in item.profiles) ? 
          item.profiles : defaultProfile) : 
        defaultProfile;
      
      return {
        ...item,
        profiles: profileData
      } as StreakData;
    });
  } catch (error) {
    console.error("Error in fetchStreakPosts:", error);
    return [];
  }
};

// Create a new streak post - simplified version
export const createStreakPost = async (
  userId: string, 
  content: string[], 
  streakCount: number,
  expiresAt: string
) => {
  try {
    // Validate content
    if (!content || content.length === 0) {
      throw new Error("No content provided");
    }

    // Create post data
    const postId = uuidv4();
    const contentString = JSON.stringify(content);
    const createdAt = new Date().toISOString();
    
    const postData = {
      id: postId,
      user_id: userId,
      content: contentString,
      streak_count: streakCount,
      expires_at: expiresAt,
      likes_count: 0, 
      comments_count: 0,
      created_at: createdAt
    };
    
    // Insert streak post
    const { error } = await supabase
      .from('streaks')
      .insert(postData);
      
    if (error) {
      throw error;
    }

    // Update user's streak count
    await supabase
      .from('profiles')
      .update({ streak_count: streakCount })
      .eq('id', userId);
    
    // Return the created post with user data
    return {
      ...postData,
      profiles: { name: "You" } // Default name until we get the real one
    };
  } catch (error) {
    console.error("Error creating streak post:", error);
    throw error;
  }
};

// Like a streak post - simplified
export const likeStreakPost = async (userId: string, postId: string) => {
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

// Check if user has posted today - simplified
export const checkUserDailyPost = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('streaks')
    .select('streak_count')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error("Error checking daily post:", error);
    return { hasPostedToday: false, streakCount: 0 };
  }
  
  return { 
    hasPostedToday: data && data.length > 0, 
    streakCount: data && data.length > 0 ? data[0].streak_count : 0
  };
};

// Get top users by streak count - simplified
export const getTopStreaks = async (limit = 3) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, streak_count')
    .order('streak_count', { ascending: false })
    .gt('streak_count', 0)
    .limit(limit);
    
  if (error) {
    console.error("Error fetching top streaks:", error);
    return [];
  }
  
  return data.map(profile => ({
    id: profile.id,
    name: profile.name || 'Anonymous',
    count: profile.streak_count,
    streak_count: [{ streak_count: profile.streak_count || 0 }] // Ensure there's always at least one element in the array
  }));
};

// Get user's latest streak count
export const getUserLatestStreakCount = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('streak_count')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      console.error("Error getting user streak count:", error);
      return 0;
    }
    
    return data.streak_count || 0;
  } catch (error) {
    console.error("Error in getUserLatestStreakCount:", error);
    return 0;
  }
};
