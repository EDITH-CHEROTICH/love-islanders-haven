import { useToast } from "@/hooks/use-toast";
import { createStreakPost } from "./api/streak-posts";
import { likeStreakPost } from "./api";

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
      console.error("No user ID available");
      toast({
        title: "Authentication required",
        description: "Please log in to post streaks",
        variant: "destructive",
      });
      return false;
    }
    
    if (!postData.content || postData.content.length === 0) {
      console.error("No content provided for streak post");
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
        content: postData.content.length > 0 ? postData.content[0].substring(0, 50) + "..." : "empty",
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
      
      // Parse the content string back to an array for the UI
      let parsedContent;
      try {
        parsedContent = JSON.parse(streakData.content);
      } catch (e) {
        console.error("Error parsing content:", e);
        parsedContent = postData.content; // Fallback to the original content
      }
      
      // Create a new post object with all the necessary fields
      const newPost = {
        id: streakData.id,
        user_id: streakData.user_id,
        content: parsedContent || postData.content, // Use parsed content or fallback
        created_at: streakData.created_at,
        streak_count: streakData.streak_count,
        likes_count: 0,
        comments_count: 0,
        profiles: { name: user.user_metadata?.name || user.email?.split('@')[0] || "You" },
        expires_at: streakData.expires_at
      };
      
      console.log("Adding new post to state:", newPost);
      
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
