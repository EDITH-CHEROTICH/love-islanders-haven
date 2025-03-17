
import { useState, useEffect } from "react";
import { StreakPost, TopStreak, SongData } from "@/components/streaks/types";
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
      // For now, we'll use dummy data with real images
      const dummyPosts: StreakPost[] = [
        {
          id: "1",
          user_id: "user1",
          content: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          caption: "Day 5 of my fitness journey! 💪 Feeling stronger every day.",
          created_at: new Date().toISOString(),
          streak_count: 5,
          likes_count: 12,
          comments_count: 3,
          user_name: "Alex Smith",
          user_profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
          song: {
            title: "Eye of the Tiger",
            artist: "Survivor",
            album_art: "https://images.unsplash.com/photo-1459305272254-33a7d593a851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
          }
        },
        {
          id: "2",
          user_id: "user2",
          content: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          caption: "Beautiful sunset today! Day 10 of sharing my daily moments.",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
          streak_count: 10,
          likes_count: 25,
          comments_count: 5,
          user_name: "Jamie Taylor",
          user_profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
        },
        {
          id: "3",
          user_id: "user3",
          content: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          caption: "Exploring the wilderness! Day 15 streak and counting.",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          streak_count: 15,
          likes_count: 34,
          comments_count: 7,
          user_name: "Jordan Lee",
          user_profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
          song: {
            title: "Born to Be Wild",
            artist: "Steppenwolf",
            album_art: "https://images.unsplash.com/photo-1614149162883-504ce46d75d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
          }
        }
      ];
      
      setPosts(dummyPosts);
      
      // Also fetch top streaks
      setTopStreaks([
        { name: "Jordan Lee", count: 30 },
        { name: "Alex Smith", count: 21 },
        { name: "Jamie Taylor", count: 15 }
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

  const handlePostSubmit = async (postData: { content: string; caption?: string; song?: SongData }) => {
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
