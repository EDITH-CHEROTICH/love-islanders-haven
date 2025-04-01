
import React, { useState } from 'react';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProfileDisplayProps {
  profile: Profile | null;
  isLoading: boolean;
  onSwipe: (direction: string) => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile, isLoading, onSwipe }) => {
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

  return (
    <>
      <ProfileCard profile={profile} onSwipe={onSwipe} />
      <SwipeButtons 
        onSwipe={onSwipe} 
        onMessageClick={handleMessageClick}
        matchId={profile.verified ? profile.id : undefined}
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
