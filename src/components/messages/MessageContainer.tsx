
import { useMatchMessages } from '@/hooks/use-match-messages';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessageContainer } from '@/hooks/use-message-container';
import { handleSendMessage } from '@/services/messages/messageHandling';
import { useState } from 'react';
import { Message } from '@/services/messages';

interface MessageContainerProps {
  matchId: string | undefined;
  currentUserId: string | null;
  onSendMessage: (content: string) => Promise<void>;
}

const MessageContainer = ({ matchId, currentUserId, onSendMessage }: MessageContainerProps) => {
  const { messages: fetchedMessages, isLoading } = useMatchMessages(matchId, currentUserId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { isSending, setIsSending, isTyping, handleTypingStatus } = useMessageContainer({ 
    matchId, 
    currentUserId 
  });
  
  // Combine fetched messages with local messages for immediate UI update
  const allMessages = [...fetchedMessages, ...localMessages.filter(
    localMsg => !fetchedMessages.some(msg => msg.id === localMsg.id)
  )];
  
  const handleSendMessageWrapper = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      if (contentType === 'text') {
        // Regular text message
        try {
          // Try the parent component's onSendMessage first
          await onSendMessage(content);
        } catch (error) {
          // Fallback to direct message sending
          const newMessage = await handleSendMessage(matchId, content, contentType);
          if (newMessage) {
            // Add message to local state for immediate display
            setLocalMessages(prev => [...prev, newMessage]);
          }
        }
      } else {
        // For non-text messages, handle specifically
        const newMessage = await handleSendMessage(matchId, content, contentType, mediaUrl);
        if (newMessage) {
          // Add message to local state for immediate display
          setLocalMessages(prev => [...prev, newMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <main className="flex flex-col h-[calc(100vh-180px)]">
      <MessageList 
        messages={allMessages} 
        isLoading={isLoading} 
        currentUserId={currentUserId} 
        isTyping={isTyping}
        matchId={matchId}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessageWrapper} 
        isSending={isSending}
        onTypingStatus={handleTypingStatus}
        matchId={matchId || ''}
      />
    </main>
  );
};

export default MessageContainer;
