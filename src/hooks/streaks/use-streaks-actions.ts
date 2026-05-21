
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createStreakPost } from "./api/streak-posts";
import { likeStreakPost } from "./api/streak-interactions";

/**
 * Simplified hook for streak post actions (create, like)
 */
export const useStreaksActions = (user: any, refreshPosts: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSubmit = async (postData: { 
    content: string[]; 
    duration?: number 
  }) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to post streaks",
        variant: "destructive",
      });
      return false;
    }
    
    if (!postData.content || postData.content.length === 0) {
      toast({
        title: "Missing image",
        description: "Please select at least one image for your streak post",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current streak count
      const { data: userData } = await supabase
        .from('profiles')
        .select('streak_count')
        .eq('id', user.id)
        .single();
      
      const currentStreakCount = userData?.streak_count || 0;
      const newStreakCount = currentStreakCount + 1;
      
      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (postData.duration || 24));
      
      // Create the post
      await createStreakPost({
        userId: user.id,
        content: postData.content,
        streakCount: newStreakCount,
        expiresAt: expiresAt.toISOString(),
      });
      
      // Refresh the posts list
      refreshPosts();
      
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating streak post:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create your streak post. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await likeStreakPost(user.id, postId);
      
      if (success) {
        // Refresh posts to get updated like count
        refreshPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handlePostSubmit,
    handleLikePost,
    isSubmitting
  };
};

export default useStreaksActions;
