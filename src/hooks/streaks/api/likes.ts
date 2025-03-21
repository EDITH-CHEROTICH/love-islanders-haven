
import { supabase } from "@/integrations/supabase/client";

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
