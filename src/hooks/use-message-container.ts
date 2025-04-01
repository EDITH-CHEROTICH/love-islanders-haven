
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { markMessagesAsRead } from '@/services/messages';

interface UseMessageContainerProps {
  matchId: string | undefined;
  currentUserId: string | null;
}

export const useMessageContainer = ({ matchId, currentUserId }: UseMessageContainerProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mark messages as read when component mounts
  useEffect(() => {
    if (matchId) {
      markMessagesAsRead(matchId).catch(error => {
        console.error('Error marking messages as read:', error);
      });
    }
  }, [matchId]);
  
  // Set up realtime presence for typing indicator
  useEffect(() => {
    if (!matchId || !currentUserId) return;
    
    // Create a channel for this match
    const presenceChannel = supabase.channel(`match:${matchId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });
    
    // Handle presence state changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'join' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'leave' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .subscribe();
      
    setChannel(presenceChannel);
    
    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [matchId, currentUserId]);
  
  // Function to update typing status based on presence state
  const updateTypingStatus = (state: any) => {
    if (!currentUserId) return;
    
    // Check if any other user is typing
    let someoneIsTyping = false;
    Object.keys(state).forEach(presenceId => {
      if (presenceId !== currentUserId) {
        state[presenceId].forEach((presence: any) => {
          if (presence.isTyping) {
            someoneIsTyping = true;
          }
        });
      }
    });
    
    setIsTyping(someoneIsTyping);
  };
  
  // Function to update typing status
  const handleTypingStatus = async (isTyping: boolean) => {
    if (channel) {
      await channel.track({
        isTyping,
        user_id: currentUserId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return {
    isSending,
    setIsSending,
    isTyping,
    handleTypingStatus
  };
};
