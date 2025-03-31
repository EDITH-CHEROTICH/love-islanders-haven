
import React, { useState, useEffect } from 'react';
import { fetchDiscoverProfiles, recordSwipeAction, DiscoverFilters } from '@/services/discover';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import { Button } from '@/components/ui/button';
import { Sliders } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import AdvancedFilters, { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import EmailVerificationPopup from '@/components/auth/EmailVerificationPopup';
import { supabase } from '@/integrations/supabase/client';

// Update DiscoverFiltersState to match AdvancedFilterOptions
interface DiscoverFiltersState extends AdvancedFilterOptions {
  // No additional properties needed as we're extending the AdvancedFilterOptions type
}

const Discover: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadProfiles();
    checkEmailVerification();
  }, [filters, isAuthenticated]);

  const checkEmailVerification = async () => {
    // First check if user is authenticated
    if (isAuthenticated) {
      try {
        // Check if we have an email in localStorage
        const authContact = localStorage.getItem('authContact');
        
        if (authContact) {
          // Check if this email exists in profiles
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', authContact)
            .maybeSingle();
          
          if (!profile) {
            // If profile doesn't exist, show verification popup
            setShowVerificationPopup(true);
          }
        } else {
          // If no email in localStorage, show verification popup
          setShowVerificationPopup(true);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    }
  };

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const fetchedProfiles = await fetchDiscoverProfiles(filters);
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast("Error loading profiles", {
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
      toast("No profiles available", {
        description: "Please adjust your filters or try again later.",
        variant: "destructive",
      });
      return;
    }

    const profileId = profiles[currentProfileIndex]?.id;

    if (!profileId) {
      toast("Error", {
        description: "Profile ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await recordSwipeAction(profileId, action);
      if (result.success) {
        if (result.isMatch) {
          toast("It's a Match!", {
            description: "You and this person have liked each other!",
          });
        }
        goToNextProfile();
      } else {
        toast("Swipe failed", {
          description: "Failed to record swipe action. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recording swipe action:", error);
      toast("Swipe failed", {
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      toast("No more profiles", {
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

  const handleVerificationComplete = () => {
    setShowVerificationPopup(false);
    // Reload the page to refresh the authentication state
    window.location.reload();
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
        
        {/* Email Verification Popup */}
        <EmailVerificationPopup 
          isOpen={showVerificationPopup}
          onClose={handleVerificationComplete}
        />
      </div>
    </div>
  );
};

export default Discover;
