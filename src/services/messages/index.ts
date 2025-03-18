
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  match_id: string;
  sent_at: string;
  read: boolean;
}

export const sendMessage = async (matchId: string, content: string) => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: userId,
      content
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return data as Message;
};

export const getMessagesForMatch = async (matchId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('sent_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data as Message[];
};

export const markMessagesAsRead = async (matchId: string) => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('match_id', matchId)
    .neq('sender_id', userId);

  if (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }

  return true;
};

export const getUnreadMessageCount = async () => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('read', false)
    .neq('sender_id', userId);

  if (error) {
    console.error('Error fetching unread message count:', error);
    throw error;
  }

  return data.length || 0;
};
