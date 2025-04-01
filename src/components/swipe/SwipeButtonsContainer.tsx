import React from 'react';
import { Heart, X, Star, MessageCircle, RefreshCcw } from 'lucide-react';
import SwipeButton from './SwipeButton';
interface SwipeButtonsContainerProps {
  onSwipe?: (direction: 'left' | 'right') => void;
  onSuperLike?: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
  matchId?: string;
  onMessageClick?: () => void;
}
const SwipeButtonsContainer = ({
  onSwipe,
  onSuperLike = () => {},
  onRewind = () => {},
  onBoost = () => {},
  matchId,
  onMessageClick
}: SwipeButtonsContainerProps) => {
  return <div className="flex justify-center gap-3 mt-4 pb-16 my-[15px] mx-[172px] px-[41px] py-[6px]">
      <SwipeButton onClick={onRewind} icon={RefreshCcw} color="yellow-500" size="sm" ariaLabel="Rewind" />
      
      <SwipeButton onClick={() => onSwipe && onSwipe('left')} icon={X} color="rose-500" size="md" ariaLabel="Dislike" />
      
      <SwipeButton onClick={onSuperLike} icon={Star} color="blue-500" size="sm" ariaLabel="Super Like" />
      
      <SwipeButton onClick={() => onSwipe && onSwipe('right')} icon={Heart} color="green-500" size="md" ariaLabel="Like" />
      
      <SwipeButton onClick={onMessageClick} icon={MessageCircle} color="purple-500" size="sm" ariaLabel="Messages" />
    </div>;
};
export default SwipeButtonsContainer;