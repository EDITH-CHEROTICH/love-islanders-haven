
import { useState, useEffect } from 'react';
import useMatchMessages from '@/hooks/use-match-messages';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

export const useMessageDetail = (matchId: string) => {
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { messages, loading: messagesLoading, createMessage, refreshMessages } = useMatchMessages(matchId);
  const { user } = useAuth();

  useEffect(() => {
    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          matched_at,
          profiles!matches_user1_id_fkey (id, name, avatar_url),
          profiles!matches_user2_id_fkey (id, name, avatar_url)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;
      
      setMatchDetails(data);
      
      // Determine which user is the other person in the match
      if (data) {
        const otherUserData = data.user1_id === user?.id 
          ? data.profiles.matches_user2_id_fkey 
          : data.profiles.matches_user1_id_fkey;
        
        setOtherUser(otherUserData);
      }
    } catch (error) {
      console.error("Error fetching match details:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, contentType: string = 'text', mediaUrl: string = '') => {
    if (!matchId || !content) return null;
    
    const message = await createMessage(matchId, content, contentType, mediaUrl);
    return message;
  };

  const markMessagesAsRead = async () => {
    if (!user?.id || !matchId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Refresh messages to update UI
      refreshMessages();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return {
    matchDetails,
    otherUser,
    messages,
    loading: loading || messagesLoading,
    sendMessage,
    markMessagesAsRead,
    refreshMessages
  };
};

export default useMessageDetail;
