
import { useState, useRef, useEffect } from 'react';
import { Profile } from '../utils/dummyData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Check, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Heart,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

const ProfileCard = ({ profile, onSwipe }: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  // If profile has no images, use placeholder images
  const images = profile.images && profile.images.length > 0 
    ? profile.images 
    : [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
      ];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
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

  const handleSendComment = () => {
    if (comment.trim()) {
      toast.success("Comment sent!");
      setComment('');
      setShowCommentInput(false);
    }
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
        {/* Show carousel for multiple images or single image */}
        {images.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {images.map((image, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div className="h-full w-full">
                    <img 
                      src={image} 
                      alt={`${profile.name} photo ${idx+1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-8 w-8 bg-black/20 text-white absolute" />
            <CarouselNext className="right-2 h-8 w-8 bg-black/20 text-white absolute" />
          </Carousel>
        ) : (
          <img 
            src={images[0]} 
            alt={profile.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        
        {/* Direction indicators for swiping */}
        {offsetX > 50 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500/70 rounded-full p-4">
              <Heart size={40} className="text-white" />
            </div>
          </div>
        )}
        
        {offsetX < -50 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-rose-500/70 rounded-full p-4">
              <X size={40} className="text-white" />
            </div>
          </div>
        )}
        
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 rounded-full bg-white/20 text-white placeholder:text-white/50 focus:outline-none"
              />
              <button 
                onClick={handleSendComment}
                className="bg-love hover:bg-love-dark text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        )}
        
        {/* More info panel */}
        {showMoreInfo && (
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm p-6 overflow-y-auto"
            onClick={toggleMoreInfo}
          >
            <div className="text-white space-y-4">
              <h2 className="text-2xl font-bold flex items-center">
                {profile.name}
                <span className="ml-2">{profile.age}</span>
                {profile.verified && (
                  <div className="bg-blue-500 rounded-full p-0.5 ml-2">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </h2>
              
              {profile.location && (
                <div className="flex items-center text-white/80">
                  <MapPin size={16} className="mr-2" />
                  {profile.location}
                </div>
              )}
              
              {profile.occupation && (
                <div className="flex items-center text-white/80">
                  <Briefcase size={16} className="mr-2" />
                  {profile.occupation}
                </div>
              )}
              
              {profile.education && (
                <div className="flex items-center text-white/80">
                  <GraduationCap size={16} className="mr-2" />
                  {profile.education}
                </div>
              )}
              
              {profile.bio && (
                <div>
                  <h3 className="text-sm uppercase text-white/60 mb-1">About me</h3>
                  <p className="text-white/90">{profile.bio}</p>
                </div>
              )}
              
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase text-white/60 mb-1">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {profile.relationshipGoal && (
                  <div>
                    <h3 className="text-xs uppercase text-white/60 mb-1">Looking for</h3>
                    <p className="text-white/90 capitalize">{profile.relationshipGoal.replace('-', ' ')}</p>
                  </div>
                )}
                
                {profile.heightCm && (
                  <div>
                    <h3 className="text-xs uppercase text-white/60 mb-1">Height</h3>
                    <p className="text-white/90">
                      {profile.heightCm} cm
                      {profile.height ? ` (${profile.height} ${profile.heightUnit || 'ft'})` : ''}
                    </p>
                  </div>
                )}
                
                {profile.hasChildren !== undefined && (
                  <div>
                    <h3 className="text-xs uppercase text-white/60 mb-1">Children</h3>
                    <p className="text-white/90">
                      {profile.hasChildren ? 
                        (profile.childrenCount ? `${profile.childrenCount} children` : 'Has children') : 
                        'No children'}
                    </p>
                  </div>
                )}
                
                {profile.hasPets !== undefined && (
                  <div>
                    <h3 className="text-xs uppercase text-white/60 mb-1">Pets</h3>
                    <p className="text-white/90">
                      {profile.hasPets ? 
                        (profile.petType ? `Has ${profile.petType}` : 'Has pets') : 
                        'No pets'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
          
          {profile.location && (
            <div className="flex items-center text-white/80 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {profile.location}
            </div>
          )}
          
          <div className="mt-2">
            <h3 className="text-white/80 text-sm">Interests</h3>
            <div className="flex flex-wrap mt-1 gap-2">
              {profile.interests && profile.interests.slice(0, 5).map((interest, i) => (
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
