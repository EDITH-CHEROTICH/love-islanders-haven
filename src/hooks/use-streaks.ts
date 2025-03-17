
import { useState, useEffect } from "react";
import { StreakPost, SongData } from "@/components/streaks/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchStreakPosts, 
  fetchTopStreaks, 
  checkUserDailyPost, 
  getUserLatestStreakCount,
  createStreakPost,
  likeStreakPost
} from "./streaks/api";
import { 
  getDummyPosts, 
  getDummyTopStreaks, 
  transformStreakData 
} from "./streaks/mock-data";

export const useStreaks = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [userStreakCount, setUserStreakCount] = useState(0);
  const [topStreaks, setTopStreaks] = useState(getDummyTopStreaks());

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreakPosts();
      checkUserStreak();
    }
  }, [isAuthenticated]);

  const fetchStreakPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch streak posts from Supabase
      const streaksData = await fetchStreakPosts();
      
      if (!streaksData) throw new Error("No data returned from streaks query");

      // Transform the data to match our StreakPost type
      const transformedPosts = streaksData.map(transformStreakData);
      
      setPosts(transformedPosts);
      
      // Also fetch top streaks - users with highest streak counts
      const topStreaksData = await fetchTopStreaks();
      
      // If we don't have streak data yet, use dummy data for now
      if (!topStreaksData || topStreaksData.length === 0) {
        setTopStreaks(getDummyTopStreaks());
      } else {
        // Transform the top streaks data
        const transformedTopStreaks = topStreaksData
          .map(profile => ({
            name: profile.name,
            count: profile.streak_count?.[0]?.streak_count || 0
          }))
          .filter(streak => streak.count > 0);
        
        setTopStreaks(transformedTopStreaks.length > 0 ? transformedTopStreaks : getDummyTopStreaks());
      }

    } catch (error) {
      console.error("Error fetching streak posts:", error);
      // If there's an error fetching data, use dummy data
      setPosts(getDummyPosts());
      toast({
        title: "Error",
        description: "Failed to load streak posts. Using demo data instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserStreak = async () => {
    if (!user?.id) return;
    
    try {
      // Check if user has posted today
      const { hasPostedToday: postedToday, streakCount } = await checkUserDailyPost(user.id);
      
      setHasPostedToday(postedToday);
      
      // Get user's current streak count
      if (streakCount !== null) {
        setUserStreakCount(streakCount);
      } else {
        // Get the latest streak count
        const latestCount = await getUserLatestStreakCount(user.id);
        setUserStreakCount(latestCount);
      }
    } catch (error) {
      console.error("Error checking user streak:", error);
      // Default values if there's an error
      setHasPostedToday(false);
      setUserStreakCount(0);
    }
  };

  const handlePostSubmit = async (postData: { content: string; caption?: string; song?: SongData }) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to post streaks",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Calculate the new streak count
      const newStreakCount = userStreakCount + 1;
      
      // Create a new streak post
      const streakData = await createStreakPost(
        user.id,
        postData.content,
        newStreakCount,
        postData.caption,
        postData.song
      );
      
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      
      setHasPostedToday(true);
      setUserStreakCount(newStreakCount);
      
      // Add the new post to the list
      const newPost: StreakPost = {
        id: streakData.id,
        user_id: streakData.user_id,
        content: streakData.content,
        caption: streakData.caption || undefined,
        created_at: streakData.created_at,
        streak_count: streakData.streak_count,
        likes_count: 0,
        comments_count: 0,
        user_name: user.email?.split('@')[0] || "You",
        song: postData.song
      };
      
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
    loading,
    posts,
    hasPostedToday,
    userStreakCount,
    topStreaks,
    handlePostSubmit,
    handleLikePost
  };
};

export default useStreaks;
