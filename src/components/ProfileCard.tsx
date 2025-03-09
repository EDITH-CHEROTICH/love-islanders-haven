
import { useState, useRef, useEffect } from 'react';
import { Profile } from '../utils/dummyData';
import { ChevronLeft, ChevronRight, Heart, Info, GraduationCap, Briefcase, Ruler } from 'lucide-react';

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

  const formatHeight = (profile: Profile) => {
    if (!profile.height) return null;
    
    if (profile.heightUnit === 'ft') {
      return `${profile.height} ft`;
    } else {
      return `${profile.heightCm} cm`;
    }
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
        
        {/* Enhanced navigation controls */}
        <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start">
          {currentImageIndex > 0 && (
            <button 
              onClick={handlePrevImage}
              className="ml-2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        
        <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end">
          {currentImageIndex < profile.images.length - 1 && (
            <button 
              onClick={handleNextImage}
              className="mr-2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        
        <div className="profile-info">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {profile.name}
                {profile.showAge !== false && profile.age && `, ${profile.age}`}
              </h2>
              <p className="text-sm text-white/80">{profile.location}</p>
            </div>
            <button 
              onClick={toggleDetails}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
            >
              <Info size={20} className="text-white" />
            </button>
          </div>
          
          {/* Additional quick info badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.occupation && (
              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-100 px-2 py-1 rounded-full text-xs">
                <Briefcase size={12} />
                <span>{profile.occupation}</span>
              </div>
            )}
            
            {profile.education && (
              <div className="flex items-center gap-1 bg-purple-500/20 text-purple-100 px-2 py-1 rounded-full text-xs">
                <GraduationCap size={12} />
                <span>{profile.education}</span>
              </div>
            )}
            
            {profile.height && (
              <div className="flex items-center gap-1 bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs">
                <Ruler size={12} />
                <span>{formatHeight(profile)}</span>
              </div>
            )}
          </div>
          
          {showDetails && (
            <div className="mt-3 animate-slide-up">
              <p className="text-sm text-white/90 mb-2">{profile.bio}</p>
              
              {/* Display relationship goal if available */}
              {profile.relationshipGoal && (
                <div className="mt-2">
                  <span className="text-xs bg-love/40 px-2 py-1 rounded-full text-white mr-2">
                    {profile.relationshipGoal === 'long-term' ? 'Looking for: Life-time Partner' :
                     profile.relationshipGoal === 'casual' ? 'Looking for: Casual Fun' : 
                     'Open to Both'}
                  </span>
                </div>
              )}
              
              {/* Display interests */}
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-love/40 px-2 py-1 rounded-full text-white">
                    {interest}
                  </span>
                ))}
              </div>
              
              {/* Children info */}
              {profile.hasChildren && (
                <div className="mt-2 text-xs text-white/90">
                  Has {profile.childrenCount === 1 ? '1 child' : `${profile.childrenCount} children`}
                </div>
              )}
              
              {/* Pet info */}
              {profile.hasPets && profile.petType && (
                <div className="mt-1 text-xs text-white/90">
                  Has {profile.petType.toLowerCase()}
                </div>
              )}
              
              {/* Show videos if available */}
              {profile.videos && profile.videos.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-white/90 mb-2">Videos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.videos.map((video, i) => (
                      <video 
                        key={i}
                        src={video} 
                        controls
                        className="w-full rounded-lg" 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
