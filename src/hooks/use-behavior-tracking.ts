
import { useState, useEffect } from 'react';
import { Profile } from '@/utils/dummyData';
import { supabase } from "@/integrations/supabase/client";

// This hook would normally fetch data from the backend
export const useBehaviorTracking = (userId?: string) => {
  const [behaviorData, setBehaviorData] = useState<{
    likedProfiles: Profile[];
    dislikedProfiles: Profile[];
    messagePatterns: any[];
    lastActive: Date;
  }>({
    likedProfiles: [],
    dislikedProfiles: [],
    messagePatterns: [],
    lastActive: new Date(),
  });

  // Track a user action
  const trackAction = (
    profileId: string, 
    action: 'like' | 'dislike' | 'superlike' | 'match' | 'message',
    profile?: Profile
  ) => {
    // Demo implementation - in a real app, this would update the database
    if (action === 'like' && profile) {
      setBehaviorData(prev => ({
        ...prev,
        likedProfiles: [...prev.likedProfiles, profile],
      }));
    } else if (action === 'dislike' && profile) {
      setBehaviorData(prev => ({
        ...prev,
        dislikedProfiles: [...prev.dislikedProfiles, profile],
      }));
    }
    
    // Update last active timestamp
    setBehaviorData(prev => ({
      ...prev,
      lastActive: new Date(),
    }));
    
    console.log(`Tracked action: ${action} on profile ${profileId}`);
  };
  
  // Load behavior data from storage or API
  useEffect(() => {
    const loadBehaviorData = async () => {
      if (!userId) return;
      
      try {
        // In a real app, this would fetch from the database
        console.log('Would load behavior data for user:', userId);
        
        // Demo: Check if we have data in localStorage (just for demonstration)
        const savedData = localStorage.getItem(`behavior_${userId}`);
        if (savedData) {
          try {
            setBehaviorData(JSON.parse(savedData));
          } catch (e) {
            console.error('Error parsing saved behavior data');
          }
        }
      } catch (error) {
        console.error('Error loading behavior data:', error);
      }
    };
    
    loadBehaviorData();
  }, [userId]);
  
  // Save behavior data when it changes
  useEffect(() => {
    if (!userId) return;
    
    // Save to localStorage (demo only)
    localStorage.setItem(`behavior_${userId}`, JSON.stringify(behaviorData));
    
    // In a real app, we would sync with the database
  }, [behaviorData, userId]);
  
  return {
    behaviorData,
    trackAction,
  };
};
