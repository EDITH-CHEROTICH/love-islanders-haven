
import { useState, useRef } from 'react';
import { Profile } from '../utils/dummyData';
import { Info, MessageCircle, Heart, X } from 'lucide-react';
import { toast } from 'sonner';
import ProfileImageCarousel from './profile/ProfileImageCarousel';
import ProfileInfoPanel from './profile/ProfileInfoPanel';
import ProfileCommentInput from './profile/ProfileCommentInput';
import ProfileBottomInfo from './profile/ProfileBottomInfo';
import SwipeIndicator from './profile/SwipeIndicator';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = ({ profile, onSwipe }: ProfileCardProps) => {
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // If profile has no images, use placeholder images
  const images = profile.images && profile.images.length > 0 
    ? profile.images 
    : [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
      ];

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwiping) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newOffsetX = clientX - startX;
    setOffsetX(newOffsetX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const threshold = 100;
    if (offsetX > threshold) {
      onSwipe('right');
      toast("Liked!", { 
        icon: <Heart className="h-5 w-5 text-green-500" />,
        description: `You liked ${profile.name}'s profile!`
      });
    } else if (offsetX < -threshold) {
      onSwipe('left');
      toast("Passed", { 
        icon: <X className="h-5 w-5 text-rose-500" />,
        description: `You passed on ${profile.name}'s profile.`
      });
    }
    
    setIsSwiping(false);
    setOffsetX(0);
  };

  const toggleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreInfo(!showMoreInfo);
  };

  const toggleCommentInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCommentInput(!showCommentInput);
  };

  const cardStyle = {
    transform: isSwiping ? `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` : 'translateX(0) rotate(0)',
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-full max-w-md mx-auto h-[70vh] overflow-hidden rounded-xl shadow-xl bg-black/10"
      style={cardStyle}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-full w-full">
        {/* Image Carousel */}
        <ProfileImageCarousel images={images} name={profile.name} />
        
        {/* Swipe Indicator (like/dislike) */}
        <SwipeIndicator offsetX={offsetX} />
        
        {/* More info button */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleMoreInfo}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm"
            aria-label="More information"
          >
            <Info size={18} className="text-white" />
          </button>
        </div>
        
        {/* Comment button */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={toggleCommentInput}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm"
            aria-label="Add comment"
          >
            <MessageCircle size={18} className="text-white" />
          </button>
        </div>
        
        {/* Comment input overlay */}
        {showCommentInput && (
          <ProfileCommentInput onClose={() => setShowCommentInput(false)} />
        )}
        
        {/* More info panel */}
        {showMoreInfo && (
          <ProfileInfoPanel profile={profile} onClose={toggleMoreInfo} />
        )}
        
        {/* Activity status */}
        {profile.activityStatus && (
          <div className="absolute top-6 left-4">
            <div className="bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              {profile.activityStatus}
            </div>
          </div>
        )}
        
        {/* Profile info at bottom */}
        <ProfileBottomInfo profile={profile} />
      </div>
    </div>
  );
};

export default ProfileCard;
