
import { useToast } from "@/hooks/use-toast";
import { createStreakPost, likeStreakPost } from "./api";

/**
 * Custom hook for streak post actions (create, like)
 */
export const useStreaksActions = (
  user: any,
  userStreakCount: number,
  posts: any[],
  setPosts: (posts: any[]) => void,
  setHasPostedToday: (hasPosted: boolean) => void,
  setUserStreakCount: (count: number) => void
) => {
  const { toast } = useToast();

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
      console.log("Submitting post with data:", {
        contentLength: postData.content.length,
        content: postData.content.slice(0, 1), // Log just first item for debugging
        duration: postData.duration
      });
      
      // Calculate the new streak count
      const newStreakCount = userStreakCount + 1;
      
      // Calculate the expiration time based on duration (in hours)
      const expiresAt = new Date();
      if (postData.duration) {
        expiresAt.setHours(expiresAt.getHours() + postData.duration);
      } else {
        expiresAt.setHours(expiresAt.getHours() + 24); // Default 24 hours
      }
      
      console.log('Creating streak post with expiration:', expiresAt.toISOString());
      
      // Create a new streak post
      const streakData = await createStreakPost(
        user.id,
        postData.content,
        newStreakCount,
        expiresAt.toISOString()
      );
      
      if (!streakData) {
        throw new Error("Failed to create streak post - no data returned");
      }
      
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      
      // Update state
      setHasPostedToday(true);
      setUserStreakCount(newStreakCount);
      
      // Create a new post object with all the necessary fields
      // Parse the content if it's a string (it might be stored as a JSON string in the DB)
      let parsedContent;
      try {
        if (typeof streakData.content === 'string') {
          parsedContent = JSON.parse(streakData.content);
        } else {
          parsedContent = streakData.content;
        }
      } catch (e) {
        console.error("Error parsing streak content:", e);
        parsedContent = streakData.content;
      }
      
      const newPost = {
        id: streakData.id,
        user_id: streakData.user_id,
        content: parsedContent,
        created_at: streakData.created_at,
        streak_count: streakData.streak_count,
        likes_count: 0,
        comments_count: 0,
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || "You",
        user_profile_image: user.user_metadata?.avatar_url || null,
        expires_at: streakData.expires_at
      };
      
      // Add the new post to the beginning of the posts array
      setPosts([newPost, ...posts]);
      
      return true;
    } catch (error) {
      console.error("Error creating streak post:", error);
      toast({
        title: "Error",
        description: "Failed to create streak post. Please try again.",
        variant: "destructive",
      });
      return false;
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
      // Like the post
      const success = await likeStreakPost(user.id, postId);
      
      if (!success) {
        // User already liked this post, do nothing
        return;
      }
      
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, likes_count: p.likes_count + 1 };
        }
        return p;
      }));
      
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
    handleLikePost
  };
};
