
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMatchMessages } from '@/hooks/use-match-messages';

interface MessageContainerProps {
  matchId: string | undefined;
  currentUserId: string | null;
  onSendMessage: (content: string) => Promise<void>;
}

const MessageContainer = ({ matchId, currentUserId, onSendMessage }: MessageContainerProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const { messages, isLoading } = useMatchMessages(matchId, currentUserId);
  
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
  
  const handleSendMessage = async (content: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      await onSendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleTypingStatus = async (isTyping: boolean) => {
    if (channel) {
      await channel.track({
        isTyping,
        user_id: currentUserId,
        timestamp: new Date().toISOString(),
      });
    }
  };
  
  return (
    <main className="flex flex-col h-[calc(100vh-180px)]">
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        currentUserId={currentUserId} 
        isTyping={isTyping}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isSending={isSending}
        onTypingStatus={handleTypingStatus}
      />
    </main>
  );
};

export default MessageContainer;
