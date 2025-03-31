
import { useState, useEffect } from 'react';
import { fetchDiscoverProfiles, recordSwipeAction } from '@/services/discover';
import { Profile } from '@/utils/dummyData';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import { toast } from 'sonner';

export interface SwipeResult {
  success: boolean;
  isMatch: boolean;
}

export function useDiscoverProfiles(filters: AdvancedFilterOptions) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles based on filters
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const fetchedProfiles = await fetchDiscoverProfiles(filters);
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast("Error loading profiles", {
        description: "Failed to load profiles. Please try again."
      });
    } finally {
      setIsLoading(false);
      setCurrentProfileIndex(0); // Reset index when profiles are reloaded
    }
  };

  // Handle swiping action
  const handleSwipe = async (action: string) => {
    if (!profiles || profiles.length === 0) {
      toast("No profiles available", {
        description: "Please adjust your filters or try again later."
      });
      return;
    }

    const profileId = profiles[currentProfileIndex]?.id;

    if (!profileId) {
      toast("Error", {
        description: "Profile ID is missing."
      });
      return;
    }

    try {
      const result = await recordSwipeAction(profileId, action);
      if (result.success) {
        if (result.isMatch) {
          toast("It's a Match!", {
            description: "You and this person have liked each other!"
          });
        }
        goToNextProfile();
      } else {
        toast("Swipe failed", {
          description: "Failed to record swipe action. Please try again."
        });
      }
    } catch (error) {
      console.error("Error recording swipe action:", error);
      toast("Swipe failed", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  // Go to the next profile
  const goToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      toast("No more profiles", {
        description: "You've reached the end of available profiles. Check back later!"
      });
    }
  };

  // Effect to load profiles when filters change
  useEffect(() => {
    loadProfiles();
  }, [JSON.stringify(filters)]); // Use JSON.stringify to avoid infinite loops

  return {
    profiles,
    currentProfileIndex,
    isLoading,
    currentProfile: profiles && profiles.length > 0 ? profiles[currentProfileIndex] : null,
    handleSwipe,
    loadProfiles
  };
}
