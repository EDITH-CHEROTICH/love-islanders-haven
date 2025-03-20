
import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  otherUser: {
    id: string;
    name: string;
    age?: number;
    verified?: boolean;
    images?: string[];
  };
  lastMessage?: {
    id: string;
    content: string;
    sent_at: string;
    sender_id: string;
    read: boolean;
  };
  hasUnreadMessages: boolean;
  unreadCount: number;
}

export const getUserMatches = async (): Promise<Match[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Fetch all matches where the current user is either user1 or user2
  const { data: matchesData, error: matchesError } = await supabase
    .from('matches')
    .select(`
      id,
      user1_id,
      user2_id,
      matched_at,
      user1:user1_id(id, name, age, verified),
      user2:user2_id(id, name, age, verified)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (matchesError) {
    console.error('Error fetching matches:', matchesError);
    throw matchesError;
  }

  // For each match, we need to get the other user's profile image and the last message
  const matchesWithDetails = await Promise.all(
    matchesData.map(async (match) => {
      let otherUser;
      if (match.user1_id === userId) {
        otherUser = match.user2;
      } else {
        otherUser = match.user1;
      }

      // Get the other user's profile images
      const { data: profileImages } = await supabase
        .from('profile_images')
        .select('url')
        .eq('profile_id', otherUser.id)
        .order('position', { ascending: true });

      // Get the last message for this match
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', match.id)
        .order('sent_at', { ascending: false })
        .limit(1);

      // Count unread messages from the other user
      const { data: unreadMessages, error: unreadError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('match_id', match.id)
        .eq('read', false)
        .neq('sender_id', userId);

      if (unreadError) {
        console.error('Error counting unread messages:', unreadError);
      }

      const unreadCount = unreadMessages?.length || 0;

      return {
        ...match,
        otherUser: {
          ...otherUser,
          images: profileImages?.map(img => img.url) || []
        },
        lastMessage: messages && messages.length > 0 ? messages[0] : undefined,
        hasUnreadMessages: unreadCount > 0,
        unreadCount
      };
    })
  );

  // Sort matches by last message time or match time
  matchesWithDetails.sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.sent_at).getTime() : new Date(a.matched_at).getTime();
    const bTime = b.lastMessage ? new Date(b.lastMessage.sent_at).getTime() : new Date(b.matched_at).getTime();
    return bTime - aTime; // Most recent first
  });

  return matchesWithDetails;
};
