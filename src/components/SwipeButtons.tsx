
import React from 'react';
import { Heart, X, MessageCircle, Star, Undo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface SwipeButtonsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onSwipe?: (direction: 'left' | 'right') => void; // Add this new prop
  onSuperLike?: () => void;
  onUndo?: () => void;
  onRewind?: () => void; // Add this prop for backwards compatibility
  onBoost?: () => void; // Add this prop for backwards compatibility
  onMessage?: () => void;
  matchId?: string;
  matchName?: string;
  isMatch?: boolean;
}

const SwipeButtons: React.FC<SwipeButtonsProps> = ({
  onLike,
  onDislike,
  onSwipe,
  onSuperLike,
  onUndo,
  onRewind, // Include the new props
  onBoost,
  onMessage,
  matchId,
  matchName,
  isMatch = false,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle the like action with compatibility for both onLike and onSwipe
  const handleLike = () => {
    if (onLike) {
      onLike();
    }
    if (onSwipe) {
      onSwipe('right');
    }
  };

  // Handle the dislike action with compatibility for both onDislike and onSwipe
  const handleDislike = () => {
    if (onDislike) {
      onDislike();
    }
    if (onSwipe) {
      onSwipe('left');
    }
  };

  // Handle undo with compatibility for both props
  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    if (onRewind) {
      onRewind();
    }
  };

  const handleMessageClick = () => {
    if (onMessage) {
      onMessage();
    } else if (matchId) {
      // Navigate to the matches page with this match opened
      navigate('/matches', { 
        state: { 
          openChat: true, 
          matchId, 
          matchName: matchName || 'Match' 
        } 
      });
    } else {
      toast({
        description: "No match available to message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center space-x-4 my-4">
      {(onUndo || onRewind) && (
        <Button onClick={handleUndo} className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500">
          <Undo className="text-white w-7 h-7" />
        </Button>
      )}
      
      {(onDislike || (onSwipe && !onDislike)) && (
        <Button onClick={handleDislike} className="p-3 rounded-full bg-red-400 hover:bg-red-500">
          <X className="text-white w-7 h-7" />
        </Button>
      )}
      
      {isMatch && (
        <Button 
          onClick={handleMessageClick} 
          className="p-3 rounded-full bg-purple-400 hover:bg-purple-500"
        >
          <MessageCircle className="text-white w-7 h-7" />
        </Button>
      )}
      
      {(onSuperLike || onBoost) && (
        <Button 
          onClick={onSuperLike || onBoost} 
          className="p-3 rounded-full bg-blue-400 hover:bg-blue-500"
        >
          <Star className="text-white w-7 h-7" />
        </Button>
      )}
      
      {(onLike || (onSwipe && !onLike)) && (
        <Button onClick={handleLike} className="p-3 rounded-full bg-green-400 hover:bg-green-500">
          <Heart className="text-white w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default SwipeButtons;
