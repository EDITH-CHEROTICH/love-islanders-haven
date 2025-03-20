
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { sendMessage, Message } from '@/services/messages';
import MessageItem from '@/components/messages/MessageItem';
import TypingIndicator from '@/components/messages/TypingIndicator';

interface InlineChatProps {
  matchId: string;
  matchName: string;
  onClose: () => void;
}

const InlineChat: React.FC<InlineChatProps> = ({ matchId, matchName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    if (!matchId) return;
    
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', matchId)
          .order('sent_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data as Message[]);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time listener for new messages
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
          setMessages(prev => [...prev, payload.new as Message]);
          
          // Mark messages as read if they are from the other person
          if (payload.new.sender_id !== currentUserId) {
            markMessagesAsRead();
          }
        }
      )
      .subscribe();
      
    // Mark messages as read when component mounts
    markMessagesAsRead();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, currentUserId, toast]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const markMessagesAsRead = async () => {
    if (!matchId || !currentUserId) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .neq('sender_id', currentUserId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !matchId || !currentUserId) return;
    
    setIsSending(true);
    try {
      await sendMessage(matchId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-island-dark rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{matchName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
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
            <>
              {messages.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  message={msg} 
                  isCurrentUser={msg.sender_id === currentUserId} 
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isSending}
              className="bg-love hover:bg-love/90"
            >
              {isSending ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineChat;
