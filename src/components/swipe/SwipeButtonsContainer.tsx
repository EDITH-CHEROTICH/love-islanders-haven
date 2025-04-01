
import React from 'react';
import { Heart, X, Star, MessageCircle, RefreshCcw } from 'lucide-react';
import SwipeButton from './SwipeButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const navigate = useNavigate();

  const handleMessageClick = () => {
    if (matchId) {
      // If there's a match, use the provided onMessageClick or navigate to chat
      if (onMessageClick) {
        onMessageClick();
      } else {
        navigate(`/messages/${matchId}`);
      }
    } else {
      toast("Can't message yet", {
        description: "You can only message profiles after you've matched with them."
      });
    }
  };

  return (
    <div className="flex justify-center gap-3 mt-4 pb-16">
      <SwipeButton
        onClick={onRewind}
        icon={RefreshCcw}
        color="yellow-500"
        size="sm"
        ariaLabel="Rewind"
      />
      
      <SwipeButton
        onClick={() => onSwipe && onSwipe('left')}
        icon={X}
        color="rose-500"
        size="md"
        ariaLabel="Dislike"
      />
      
      <SwipeButton
        onClick={onSuperLike}
        icon={Star}
        color="blue-500"
        size="sm"
        ariaLabel="Super Like"
      />
      
      <SwipeButton
        onClick={() => onSwipe && onSwipe('right')}
        icon={Heart}
        color="green-500"
        size="md"
        ariaLabel="Like"
      />
      
      <SwipeButton
        onClick={handleMessageClick}
        icon={MessageCircle}
        color="purple-500"
        size="sm"
        ariaLabel="Messages"
      />
    </div>
  );
};

export default SwipeButtonsContainer;
