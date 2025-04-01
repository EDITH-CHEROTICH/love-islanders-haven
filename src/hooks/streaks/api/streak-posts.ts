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
      .limit(20); // Increased limit to show more posts

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
        
        // Parse the content if it's a JSON string
        let parsedContent;
        try {
          if (typeof streak.content === 'string') {
            parsedContent = JSON.parse(streak.content);
          } else {
            parsedContent = streak.content;
          }
        } catch (e) {
          console.error("Error parsing streak content:", e);
          parsedContent = streak.content; // Keep as is if parsing fails
        }
        
        return {
          ...streak,
          content: parsedContent,
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
    if (!Array.isArray(content) || content.length === 0) {
      console.error("Invalid content format or empty content array");
      throw new Error("Invalid content format");
    }

    // Create a unique ID for the post
    const postId = uuidv4();
    
    // Prepare the data for insertion - convert content to JSON string for DB storage
    const postData = {
      id: postId,
      user_id: userId,
      content: JSON.stringify(content), // Convert array to JSON string
      streak_count: streakCount,
      expires_at: expiresAt,
      likes_count: 0, // Initialize likes count
      comments_count: 0 // Initialize comments count
    };
    
    console.log("Inserting streak post with ID:", postId);
    console.log("Post data:", postData);
    
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
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ streak_count: streakCount })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error updating user profile streak count:", profileError);
      // Continue anyway since the post was created
    }
    
    console.log("Streak post created successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error in createStreakPost:", error);
    throw error;
  }
};
