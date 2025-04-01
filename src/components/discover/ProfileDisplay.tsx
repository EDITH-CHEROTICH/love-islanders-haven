
import React, { useState } from 'react';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';

interface ProfileDisplayProps {
  profile: Profile | null;
  isLoading: boolean;
  onSwipe: (direction: string) => void;
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
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-white">Loading profiles...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-white">No profiles found with the current filters.</p>
      </div>
    );
  }

  const handleMessageClick = () => {
    // In a real app, you would check if there's a match first
    // For now, we'll simulate by checking if the profile is verified
    if (profile.verified) {
      // This is a placeholder - in a real app, you would use the actual match ID
      const simulatedMatchId = profile.id;
      
      // Option 1: Navigate to messages page
      navigate(`/messages/${simulatedMatchId}`);
      
      // Option 2: Show inline chat overlay
      // setShowChatOverlay(true);
    } else {
      toast("Can't message yet", {
        description: "You can only message users after you've matched with them."
      });
    }
  };

  // Ensure we have images for the profile
  const profileWithImages = {
    ...profile,
    images: profile.images && profile.images.length > 0 
      ? profile.images 
      : [
          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1964&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?q=80&w=1964&auto=format&fit=crop'
        ]
  };

  return (
    <>
      <ProfileCard profile={profileWithImages} onSwipe={onSwipe} />
      <div className="flex items-center justify-center space-x-2 mt-4 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onOpenFilters}
        >
          <Sliders className="h-4 w-4" />
          <span>Filters</span>
          {filterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
              {filterCount}
            </Badge>
          )}
        </Button>
      </div>
      <SwipeButtons 
        onSwipe={onSwipe} 
        onMessageClick={handleMessageClick}
        matchId={profile.verified ? profile.id : undefined}
        onSuperLike={() => {
          toast("Super Like!", {
            description: "You've used a Super Like on this profile!"
          });
          onSwipe('right'); // Treat super like as a right swipe for now
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
      
      {showChatOverlay && (
        <InlineChatOverlay 
          matchId={profile.id} 
          matchName={profile.name} 
          onClose={() => setShowChatOverlay(false)} 
        />
      )}
    </>
  );
};

export default ProfileDisplay;
