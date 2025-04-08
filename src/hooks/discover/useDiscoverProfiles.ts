
import { useState, useEffect } from "react";
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from "@/services/discover";
import { useAuth } from "@/context/auth";

export const useDiscoverProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const { user } = useAuth();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await fetchDiscoverProfiles(filters);
      setProfiles(data);
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

  const handleSwipe = async (profileId: string, direction: 'like' | 'pass') => {
    if (!user?.id) return;

    try {
      await recordSwipeAction(user.id, profileId, direction);
      
      // Remove swiped profile from the list
      setProfiles((prevProfiles) => 
        prevProfiles.filter(profile => profile.id !== profileId)
      );
    } catch (err) {
      console.error("Error recording swipe:", err);
    }
  };

  return {
    profiles,
    loading,
    error,
    filters,
    setFilters,
    refreshProfiles: fetchProfiles,
    handleSwipe
  };
};

export default useDiscoverProfiles;
