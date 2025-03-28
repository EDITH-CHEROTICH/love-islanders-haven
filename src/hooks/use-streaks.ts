
import { useAuth } from "@/context/auth";
import { useStreaksState } from "./streaks/use-streaks-state";
import { useStreaksData } from "./streaks/use-streaks-data";
import { useStreaksActions } from "./streaks/use-streaks-actions";

/**
 * Main streaks hook that combines state, data fetching, and actions
 */
export const useStreaks = () => {
  const { isAuthenticated, user } = useAuth();
  
  // State management
  const {
    loading,
    setLoading,
    posts,
    setPosts,
    hasPostedToday,
    setHasPostedToday,
    userStreakCount,
    setUserStreakCount,
    topStreaks,
    setTopStreaks
  } = useStreaksState();

  // Data fetching
  const { fetchPosts, checkUserStreak } = useStreaksData(
    isAuthenticated,
    user,
    setLoading,
    setPosts,
    setHasPostedToday,
    setUserStreakCount,
    setTopStreaks
  );

  // Actions
  const { handlePostSubmit, handleLikePost } = useStreaksActions(
    user,
    userStreakCount,
    posts,
    setPosts,
    setHasPostedToday,
    setUserStreakCount
  );

  return {
    loading,
    posts,
    hasPostedToday,
    userStreakCount,
    topStreaks,
    handlePostSubmit,
    handleLikePost,
    fetchPosts,
    checkUserStreak
  };
};

export default useStreaks;
