
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  match_id: string;
  sent_at: string;
  read: boolean;
  content_type?: 'text' | 'image' | 'audio';
  media_url?: string;
}

export const sendMessage = async (matchId: string, content: string, contentType: 'text' | 'image' | 'audio' = 'text', mediaUrl?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: userId,
      content,
      content_type: contentType,
      media_url: mediaUrl
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
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

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

export const getUnreadMessageCount = async (matchId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('read', false)
    .neq('sender_id', userId);
  
  if (matchId) {
    query = query.eq('match_id', matchId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching unread message count:', error);
    throw error;
  }

  return count || 0;
};

export const hasUnreadMessages = async (matchId: string) => {
  const count = await getUnreadMessageCount(matchId);
  return count > 0;
};
