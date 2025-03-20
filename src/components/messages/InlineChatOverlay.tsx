
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Message from '@/components/companion/Message';
import MessageInput from '@/components/messages/MessageInput';
import { sendMessage, getMessagesForMatch, Message as MessageType } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';

interface InlineChatOverlayProps {
  matchId: string;
  matchName: string;
  onClose: () => void;
}

const InlineChatOverlay: React.FC<InlineChatOverlayProps> = ({ matchId, matchName, onClose }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    fetchCurrentUser();
    loadMessages();
    setupRealtimeListener();

    return () => {
      const channel = supabase.channel(`messages:${matchId}`);
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await getMessagesForMatch(matchId);
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeListener = () => {
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
          // Add the new message to the messages array
          setMessages(prev => [...prev, payload.new as MessageType]);
        }
      )
      .subscribe();
  };

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
    try {
      await sendMessage(matchId, content);
      // No need to manually add the message, it will come via the realtime subscription
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-island-dark border border-island-light/20 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">
        <div className="bg-island p-4 border-b border-island-light/20 flex justify-between items-center">
          <h3 className="font-semibold text-white">{matchName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-island-light/20">
            <X size={18} />
          </Button>
        </div>

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
              <Message
                key={msg.id}
                message={msg.content}
                isUser={msg.sender_id === currentUserId}
                timestamp={new Date(msg.sent_at)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default InlineChatOverlay;
