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
  const [matchInfo, setMatchInfo] = useState<any>({
    id: '',
    matched_at: new Date().toISOString(),
    profile: {
      id: '',
      name: 'Loading...',
      images: ['/placeholder.svg'],
      verified: false
    }
  });
  const { toast } = useToast();

  // Add console logs to debug
  console.log('Match ID:', matchId);
  console.log('Current User ID:', currentUserId);

  useEffect(() => {
    if (!matchId) return;
    
    loadMessages();
    loadMatchDetails();
    setupRealtimeListener();
    
    // Mark messages as read when the conversation is opened
    if (matchId && matchId !== ':matchId') {
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
    if (!matchId || matchId === ':matchId') return;
    
    setIsLoading(true);
    try {
      const fetchedMessages = await getMessagesForMatch(matchId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const setupRealtimeListener = () => {
    if (!matchId || matchId === ':matchId') return;
    
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
    if (!matchId || matchId === ':matchId') return;
    
    try {
      // This is just a fallback until the database loads
      if (matchId.startsWith('m')) {
        // Temporarily use dummy data for testing without database
        import('@/utils/dummyData').then(({ matches }) => {
          const match = matches.find(m => m.id === matchId);
          if (match) {
            setMatchInfo({
              id: match.id,
              matched_at: match.matchDate, // Use matchDate from updated interface
              profile: match.profile
            });
          }
        });
        return;
      }
      
      // Carefully handle the database query to avoid type errors
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          matched_at,
          user1_id,
          user2_id,
          user1:profiles!user1_id(id, name, verified),
          user2:profiles!user2_id(id, name, verified)
        `)
        .eq('id', matchId)
        .single();
      
      if (error) {
        console.error('Error loading match details:', error);
        throw error;
      }
      
      if (data) {
        // Add safety checks to ensure we have the expected data format
        const otherUserId = data.user1_id === currentUserId ? data.user2_id : data.user1_id;
        const otherUser = data.user1_id === currentUserId ? data.user2 : data.user1;
        
        if (!otherUser || !otherUserId) {
          console.error('Missing user data in match details');
          return;
        }
        
        // Get profile images for the other user
        const { data: imageData } = await supabase
          .from('profile_images')
          .select('url')
          .eq('profile_id', otherUserId)
          .order('position', { ascending: true });
          
        const images = imageData && imageData.length > 0 
          ? imageData.map(img => img.url) 
          : ['/placeholder.svg'];
        
        setMatchInfo({
          ...data,
          profile: {
            ...otherUser,
            images
          }
        });
      } else {
        console.log('No match found with ID:', matchId);
      }
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
