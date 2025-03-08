
import { Heart, X } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeButtons = ({ onSwipe }: SwipeButtonsProps) => {
  return (
    <div className="flex justify-center gap-8 mt-6 pb-20">
      <button 
        onClick={() => onSwipe('left')}
        className="btn-dislike w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-[#FF5864]/20 shadow-lg transition-all"
        aria-label="Dislike"
      >
        <X className="text-[#FF5864] w-8 h-8" />
      </button>
      
      <button 
        onClick={() => onSwipe('right')}
        className="btn-like w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-love/20 shadow-lg transition-all"
        aria-label="Like"
      >
        <Heart className="text-love w-8 h-8" />
      </button>
    </div>
  );
};

export default SwipeButtons;
