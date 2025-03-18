
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
    <div className="min-h-screen bg-black pb-20">
      <div className="page-container hide-scrollbar">
        <main className="h-full">
          <div className="flex flex-col items-center h-full">
            <div className="w-full h-[calc(100vh-160px)] relative">
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
