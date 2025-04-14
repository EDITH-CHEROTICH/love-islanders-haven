
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData, CreateStreakParams } from "../types";

/**
 * Fetches streak posts from Supabase
 */
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
        profiles:user_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching streak posts:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Handle possible error with profiles relation by providing a default
    return data.map(item => {
      // Create a fallback profile object
      const defaultProfile = { name: 'Unknown User' };
      
      // Safely check if profiles exists, is not null, and has a name property
      let profileData: { name: string } = defaultProfile;
      
      if (item.profiles !== null && 
          item.profiles !== undefined && 
          typeof item.profiles === 'object') {
        // Cast to any first to check if name exists
        const profileObj = item.profiles as any;
        if (profileObj && 'name' in profileObj) {
          profileData = { name: profileObj.name };
        }
      }
      
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

/**
 * Creates a new streak post
 */
export const createStreakPost = async ({
  userId,
  content,
  streakCount,
  expiresAt,
  caption
}: CreateStreakParams): Promise<StreakData | null> => {
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
      caption,
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

    // Get profile info
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    // Return the created post with user data
    return {
      ...postData,
      profiles: { 
        name: profileData?.name || "You" 
      }
    };
  } catch (error) {
    console.error("Error creating streak post:", error);
    return null;
  }
};
