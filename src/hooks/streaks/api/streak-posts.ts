
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { StreakData, CreateStreakParams } from "../types";

/**
 * Fetches streak posts from Supabase
 */
export const fetchStreakPosts = async (): Promise<StreakData[]> => {
  try {
    const { data, error } = await (supabase
      .from('streaks' as any)
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
      .limit(20) as any);

    if (error) {
      console.error("Error fetching streak posts:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Fetch profile names for the post authors
    const userIds = Array.from(new Set(data.map((p: any) => p.user_id))) as string[];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);

    const nameMap = new Map<string, string>();
    (profiles || []).forEach((p: any) => nameMap.set(p.id, p.name || 'Unknown User'));

    return data.map((item: any) => ({
      ...item,
      profiles: { name: nameMap.get(item.user_id) || 'Unknown User' },
    })) as StreakData[];
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
    const { error } = await (supabase
      .from('streaks' as any)
      .insert(postData) as any);
      
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
