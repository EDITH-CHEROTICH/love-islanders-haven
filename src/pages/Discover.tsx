
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SwipeButtons from '@/components/SwipeButtons';
import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import AdvancedFilters from '@/components/discover/AdvancedFilters';
import NotificationBell from '@/components/NotificationBell';

// Import mock profiles from utils
import { profiles } from '@/utils/dummyData';

const Discover = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  
  const handleSwipe = (direction: 'left' | 'right') => {
    // Skip animation if we're at the last profile
    if (currentProfileIndex >= profiles.length - 1) {
      toast({
        title: "End of profiles",
        description: "You've seen all available profiles for now",
      });
      return;
    }

    setIsAnimating(true);
    
    // Simulate API call to record swipe
    setTimeout(() => {
      if (direction === 'right') {
        toast({
          title: "Liked",
          description: `You liked ${profiles[currentProfileIndex].name}`,
          variant: "default",
        });
      }
      
      setCurrentProfileIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSuperLike = () => {
    if (currentProfileIndex >= profiles.length - 1) {
      toast({
        title: "End of profiles",
        description: "You've seen all available profiles for now",
      });
      return;
    }

    toast({
      title: "Super Like",
      description: `You super liked ${profiles[currentProfileIndex].name}`,
      variant: "default",
    });
    
    // Move to next profile after super like
    setCurrentProfileIndex(prev => prev + 1);
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
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // Here you would typically call an API to fetch filtered profiles
    // For now we'll just show a toast
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
          <div className="max-w-md mx-auto h-[calc(100vh-300px)] min-h-[500px] relative">
            {profiles.map((profile, index) => (
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
            ))}
            
            {currentProfileIndex >= profiles.length && (
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
        </main>
      </div>
    </div>
  );
};

export default Discover;
