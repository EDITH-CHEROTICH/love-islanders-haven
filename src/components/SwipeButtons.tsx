
import React from 'react';
import { Heart, X, MessageCircle, Star, Undo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface SwipeButtonsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onSuperLike?: () => void;
  onUndo?: () => void;
  onMessage?: () => void;
  matchId?: string;
  matchName?: string;
  isMatch?: boolean;
}

const SwipeButtons: React.FC<SwipeButtonsProps> = ({
  onLike,
  onDislike,
  onSuperLike,
  onUndo,
  onMessage,
  matchId,
  matchName,
  isMatch = false,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      {onUndo && (
        <Button onClick={onUndo} className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500">
          <Undo className="text-white w-7 h-7" />
        </Button>
      )}
      
      {onDislike && (
        <Button onClick={onDislike} className="p-3 rounded-full bg-red-400 hover:bg-red-500">
          <X className="text-white w-7 h-7" />
        </Button>
      )}
      
      {isMatch && (
        <Button 
          onClick={handleMessageClick} 
          className="p-3 rounded-full bg-purple-400 hover:bg-purple-500"
        >
          <MessageCircle className="text-purple-500 w-7 h-7" />
        </Button>
      )}
      
      {onSuperLike && (
        <Button onClick={onSuperLike} className="p-3 rounded-full bg-blue-400 hover:bg-blue-500">
          <Star className="text-white w-7 h-7" />
        </Button>
      )}
      
      {onLike && (
        <Button onClick={onLike} className="p-3 rounded-full bg-green-400 hover:bg-green-500">
          <Heart className="text-white w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default SwipeButtons;
