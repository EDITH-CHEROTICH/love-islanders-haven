
import { useState, useEffect } from "react";
import { StreakPost, TopStreak, SongData } from "@/components/streaks/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Define types for database responses
interface StreakData {
  id: string;
  user_id: string;
  content: string;
  caption: string | null;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  song_title: string | null;
  song_artist: string | null;
  song_album_art: string | null;
  song_preview_url: string | null;
  profiles: { name: string } | null;
}

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
      
      // Fetch streak posts from Supabase
      const { data: streaksData, error } = await supabase
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
          song_title,
          song_artist,
          song_album_art,
          song_preview_url,
          profiles(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!streaksData) throw new Error("No data returned from streaks query");

      // Transform the data to match our StreakPost type
      const transformedPosts: StreakPost[] = (streaksData as StreakData[]).map(streak => ({
        id: streak.id,
        user_id: streak.user_id,
        content: streak.content,
        caption: streak.caption || undefined,
        created_at: streak.created_at,
        streak_count: streak.streak_count,
        likes_count: streak.likes_count,
        comments_count: streak.comments_count,
        user_name: streak.profiles?.name || "Unknown User",
        user_profile_image: undefined, // We could fetch this from profile_images in the future
        song: streak.song_title ? {
          title: streak.song_title,
          artist: streak.song_artist || "",
          album_art: streak.song_album_art || undefined,
          preview_url: streak.song_preview_url || undefined
        } : undefined
      }));
      
      setPosts(transformedPosts);
      
      // Also fetch top streaks - users with highest streak counts
      const { data: topStreaksData, error: topStreaksError } = await supabase
        .from('profiles')
        .select('id, name, streak_count:streaks(streak_count)')
        .order('streak_count', { ascending: false })
        .limit(3);
        
      if (topStreaksError) throw topStreaksError;
      
      // If we don't have streak data yet, use dummy data for now
      if (!topStreaksData || topStreaksData.length === 0) {
        setTopStreaks([
          { name: "Jordan Lee", count: 30 },
          { name: "Alex Smith", count: 21 },
          { name: "Jamie Taylor", count: 15 }
        ]);
      } else {
        // Type assertion for profile data
        interface ProfileWithStreak {
          name: string;
          streak_count?: Array<{ streak_count: number }>;
        }
        
        const transformedTopStreaks: TopStreak[] = (topStreaksData as ProfileWithStreak[])
          .map(profile => ({
            name: profile.name,
            count: profile.streak_count?.[0]?.streak_count || 0
          }))
          .filter(streak => streak.count > 0);
        
        setTopStreaks(transformedTopStreaks.length > 0 ? transformedTopStreaks : [
          { name: "Jordan Lee", count: 30 },
          { name: "Alex Smith", count: 21 },
          { name: "Jamie Taylor", count: 15 }
        ]);
      }

    } catch (error) {
      console.error("Error fetching streak posts:", error);
      // If there's an error fetching data, use dummy data
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('streaks')
        .select('id, streak_count, created_at')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      setHasPostedToday(data && data.length > 0);
      
      // Get user's current streak count
      if (data && data.length > 0) {
        // Type assertion for the streak data
        interface StreakCountData {
          streak_count: number;
        }
        setUserStreakCount((data[0] as StreakCountData).streak_count || 0);
      } else {
        // Get the latest streak
        const { data: latestStreak, error: latestError } = await supabase
          .from('streaks')
          .select('streak_count')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (latestError) throw latestError;
        
        interface StreakCountData {
          streak_count: number;
        }
        
        setUserStreakCount(latestStreak && latestStreak.length > 0 ? 
          (latestStreak[0] as StreakCountData).streak_count : 0);
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
      
      // Insert the new streak post into Supabase
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          content: postData.content,
          caption: postData.caption || null,
          streak_count: newStreakCount,
          song_title: postData.song?.title || null,
          song_artist: postData.song?.artist || null,
          song_album_art: postData.song?.album_art || null,
          song_preview_url: postData.song?.preview_url || null
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      
      setHasPostedToday(true);
      setUserStreakCount(newStreakCount);
      
      // Add the new post to the list
      if (data && data.length > 0) {
        interface NewStreakData {
          id: string;
          user_id: string;
          content: string;
          caption: string | null;
          created_at: string;
          streak_count: number;
        }
        
        const streakData = data[0] as NewStreakData;
        
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
      }
      
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
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('streak_likes')
        .select('id')
        .eq('streak_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingLike) {
        // User already liked this post, do nothing
        return;
      }
      
      // Add a new like
      const { error } = await supabase
        .from('streak_likes')
        .insert({
          streak_id: postId,
          user_id: user.id
        });
        
      if (error) throw error;
      
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
