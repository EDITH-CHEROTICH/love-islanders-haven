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
  // Handle demo profiles (ids that start with 'sample' or contain 'profile')
  if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
    console.log('Demo profile detected, simulating message send');
    // Return a simulated message for demo purposes
    return {
      id: `msg-${Date.now()}`,
      content,
      sender_id: 'current-user',
      match_id: matchId,
      sent_at: new Date().toISOString(),
      read: false,
      content_type: contentType,
      media_url: mediaUrl
    } as Message;
  }
  
  // Real functionality for authenticated users
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
  // Handle demo profiles
  if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
    console.log('Demo profile detected, returning simulated messages');
    // Return empty array - the component will handle adding initial messages
    return [];
  }
  
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
  // Handle demo profiles
  if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
    console.log('Demo profile detected, simulating mark as read');
    return true;
  }
  
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
  // Handle demo profiles for specific match
  if (matchId && (matchId.includes('sample-profile') || matchId.includes('profile-'))) {
    return 0;
  }
  
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
