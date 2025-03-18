
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { profiles } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';

const Discover = () => {
  const { toast } = useToast();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<{[key: string]: 'left' | 'right'}>({});

  const handleSwipe = (direction: 'left' | 'right') => {
    // Store the swipe direction for the current profile
    setSwipedProfiles({
      ...swipedProfiles,
      [profiles[currentProfileIndex].id]: direction
    });

    // If swiped right (like), show a match notification
    if (direction === 'right') {
      toast({
        title: "It's a match!",
        description: `You matched with ${profiles[currentProfileIndex].name}!`,
      });
    }

    // Move to the next profile if available
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      // Reset to first profile for demo purposes
      toast({
        description: "You've seen all profiles. Starting over!",
      });
      setCurrentProfileIndex(0);
      setSwipedProfiles({});
    }
  };

  const currentProfile = profiles[currentProfileIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">Discover</h1>
        </header>
        
        <main className="container max-w-md mx-auto px-4 pb-20">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm relative">
              {currentProfile && (
                <ProfileCard 
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                />
              )}
            </div>
            
            <SwipeButtons onSwipe={handleSwipe} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discover;
