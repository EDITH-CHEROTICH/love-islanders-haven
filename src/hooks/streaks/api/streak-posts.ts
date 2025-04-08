
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData } from "../types";

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
        expires_at
      `)
      .order('created_at', { ascending: false })
      .limit(20);

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
          .maybeSingle();
        
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
  expiresAt: string
) => {
  console.log("Creating streak post with data:", {
    userId,
    contentLength: content.length,
    streakCount,
    expiresAt
  });

  try {
    // Validate content
    if (!content || !Array.isArray(content) || content.length === 0) {
      console.error("Invalid content format or empty content array");
      throw new Error("Invalid content format");
    }

    // Create a unique ID for the post
    const postId = uuidv4();
    
    // Store content as a JSON string
    const contentForDb = JSON.stringify(content);
    
    console.log("Content prepared for storage, length:", contentForDb.length);
    
    const postData = {
      id: postId,
      user_id: userId,
      content: contentForDb,
      streak_count: streakCount,
      expires_at: expiresAt,
      likes_count: 0, 
      comments_count: 0,
      created_at: new Date().toISOString() // Ensure created_at is included
    };
    
    console.log("Inserting streak post with ID:", postId);
    
    // Insert the data into the streaks table
    const { error } = await supabase
      .from('streaks')
      .insert(postData);
      
    if (error) {
      console.error("Error creating streak post:", error);
      throw error;
    }

    // Get the created post data
    const { data: createdPost, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('id', postId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error fetching created post:", fetchError);
      // Return the post data as fallback if we couldn't fetch it
      return postData;
    }
      
    if (!createdPost) {
      console.log("No post data returned after creation, returning basic post data instead");
      return postData; // Return the post data we tried to insert as fallback
    }

    // Update user's streak count in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ streak_count: streakCount })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error updating user profile streak count:", profileError);
      // Continue anyway since the post was created
    }
    
    console.log("Streak post created successfully:", createdPost);
    return createdPost;
  } catch (error) {
    console.error("Error in createStreakPost:", error);
    throw error;
  }
};
