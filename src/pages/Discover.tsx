
import React, { useState, useEffect } from 'react';
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from '@/services/discover';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import { Button } from '@/components/ui/button';
import { Sliders } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import AdvancedFilters, { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

// Update DiscoverFiltersState to match AdvancedFilterOptions
interface DiscoverFiltersState extends AdvancedFilterOptions {
  // No additional properties needed as we're extending the AdvancedFilterOptions type
}

const Discover: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<DiscoverFiltersState>({
    ageRange: [18, 35],
    distance: 50,
    height: [150, 190],
    heightUnit: 'cm',
    relationshipGoals: [],
    hasChildren: null,
    hasPets: null,
    smoking: null,
    education: null,
    occupation: null,
    interests: [],
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadProfiles();
  }, [filters]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const fetchedProfiles = await fetchDiscoverProfiles(filters);
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast({
        title: "Error loading profiles",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setCurrentProfileIndex(0); // Reset index when profiles are reloaded
    }
  };

  const handleSwipe = async (action: string) => {
    if (!profiles || profiles.length === 0) {
      toast({
        title: "No profiles available",
        description: "Please adjust your filters or try again later.",
        variant: "destructive",
      });
      return;
    }

    const profileId = profiles[currentProfileIndex]?.id;

    if (!profileId) {
      toast({
        title: "Error",
        description: "Profile ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await recordSwipeAction(profileId, action);
      if (result.success) {
        if (result.isMatch) {
          toast({
            title: "It's a Match!",
            description: "You and this person have liked each other!",
          });
        }
        goToNextProfile();
      } else {
        toast({
          title: "Swipe failed",
          description: "Failed to record swipe action. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recording swipe action:", error);
      toast({
        title: "Swipe failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      toast({
        title: "No more profiles",
        description: "You've reached the end of available profiles. Check back later!",
        variant: "destructive",
      });
    }
  };

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setIsFilterDialogOpen(false);
  };

  const applyFilters = (newFilters: AdvancedFilterOptions) => {
    setFilters(newFilters);
    closeFilterDialog();
  };

  const currentProfile = profiles && profiles.length > 0 ? profiles[currentProfileIndex] : null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Discover People</h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-white">Loading profiles...</p>
          </div>
        ) : currentProfile ? (
          <>
            <ProfileCard profile={currentProfile} onSwipe={handleSwipe} />
            <SwipeButtons onSwipe={handleSwipe} />
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-white">No profiles found with the current filters.</p>
          </div>
        )}

        <Button
          onClick={openFilterDialog}
          className="mt-4 bg-love hover:bg-love-dark text-white w-full"
        >
          <Sliders className="mr-2" size={16} />
          Advanced Filters
        </Button>

        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <AdvancedFilters
            onFilterChange={applyFilters}
            activeFilters={filters}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Discover;
