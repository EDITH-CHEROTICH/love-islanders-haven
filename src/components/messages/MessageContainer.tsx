
import { useMatchMessages } from '@/hooks/use-match-messages';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessageContainer } from '@/hooks/use-message-container';
import { handleSendMessage } from '@/services/messages/messageHandling';

interface MessageContainerProps {
  matchId: string | undefined;
  currentUserId: string | null;
  onSendMessage: (content: string) => Promise<void>;
}

const MessageContainer = ({ matchId, currentUserId, onSendMessage }: MessageContainerProps) => {
  const { messages, isLoading } = useMatchMessages(matchId, currentUserId);
  const { isSending, setIsSending, isTyping, handleTypingStatus } = useMessageContainer({ 
    matchId, 
    currentUserId 
  });
  
  const handleSendMessageWrapper = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      if (contentType === 'text') {
        await onSendMessage(content);
      } else {
        // For non-text messages, we need to handle them specifically
        await handleSendMessage(matchId, content, contentType, mediaUrl);
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
        messages={messages} 
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
