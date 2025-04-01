
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { markMessagesAsRead, Message as MessageType } from '@/services/messages';
import MessageItem from '@/components/messages/MessageItem';
import MessageInput from '@/components/messages/MessageInput';

interface InlineChatContentProps {
  matchId: string;
  messages: MessageType[];
  isLoading: boolean;
  currentUserId: string | null;
  onSendMessage: (content: string, contentType: 'text' | 'image' | 'audio', mediaUrl?: string) => Promise<boolean>;
}

const InlineChatContent: React.FC<InlineChatContentProps> = ({ 
  matchId, 
  messages, 
  isLoading, 
  currentUserId,
  onSendMessage
}) => {
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    setIsSending(true);
    try {
      const success = await onSendMessage(content, contentType, mediaUrl);
      if (!success) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Messages container with flex-1 to take available space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No messages yet. Say hello to start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isCurrentUser={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with fixed position at bottom */}
      <div className="mt-auto">
        <MessageInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
          matchId={matchId}
        />
      </div>
    </>
  );
};

export default InlineChatContent;
