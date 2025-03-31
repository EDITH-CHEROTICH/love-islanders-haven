
import React from 'react';
import { Profile } from '@/utils/dummyData';
import ProfileCard from '@/components/ProfileCard';
import SwipeButtons from '@/components/SwipeButtons';

interface ProfileDisplayProps {
  profile: Profile | null;
  isLoading: boolean;
  onSwipe: (direction: string) => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile, isLoading, onSwipe }) => {
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

  return (
    <>
      <ProfileCard profile={profile} onSwipe={onSwipe} />
      <SwipeButtons onSwipe={onSwipe} />
    </>
  );
};

export default ProfileDisplay;
