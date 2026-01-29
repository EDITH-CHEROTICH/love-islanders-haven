
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
          user_id,
          matched_user_id,
          created_at,
          status
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;
      
      setMatchDetails(data);
      
      // Determine which user is the other person in the match
      if (data) {
        const otherUserId = data.user_id === user?.id 
          ? data.matched_user_id 
          : data.user_id;
        
        // Fetch the other user's profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .eq('id', otherUserId)
          .single();
          
        setOtherUser(profileData);
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
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
        
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
