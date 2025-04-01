
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData } from "../types";
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

// Create a new streak post
export const createStreakPost = async (
  userId: string, 
  content: string[], 
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
      song_album_art: song?.albumArt || null,
      song_preview_url: song?.previewUrl || null,
      expires_at: expiresAt
    };
    
    console.log("Inserting streak post with ID:", postId);
    
    // Insert the data into the streaks table
    const { data, error } = await supabase
      .from('streaks')
      .insert(postData)
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
