
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchStreakPosts, 
  fetchTopStreaks, 
  checkUserDailyPost, 
  getUserLatestStreakCount
} from "./api";
import { transformStreakData } from "./mock-data";

/**
 * Custom hook to fetch streaks data
 */
export const useStreaksData = (
  isAuthenticated: boolean, 
  user: any,
  setLoading: (loading: boolean) => void,
  setPosts: (posts: any[]) => void,
  setHasPostedToday: (hasPosted: boolean) => void,
  setUserStreakCount: (count: number) => void,
  setTopStreaks: (streaks: any[]) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
      checkUserStreak();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
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
      
      // Transform the top streaks data
      const transformedTopStreaks = topStreaksData
        .map(profile => ({
          name: profile.name,
          count: profile.streak_count?.[0]?.streak_count || 0
        }))
        .filter(streak => streak.count > 0);
      
      setTopStreaks(transformedTopStreaks);

    } catch (error) {
      console.error("Error fetching streak posts:", error);
      setPosts([]);
      toast({
        title: "Error",
        description: "Failed to load streak posts. Please try again later.",
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

  return {
    fetchPosts,
    checkUserStreak
  };
};
