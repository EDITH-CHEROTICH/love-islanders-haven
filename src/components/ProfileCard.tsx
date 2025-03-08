
import { useState, useRef, useEffect } from 'react';
import { Profile } from '../utils/dummyData';
import { ChevronLeft, ChevronRight, Heart, Info } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = ({ profile, onSwipe }: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const cardStyle = {
    transform: isSwiping ? `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` : 'translateX(0) rotate(0)',
  };

  return (
    <div 
      ref={cardRef}
      className="card glass-card shadow-xl overflow-hidden animate-pop-in"
      style={cardStyle}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="profile-image-container h-full w-full">
        <img 
          src={profile.images[currentImageIndex]} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
        
        {profile.images.length > 1 && (
          <div className="absolute top-4 w-full px-2">
            <div className="flex gap-1 justify-center">
              {profile.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 rounded-full ${index === currentImageIndex ? 'bg-love w-6' : 'bg-white/50 w-4'} transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        )}
        
        {currentImageIndex > 0 && (
          <button 
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {currentImageIndex < profile.images.length - 1 && (
          <button 
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight size={20} />
          </button>
        )}
        
        <div className="profile-info">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}, {profile.age}</h2>
              <p className="text-sm text-white/80">{profile.location}</p>
            </div>
            <button 
              onClick={toggleDetails}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
            >
              <Info size={20} className="text-white" />
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-3 animate-slide-up">
              <p className="text-sm text-white/90 mb-2">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-love/40 px-2 py-1 rounded-full text-white">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
