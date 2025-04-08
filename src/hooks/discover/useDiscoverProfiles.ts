
import { useState, useEffect } from "react";
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from "@/services/discover";
import { useAuth } from "@/context/auth";

export const useDiscoverProfiles = (initialFilters: DiscoverFilters = {}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await fetchDiscoverProfiles(filters);
      setProfiles(data);
      setCurrentProfileIndex(0); // Reset to first profile when loading new profiles
      setError(null);
    } catch (err) {
      setError("Failed to load profiles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [JSON.stringify(filters)]);

  // Get current profile to display
  const currentProfile = profiles.length > 0 ? profiles[currentProfileIndex] : null;

  const handleSwipe = async (profileId: string, direction: 'like' | 'pass') => {
    if (!user?.id) return;

    try {
      await recordSwipeAction(user.id, profileId, direction);
      
      // Move to next profile
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        // We've swiped through all profiles
        // Could fetch more or show an empty state
        setProfiles([]);
      }
    } catch (err) {
      console.error("Error recording swipe:", err);
    }
  };

  return {
    profiles,
    currentProfile,
    loading,
    isLoading: loading,
    error,
    filters,
    setFilters,
    refreshProfiles: fetchProfiles,
    handleSwipe
  };
};

export default useDiscoverProfiles;
