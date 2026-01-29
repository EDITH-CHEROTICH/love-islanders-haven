
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

  // Map database fields to our interface
  return {
    id: data.id,
    content: data.content,
    sender_id: data.sender_id,
    match_id: data.match_id,
    sent_at: data.created_at,
    read: data.is_read,
    content_type: data.content_type as 'text' | 'image' | 'audio',
    media_url: data.media_url
  } as Message;
};

export const getMessagesForMatch = async (matchId: string) => {
  // Handle demo profiles
  if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
    console.log('Demo profile detected, returning simulated messages');
    // Create a consistent set of demo messages so there's history
    const demoMessages = [
      {
        id: `demo-1`,
        content: `Hi there! I'm interested in getting to know you better.`,
        sender_id: matchId,
        match_id: matchId,
        sent_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        content_type: 'text'
      },
      {
        id: `demo-2`,
        content: `What are some of your favorite hobbies?`,
        sender_id: 'current-user',
        match_id: matchId,
        sent_at: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
        read: true,
        content_type: 'text'
      },
      {
        id: `demo-3`,
        content: `I love hiking, reading, and trying new restaurants! What about you?`,
        sender_id: matchId,
        match_id: matchId,
        sent_at: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
        read: true,
        content_type: 'text'
      }
    ];
    return demoMessages as Message[];
  }
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  // Map database fields to our interface
  return (data || []).map(item => ({
    id: item.id,
    content: item.content,
    sender_id: item.sender_id,
    match_id: item.match_id,
    sent_at: item.created_at,
    read: item.is_read,
    content_type: item.content_type as 'text' | 'image' | 'audio',
    media_url: item.media_url
  })) as Message[];
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
    .update({ is_read: true })
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
    .eq('is_read', false)
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
