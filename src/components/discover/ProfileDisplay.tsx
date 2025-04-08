
import React, { useState, useEffect } from 'react';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchVisibleProfileImages } from '@/services/profiles/media';

interface ProfileDisplayProps {
  profile: Profile | null;
  isLoading: boolean;
  onSwipe: (profileId: string, direction: string) => void;
  onOpenFilters: () => void;
  filterCount: number;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  profile,
  isLoading,
  onSwipe,
  onOpenFilters,
  filterCount
}) => {
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load visible profile images when profile changes
  useEffect(() => {
    const loadProfileImages = async () => {
      if (profile?.id) {
        try {
          const images = await fetchVisibleProfileImages(profile.id);
          if (images.length > 0) {
            setProfileImages(images);
          } else {
            // If no visible images were found, fall back to the default ones
            setProfileImages(profile.images || []);
          }
        } catch (error) {
          console.error("Error loading profile images:", error);
          // Fall back to profile.images on error
          setProfileImages(profile.images || []);
        }
      }
    };
    
    loadProfileImages();
  }, [profile]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">
        <p className="text-white">Loading profiles...</p>
      </div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-48">
        <p className="text-white">No profiles found with the current filters.</p>
      </div>;
  }

  const handleSwipe = (direction: string) => {
    if (profile && profile.id) {
      onSwipe(profile.id, direction);
    }
  };

  const handleMessageClick = () => {
    // In a real app, you would check if there's a match first
    // For now, we'll simulate by checking if the profile is verified
    if (profile.verified) {
      // Option 1: Show inline chat overlay
      setShowChatOverlay(true);
    } else {
      toast("Can't message yet", {
        description: "You can only message users after you've matched with them."
      });
    }
  };

  // Create a profile with the loaded images or fallback
  const profileWithImages = {
    ...profile,
    images: profileImages.length > 0 
      ? profileImages 
      : ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1964&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?q=80&w=1964&auto=format&fit=crop']
  };

  return <>
      <ProfileCard profile={profileWithImages} onSwipe={handleSwipe} />
      
      <SwipeButtons 
        onSwipe={handleSwipe} 
        onMessageClick={handleMessageClick} 
        matchId={profile.verified ? profile.id : undefined} 
        onSuperLike={() => {
          toast("Super Like!", {
            description: "You've used a Super Like on this profile!"
          });
          handleSwipe('right'); // Treat super like as a right swipe for now
        }} 
        onRewind={() => {
          toast("Rewind feature", {
            description: "Premium feature: Go back to previous profile"
          });
        }} 
        onBoost={() => {
          toast("Boost feature", {
            description: "Premium feature: Get more visibility for 30 minutes"
          });
        }} 
      />
      
      {showChatOverlay && 
        <InlineChatOverlay 
          matchId={profile.id} 
          matchName={profile.name} 
          onClose={() => setShowChatOverlay(false)} 
        />
      }
    </>;
};

export default ProfileDisplay;
