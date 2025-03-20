
import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  matched_at: string;
  user1_id: string;
  user2_id: string;
  lastMessage?: {
    id: string;
    content: string;
    sender_id: string;
    sent_at: string;
    read: boolean;
  };
  otherUser: {
    id: string;
    name: string;
    age?: number;
    verified?: boolean;
    images?: string[];
  };
}

export const getUserMatches = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Fetch matches where the current user is either user1 or user2
    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select(`
        id,
        matched_at,
        user1_id,
        user2_id,
        user1:profiles!matches_user1_id_fkey(id, name, age, verified),
        user2:profiles!matches_user2_id_fkey(id, name, age, verified)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('matched_at', { ascending: false });
      
    if (matchesError) {
      throw matchesError;
    }
    
    // Fetch the latest message for each match
    const enrichedMatches = await Promise.all(
      matchesData.map(async (match) => {
        // Determine which user is the "other" user
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        
        // Fetch profile images for the other user
        const { data: imageData } = await supabase
          .from('profile_images')
          .select('url')
          .eq('profile_id', otherUser.id)
          .order('position', { ascending: true })
          .limit(1);
          
        const images = imageData ? imageData.map(img => img.url) : [];
        
        // Fetch the latest message
        const { data: messageData } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', match.id)
          .order('sent_at', { ascending: false })
          .limit(1);
          
        const lastMessage = messageData && messageData.length > 0 ? messageData[0] : undefined;
        
        return {
          id: match.id,
          matched_at: match.matched_at,
          user1_id: match.user1_id,
          user2_id: match.user2_id,
          lastMessage,
          otherUser: {
            ...otherUser,
            images
          }
        };
      })
    );
    
    return enrichedMatches as Match[];
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw error;
  }
};

export const getMatchById = async (matchId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        matched_at,
        user1_id,
        user2_id,
        user1:profiles!matches_user1_id_fkey(id, name, age, verified),
        user2:profiles!matches_user2_id_fkey(id, name, age, verified)
      `)
      .eq('id', matchId)
      .single();
      
    if (error) {
      throw error;
    }
    
    // Determine which user is the "other" user
    const otherUser = data.user1_id === user.id ? data.user2 : data.user1;
    
    // Fetch profile images for the other user
    const { data: imageData } = await supabase
      .from('profile_images')
      .select('url')
      .eq('profile_id', otherUser.id)
      .order('position', { ascending: true });
      
    const images = imageData ? imageData.map(img => img.url) : [];
    
    return {
      ...data,
      otherUser: {
        ...otherUser,
        images
      }
    } as Match;
  } catch (error) {
    console.error('Error fetching match by ID:', error);
    throw error;
  }
};
