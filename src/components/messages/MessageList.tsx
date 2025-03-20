
import { Message } from '@/services/messages';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useEffect, RefObject } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string | null;
  isTyping?: boolean;
  messagesEndRef?: RefObject<HTMLDivElement>;
}

const MessageList = ({ 
  messages, 
  isLoading, 
  currentUserId, 
  isTyping = false,
  messagesEndRef
}: MessageListProps) => {
  
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        <div className="text-center text-white/60 py-8">
          Loading messages...
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        <div className="text-center text-white/60 py-8">
          No messages yet. Say hello to start the conversation!
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
      {messages.map((msg) => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
          isCurrentUser={msg.sender_id === currentUserId} 
        />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
