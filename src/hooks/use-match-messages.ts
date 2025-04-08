
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";

export const useMatchMessages = (matchId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const createMessage = async (matchId: string, content: string, contentType: string = 'text', mediaUrl: string = ''): Promise<any> => {
    if (!user?.id) return null;
    
    const newMessage = {
      match_id: matchId,
      sender_id: user.id,
      content,
      content_type: contentType,
      media_url: mediaUrl || null
    };
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error creating message:", error);
      return null;
    }
  };

  // Add other required methods here for completeness
  const fetchMessages = async () => {
    if (!matchId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('sent_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`match_messages:${matchId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [matchId]);

  return {
    messages,
    loading,
    createMessage,
    refreshMessages: fetchMessages
  };
};

// Make sure to export the hook as default as well
export default useMatchMessages;
