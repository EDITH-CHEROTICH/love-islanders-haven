
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMatchMessages } from '@/hooks/use-match-messages';
import { markMessagesAsRead } from '@/services/messages';

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
  
  const handleSendMessage = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      if (contentType === 'text') {
        await onSendMessage(content);
      } else {
        // For non-text messages, we need to handle them specifically
        const { sendMessage } = await import('@/services/messages');
        await sendMessage(matchId, content, contentType, mediaUrl);
      }
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
        matchId={matchId}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isSending={isSending}
        onTypingStatus={handleTypingStatus}
        matchId={matchId || ''}
      />
    </main>
  );
};

export default MessageContainer;
