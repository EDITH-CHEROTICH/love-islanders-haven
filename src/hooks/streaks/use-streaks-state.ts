
import { useState } from "react";
import { StreakPost } from "@/components/streaks/types";
import { getDummyTopStreaks } from "./mock-data";

/**
 * Custom hook to manage streaks state
 */
export const useStreaksState = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [userStreakCount, setUserStreakCount] = useState(0);
  const [topStreaks, setTopStreaks] = useState(getDummyTopStreaks());

  return {
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
  };
};
