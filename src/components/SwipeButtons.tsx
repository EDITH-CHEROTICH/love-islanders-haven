
import React from 'react';
import { Heart, X, Star, MessageCircle, RefreshCcw } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
  onSuperLike?: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
}

const SwipeButtons = ({ 
  onSwipe, 
  onSuperLike = () => {}, 
  onRewind = () => {}, 
  onBoost = () => {} 
}: SwipeButtonsProps) => {
  return (
    <div className="flex justify-center gap-3 mt-4 pb-16">
      <button 
        onClick={onRewind} 
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-yellow-500/20 shadow-lg transition-all"
        aria-label="Rewind"
      >
        <RefreshCcw className="text-yellow-500 w-7 h-7" />
      </button>
      
      <button 
        onClick={() => onSwipe('left')}
        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-rose-500/20 shadow-lg transition-all"
        aria-label="Dislike"
      >
        <X className="text-rose-500 w-7 h-7" />
      </button>
      
      <button 
        onClick={onSuperLike} 
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-blue-500/20 shadow-lg transition-all"
        aria-label="Super Like"
      >
        <Star className="text-blue-500 w-7 h-7" />
      </button>
      
      <button 
        onClick={() => onSwipe('right')}
        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-green-500/20 shadow-lg transition-all"
        aria-label="Like"
      >
        <Heart className="text-green-500 w-7 h-7" />
      </button>
      
      <button 
        onClick={onBoost} 
        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-purple-500/20 shadow-lg transition-all"
        aria-label="Boost"
      >
        <MessageCircle className="text-purple-500 w-7 h-7" />
      </button>
    </div>
  );
};

export default SwipeButtons;
