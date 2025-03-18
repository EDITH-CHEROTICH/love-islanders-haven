
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { profiles } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import { sortProfilesByCompatibility, trackUserFeedback } from '@/services/recommendations';
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { supabase } from "@/integrations/supabase/client";

const Discover = () => {
  const { toast } = useToast();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<{[key: string]: 'left' | 'right'}>({});
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [sortedProfiles, setSortedProfiles] = useState(profiles);
  
  // Get user behavior data
  const { behaviorData, trackAction } = useBehaviorTracking(userId);
  
  // Get user preferences
  const { preferences } = useUserPreferences();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id);
    };
    
    checkAuth();
  }, []);

  // Sort profiles based on compatibility
  useEffect(() => {
    const optimizedProfiles = sortProfilesByCompatibility(
      profiles,
      preferences,
      behaviorData
    );
    
    setSortedProfiles(optimizedProfiles);
  }, [preferences, behaviorData]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentProfile = sortedProfiles[currentProfileIndex];
    
    // Store the swipe direction for the current profile
    setSwipedProfiles(prev => ({
      ...prev,
      [currentProfile.id]: direction
    }));

    // Track user behavior
    trackAction(
      currentProfile.id, 
      direction === 'right' ? 'like' : 'dislike',
      currentProfile
    );
    
    // Track in recommendation system
    trackUserFeedback(
      userId,
      currentProfile.id,
      direction === 'right' ? 'like' : 'dislike'
    );

    // If swiped right (like), show a match notification
    if (direction === 'right') {
      toast({
        title: "It's a match!",
        description: `You matched with ${currentProfile.name}!`,
      });
      
      // In a real app, we would check if this is a mutual match
      // and then create a match in the database
    }

    // Move to the next profile if available
    if (currentProfileIndex < sortedProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      // Reset to first profile for demo purposes
      toast({
        description: "You've seen all profiles. Starting over!",
      });
      setCurrentProfileIndex(0);
      setSwipedProfiles({});
    }
  }, [currentProfileIndex, sortedProfiles, toast, trackAction, userId]);

  const handleSuperLike = useCallback(() => {
    const currentProfile = sortedProfiles[currentProfileIndex];
    
    // Track superlike in behavior data
    trackAction(currentProfile.id, 'superlike', currentProfile);
    
    // Track in recommendation system
    trackUserFeedback(userId, currentProfile.id, 'superlike');
    
    toast({
      title: "Super Like Sent!",
      description: `You super liked ${currentProfile.name}!`,
    });
    
    // Move to next profile
    if (currentProfileIndex < sortedProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      toast({
        description: "You've seen all profiles. Starting over!",
      });
      setCurrentProfileIndex(0);
      setSwipedProfiles({});
    }
  }, [currentProfileIndex, sortedProfiles, toast, trackAction, userId]);

  const currentProfile = sortedProfiles[currentProfileIndex];
  
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
            
            <SwipeButtons 
              onSwipe={handleSwipe} 
              onSuperLike={handleSuperLike}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discover;
