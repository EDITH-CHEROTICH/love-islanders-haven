
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Message, 
  getMessagesForMatch, 
  markMessagesAsRead
} from '@/services/messages';

export const useMatchMessages = (matchId: string | undefined, currentUserId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!matchId) return;
    
    loadMessages();
    loadMatchDetails();
    setupRealtimeListener();
    
    // Mark messages as read when the conversation is opened
    if (matchId) {
      markMessagesAsRead(matchId).catch(err => {
        console.error('Error marking messages as read:', err);
      });
    }
    
    return () => {
      // Clean up realtime subscription
      const channel = supabase.channel(`messages:${matchId}`);
      supabase.removeChannel(channel);
    };
  }, [matchId, currentUserId]);

  const loadMessages = async () => {
    if (!matchId) return;
    
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
          // Add the new message to the messages array
          setMessages(prev => [...prev, payload.new as Message]);
          
          // Mark new messages as read if they are from the other person
          if (payload.new.sender_id !== currentUserId) {
            markMessagesAsRead(matchId);
          }
        }
      )
      .subscribe();
  };
  
  const loadMatchDetails = async () => {
    if (!matchId) return;
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          matched_at,
          user1_id,
          user2_id,
          user1:user1_id(id, name, verified),
          user2:user2_id(id, name, verified)
        `)
        .eq('id', matchId)
        .single();
      
      if (error) throw error;
      
      const otherUser = data.user1_id === currentUserId ? data.user2 : data.user1;
      
      setMatchInfo({
        ...data,
        otherUser
      });
    } catch (error) {
      console.error('Error loading match details:', error);
      toast({
        title: "Error",
        description: "Failed to load match information",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    isLoading,
    matchInfo
  };
};
