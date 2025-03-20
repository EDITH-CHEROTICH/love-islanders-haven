
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SwipeButtons from '@/components/SwipeButtons';
import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import AdvancedFilters from '@/components/discover/AdvancedFilters';
import NotificationBell from '@/components/NotificationBell';
import { fetchDiscoverProfiles, recordSwipeAction } from '@/services/discover';
import { Profile } from '@/utils/dummyData';
import { trackUserFeedback } from '@/services/recommendations';
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking';

const Discover = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    ageRange: [18, 50] as [number, number],
    distance: 50,
    height: [150, 210] as [number, number],
    relationshipGoals: [],
    hasChildren: null,
    hasPets: null,
    smoking: null,
    education: null,
    occupation: null,
    interests: [],
  });
  
  const { data: { user } } = supabase.auth.getSession() || { data: { user: null } };
  const { trackAction } = useBehaviorTracking(user?.id);
  
  // Fetch profiles when component mounts or filters change
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const fetchedProfiles = await fetchDiscoverProfiles(filters);
        setProfiles(fetchedProfiles);
        setCurrentProfileIndex(0);
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast({
          title: "Error loading profiles",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, [filters, toast]);
  
  const handleSwipe = async (direction: 'left' | 'right') => {
    // Skip animation if we're at the last profile
    if (currentProfileIndex >= profiles.length - 1 && profiles.length > 0) {
      toast({
        title: "End of profiles",
        description: "You've seen all available profiles for now",
      });
      return;
    }
    
    if (profiles.length === 0) {
      return;
    }
    
    const currentProfile = profiles[currentProfileIndex];
    setIsAnimating(true);
    
    try {
      // Record swipe action in database
      const action = direction === 'right' ? 'like' : 'dislike';
      const result = await recordSwipeAction(currentProfile.id, action);
      
      // Track user behavior for recommendations
      trackAction(currentProfile.id, action, currentProfile);
      
      // For recommendations algorithm learning
      trackUserFeedback(user?.id, currentProfile.id, action);
      
      if (action === 'like') {
        if (result.isMatch) {
          toast({
            title: "It's a match!",
            description: `You matched with ${currentProfile.name}`,
            variant: "default",
          });
          
          // Optional: Navigate to the match screen or show match dialog
        } else {
          toast({
            title: "Liked",
            description: `You liked ${currentProfile.name}`,
            variant: "default",
          });
        }
      }
      
      // Move to next profile
      setCurrentProfileIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording swipe:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your action",
        variant: "destructive",
      });
    } finally {
      setIsAnimating(false);
    }
  };

  const handleSuperLike = async () => {
    if (currentProfileIndex >= profiles.length - 1 && profiles.length > 0) {
      toast({
        title: "End of profiles",
        description: "You've seen all available profiles for now",
      });
      return;
    }
    
    if (profiles.length === 0) {
      return;
    }
    
    const currentProfile = profiles[currentProfileIndex];
    
    try {
      // Record superlike in database
      const result = await recordSwipeAction(currentProfile.id, 'superlike');
      
      // Track user behavior for recommendations
      trackAction(currentProfile.id, 'superlike', currentProfile);
      
      // For recommendations algorithm learning
      trackUserFeedback(user?.id, currentProfile.id, 'superlike');
      
      if (result.isMatch) {
        toast({
          title: "Super Match!",
          description: `You super-matched with ${currentProfile.name}`,
          variant: "default",
        });
        
        // Optional: Navigate to the match screen or show match dialog
      } else {
        toast({
          title: "Super Like",
          description: `You super liked ${currentProfile.name}`,
          variant: "default",
        });
      }
      
      // Move to next profile
      setCurrentProfileIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording super like:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your action",
        variant: "destructive",
      });
    }
  };

  const handleRewind = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(prev => prev - 1);
      toast({
        description: "Previous profile restored",
      });
    } else {
      toast({
        title: "Cannot rewind",
        description: "No previous profiles to display",
        variant: "destructive",
      });
    }
  };

  const handleBoost = () => {
    toast({
      title: "Boost activated",
      description: "Your profile will be shown to more people for the next 30 minutes",
      variant: "default",
    });
    
    // In a real app, we would call a function to implement the boost
    // For now, this is just UI feedback
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    toast({
      title: "Filters applied",
      description: "Your preferences have been updated",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container">
        <header className="flex items-center justify-between p-4">
          <div className="text-xl font-bold text-gradient">Discover</div>
          <div className="flex items-center space-x-2">
            <AdvancedFilters 
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
            <NotificationBell />
          </div>
        </header>
        
        <main className="pt-4 pb-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-[calc(100vh-300px)] min-h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-love"></div>
            </div>
          ) : (
            <>
              <div className="max-w-md mx-auto h-[calc(100vh-300px)] min-h-[500px] relative">
                {profiles.length > 0 ? (
                  profiles.map((profile, index) => (
                    <div 
                      key={profile.id} 
                      className={`absolute inset-0 transition-all duration-300 ${
                        index === currentProfileIndex ? 'opacity-100 z-10' :
                        index < currentProfileIndex ? 'opacity-0 -translate-x-full' :
                        'opacity-0 translate-x-full'
                      }`}
                    >
                      <ProfileCard 
                        profile={profile} 
                        onSwipe={handleSwipe} 
                      />
                    </div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-island rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">No profiles found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search criteria to discover more people.
                    </p>
                    <button 
                      className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
                      onClick={() => setFilters({
                        ...filters,
                        ageRange: [18, 50],
                        distance: 100,
                        relationshipGoals: [],
                        hasChildren: null,
                        hasPets: null,
                      })}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
                
                {currentProfileIndex >= profiles.length && profiles.length > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-island rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">That's everyone for now!</h2>
                    <p className="text-muted-foreground mb-6">
                      Check back later to discover more people, or expand your search criteria.
                    </p>
                    <button 
                      className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
                      onClick={() => setCurrentProfileIndex(0)}
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>
              
              <SwipeButtons 
                onSwipe={handleSwipe}
                onSuperLike={handleSuperLike}
                onRewind={handleRewind}
                onBoost={handleBoost}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Discover;
