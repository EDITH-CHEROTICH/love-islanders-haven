
import { useState, useEffect } from "react";
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from "@/services/discover";
import { useAuth } from "@/context/auth";
import { saveDiscoverFilters, getDiscoverFilters } from "@/services/profiles/profile-update";
import { useToast } from "@/hooks/use-toast";

export const useDiscoverProfiles = (initialFilters: DiscoverFilters = {}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Load saved filters when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedFilters();
    }
  }, [isAuthenticated]);

  // Load saved filters from Supabase
  const loadSavedFilters = async () => {
    try {
      const savedFilters = await getDiscoverFilters();
      if (savedFilters) {
        setFilters(savedFilters);
        console.log('Loaded saved filters:', savedFilters);
      }
      setFiltersLoaded(true);
    } catch (error) {
      console.error('Error loading saved filters:', error);
      setFiltersLoaded(true);
    }
  };

  // Fetch profiles when filters change or after filters are loaded
  useEffect(() => {
    if (filtersLoaded) {
      fetchProfiles();
    }
  }, [JSON.stringify(filters), filtersLoaded]);

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

  // Handle filter changes with option to save preferences
  const updateFilters = async (newFilters: DiscoverFilters, savePreference: boolean = false) => {
    setFilters(newFilters);
    
    // If savePreference is true and user is authenticated, save filters to Supabase
    if (savePreference && isAuthenticated) {
      try {
        await saveDiscoverFilters(newFilters);
        toast({
          title: "Preferences Saved",
          description: "Your discovery preferences have been saved."
        });
      } catch (error) {
        console.error('Error saving filter preferences:', error);
        toast({
          title: "Save Failed",
          description: "There was an error saving your preferences.",
          variant: "destructive"
        });
      }
    }
  };

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
    setFilters: updateFilters, // Replace with the enhanced function
    refreshProfiles: fetchProfiles,
    handleSwipe
  };
};

export default useDiscoverProfiles;
