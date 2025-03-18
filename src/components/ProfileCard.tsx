
import { useState, useRef, useEffect } from 'react';
import { Profile } from '../utils/dummyData';
import { ChevronLeft, ChevronRight, Info, Check } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = ({ profile, onSwipe }: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

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
    } else if (offsetX < -threshold) {
      onSwipe('left');
    }
    
    setIsSwiping(false);
    setOffsetX(0);
  };

  const cardStyle = {
    transform: isSwiping ? `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` : 'translateX(0) rotate(0)',
  };

  return (
    <div 
      ref={cardRef}
      className="absolute inset-0 overflow-hidden rounded-xl shadow-xl"
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
        <img 
          src={profile.images[currentImageIndex]} 
          alt={profile.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Image pagination indicator */}
        {profile.images.length > 1 && (
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2">
            {profile.images.map((_, index) => (
              <div 
                key={index} 
                className={`h-1 rounded-full ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/30 w-4'}`}
              />
            ))}
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="absolute inset-y-0 left-0 w-1/4" onClick={handlePrevImage}>
          {currentImageIndex > 0 && (
            <div className="h-full flex items-center justify-start pl-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20">
                <ChevronLeft size={24} className="text-white" />
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute inset-y-0 right-0 w-1/4" onClick={handleNextImage}>
          {currentImageIndex < profile.images.length - 1 && (
            <div className="h-full flex items-center justify-end pr-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20">
                <ChevronRight size={24} className="text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Activity status */}
        {profile.activityStatus && (
          <div className="absolute top-6 left-4">
            <div className="bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              {profile.activityStatus}
            </div>
          </div>
        )}
        
        {/* Profile info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-6 px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">
              {profile.name}
              <span className="ml-2">{profile.age}</span>
            </h2>
            
            {profile.verified && (
              <div className="bg-blue-500 rounded-full p-0.5">
                <Check size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="mt-1">
            <h3 className="text-white/80 text-sm">Interests</h3>
            <div className="flex flex-wrap mt-1 gap-2">
              {profile.interests.slice(0, 5).map((interest, i) => (
                <span 
                  key={i} 
                  className="bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
