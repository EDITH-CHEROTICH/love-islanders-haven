
import { Heart, X, Star, Send, RefreshCcw } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeButtons = ({ onSwipe }: SwipeButtonsProps) => {
  return (
    <div className="flex justify-center gap-3 mt-4 pb-16">
      <button 
        onClick={() => {}} // Rewind functionality (placeholder)
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-yellow-500/20 shadow-lg transition-all"
        aria-label="Rewind"
      >
        <RefreshCcw className="text-yellow-500 w-6 h-6" />
      </button>
      
      <button 
        onClick={() => onSwipe('left')}
        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-rose-500/20 shadow-lg transition-all"
        aria-label="Dislike"
      >
        <X className="text-rose-500 w-8 h-8" />
      </button>
      
      <button 
        onClick={() => {}} // Super like functionality (placeholder)
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-blue-500/20 shadow-lg transition-all"
        aria-label="Super Like"
      >
        <Star className="text-blue-500 w-6 h-6" />
      </button>
      
      <button 
        onClick={() => onSwipe('right')}
        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-green-500/20 shadow-lg transition-all"
        aria-label="Like"
      >
        <Heart className="text-green-500 w-8 h-8" />
      </button>
      
      <button 
        onClick={() => {}} // Boost functionality (placeholder)
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-purple-500/20 shadow-lg transition-all"
        aria-label="Boost"
      >
        <Send className="text-cyan-500 w-6 h-6 rotate-45" />
      </button>
    </div>
  );
};

export default SwipeButtons;
