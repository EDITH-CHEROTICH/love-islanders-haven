import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData, ProfileWithStreak } from "./types";
import { SongData } from "@/components/streaks/types";

// Fetch streak posts from Supabase
export const fetchStreakPosts = async () => {
  try {
    // First, get the streaks data
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
        expires_at
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching streak posts:", error);
      throw error;
    }
    
    if (!streaksData || streaksData.length === 0) {
      console.log("No streak posts found");
      return [];
    }
    
    // Then, get user names for each post
    const streakDataWithUsernames = await Promise.all(
      streaksData.map(async (streak) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', streak.user_id)
          .single();
        
        return {
          ...streak,
          profiles: profileData ? { name: profileData.name } : { name: 'Unknown User' }
        };
      })
    );
    
    return streakDataWithUsernames as StreakData[];
  } catch (error) {
    console.error("Error in fetchStreakPosts:", error);
    return [];
  }
};

// Fetch top streak users
export const fetchTopStreaks = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, streak_count')
      .order('streak_count', { ascending: false })
      .limit(3);
      
    if (error) {
      console.error("Error fetching top streaks:", error);
      throw error;
    }
    
    // Transform the data to match our ProfileWithStreak type
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      streak_count: [{ streak_count: profile.streak_count || 0 }]
    })) as ProfileWithStreak[];
  } catch (error) {
    console.error("Error in fetchTopStreaks:", error);
    return [];
  }
};

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

// Create a new streak post
export const createStreakPost = async (
  userId: string, 
  content: string, 
  streakCount: number,
  expiresAt: string,
  caption?: string, 
  song?: SongData
) => {
  console.log("Creating streak post with data:", {
    userId,
    contentLength: content.length,
    streakCount,
    expiresAt,
    caption,
    songTitle: song?.title
  });

  try {
    // Create a unique ID for the post
    const postId = uuidv4();
    
    // Prepare the data for insertion
    const postData = {
      id: postId,
      user_id: userId,
      content: content,
      caption: caption || null,
      streak_count: streakCount,
      song_title: song?.title || null,
      song_artist: song?.artist || null,
      song_album_art: song?.album_art || null,
      song_preview_url: song?.preview_url || null,
      expires_at: expiresAt
    };
    
    console.log("Inserting streak post with ID:", postId);
    
    // Insert the data into the streaks table
    const { data, error } = await supabase
      .from('streaks')
      .insert([postData])
      .select();
      
    if (error) {
      console.error("Error creating streak post:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("No data returned after creating streak post");
      throw new Error("Failed to create streak post");
    }
    
    // Update user's streak count in profiles table
    await supabase
      .from('profiles')
      .update({ streak_count: streakCount })
      .eq('id', userId);
    
    console.log("Streak post created successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error in createStreakPost:", error);
    throw error;
  }
};

// Like a streak post
export const likeStreakPost = async (userId: string, postId: string) => {
  try {
    // Check if user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('streak_likes')
      .select('id')
      .eq('streak_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking if user already liked post:", checkError);
      throw checkError;
    }
    
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
      
    if (error) {
      console.error("Error liking post:", error);
      throw error;
    }
    
    // Get the current likes count
    const { data: currentStreakData, error: getError } = await supabase
      .from('streaks')
      .select('likes_count')
      .eq('id', postId)
      .single();
      
    if (getError) {
      console.error("Error getting current likes count:", getError);
    } else {
      // Update likes_count in streaks table with the new value
      const newCount = (currentStreakData.likes_count || 0) + 1;
      const { error: updateError } = await supabase
        .from('streaks')
        .update({ likes_count: newCount })
        .eq('id', postId);
        
      if (updateError) {
        console.error("Error incrementing likes count:", updateError);
      }
    }
    
    return true; // Successfully liked
  } catch (error) {
    console.error("Error in likeStreakPost:", error);
    return false;
  }
};
