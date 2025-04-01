
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sendMessage, getMessagesForMatch, Message, markMessagesAsRead } from '@/services/messages';

export const useInlineChat = (matchId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    fetchCurrentUser();
    loadMessages();
    setupRealtimeListener();
    
    // Mark messages as read when opening the chat
    if (matchId) {
      markMessagesAsRead(matchId).catch(error => {
        console.error('Error marking messages as read:', error);
      });
    }

    return () => {
      const channel = supabase.channel(`messages:${matchId}`);
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await getMessagesForMatch(matchId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
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
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
  };

  const handleSendMessage = async (content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
    try {
      await sendMessage(matchId, content, contentType, mediaUrl);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  return {
    messages,
    isLoading,
    currentUserId,
    handleSendMessage
  };
};
