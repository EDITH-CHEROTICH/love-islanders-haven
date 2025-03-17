
import { useState, useEffect } from "react";
import { StreakPost, TopStreak } from "@/components/streaks/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useStreaks = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [userStreakCount, setUserStreakCount] = useState(0);
  const [topStreaks, setTopStreaks] = useState<TopStreak[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreakPosts();
      checkUserStreak();
    }
  }, [isAuthenticated]);

  const fetchStreakPosts = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call to fetch streak posts
      // For now, we'll use dummy data
      const dummyPosts: StreakPost[] = [
        {
          id: "1",
          user_id: "user1",
          content: "/placeholder.svg",
          caption: "Day 5 of my fitness journey! 💪",
          created_at: new Date().toISOString(),
          streak_count: 5,
          likes_count: 12,
          comments_count: 3,
          user_name: "Alex Smith",
        },
        {
          id: "2",
          user_id: "user2",
          content: "/placeholder.svg",
          caption: "Beautiful sunset today!",
          created_at: new Date().toISOString(),
          streak_count: 10,
          likes_count: 25,
          comments_count: 5,
          user_name: "Jamie Taylor",
        },
      ];
      
      setPosts(dummyPosts);
      
      // Also fetch top streaks
      setTopStreaks([
        { name: "Jamie Taylor", count: 30 },
        { name: "Alex Smith", count: 21 },
        { name: "Jordan Lee", count: 15 }
      ]);

    } catch (error) {
      console.error("Error fetching streak posts:", error);
      toast({
        title: "Error",
        description: "Failed to load streak posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserStreak = async () => {
    try {
      // This would check if the user has posted today and get their streak count
      // For now, just set dummy values
      setHasPostedToday(false);
      setUserStreakCount(7);
    } catch (error) {
      console.error("Error checking user streak:", error);
    }
  };

  const handlePostSubmit = async (postData: { content: string; caption?: string }) => {
    try {
      // This would submit the post to the backend
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      setHasPostedToday(true);
      setUserStreakCount(userStreakCount + 1);
      
      // Add the new post to the list
      const newPost: StreakPost = {
        id: Date.now().toString(),
        user_id: user?.id || "",
        content: postData.content,
        caption: postData.caption,
        created_at: new Date().toISOString(),
        streak_count: userStreakCount + 1,
        likes_count: 0,
        comments_count: 0,
        user_name: "You",
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

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes_count: p.likes_count + 1 };
      }
      return p;
    }));
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
