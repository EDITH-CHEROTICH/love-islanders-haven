
import { supabase } from "@/integrations/supabase/client";

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
