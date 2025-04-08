
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { markMessagesAsRead, Message as MessageType } from '@/services/messages';
import MessageItem from '@/components/messages/MessageItem';
import MessageInput from '@/components/messages/MessageInput';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Combine prop messages with any local messages that aren't in the props yet
  const allMessages = [
    ...messages,
    ...localMessages.filter(localMsg => 
      !messages.some(msg => msg.id === localMsg.id)
    )
  ].sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());

  useEffect(() => {
    scrollToBottom();
    
    // Set up real-time listener for new messages
    const channel = supabase
      .channel(`inline-chat-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageType;
          // Only add if not from current user (those are handled via local state)
          if (newMessage.sender_id !== currentUserId) {
            setLocalMessages(prev => [...prev, newMessage]);
          }
          
          // Mark as read since we're viewing the chat
          markMessagesAsRead(matchId).catch(error => {
            console.error('Error marking message as read:', error);
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, messages, currentUserId]);

  // Make sure we scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    setIsSending(true);
    try {
      // Optimistically update UI with pending message
      const pendingMessage: MessageType = {
        id: `pending-${Date.now()}`,
        content,
        sender_id: currentUserId || '',
        match_id: matchId,
        sent_at: new Date().toISOString(),
        read: false,
        content_type: contentType,
        media_url: mediaUrl
      };
      
      setLocalMessages(prev => [...prev, pendingMessage]);
      scrollToBottom();
      
      const success = await onSendMessage(content, contentType, mediaUrl);
      if (!success) {
        throw new Error("Failed to send message");
      }
      
      // Remove pending message once confirmed (it will be added via props or realtime)
      setLocalMessages(prev => prev.filter(msg => msg.id !== pendingMessage.id));
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
      <ScrollArea className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-white/60 py-8">
            Loading messages...
          </div>
        ) : allMessages.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No messages yet. Say hello to start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.sender_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

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
