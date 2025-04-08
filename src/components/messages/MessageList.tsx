
import { Message } from '@/services/messages';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string | null;
  isTyping?: boolean;
  matchId?: string;
}

const MessageList = ({ 
  messages, 
  isLoading, 
  currentUserId, 
  isTyping = false,
  matchId
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [realTimeMessages, setRealTimeMessages] = useState<Message[]>(messages);
  
  useEffect(() => {
    setRealTimeMessages(messages);
  }, [messages]);
  
  useEffect(() => {
    scrollToBottom();
  }, [realTimeMessages, isTyping]);
  
  // Set up real-time listener for new messages
  useEffect(() => {
    if (!matchId) return;
    
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setRealTimeMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <ScrollArea className="flex-1 p-4 space-y-4">
      {isLoading ? (
        <div className="text-center text-white/60 py-8">
          Loading messages...
        </div>
      ) : realTimeMessages.length === 0 ? (
        <div className="text-center text-white/60 py-8">
          No messages yet. Say hello to start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {realTimeMessages.map((msg) => (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              isCurrentUser={msg.sender_id === currentUserId} 
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;
