
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserMatches, Match } from '@/services/matches';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
    
    // Set up a realtime subscription to matches
    const channel = supabase
      .channel('public:matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          // Refetch matches when there are changes
          fetchMatches();
        }
      )
      .subscribe();
      
    // Set up a realtime subscription to messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Refetch matches to get the latest message
          fetchMatches();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const data = await getUserMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    matches,
    isLoading,
    error,
    refreshMatches: fetchMatches
  };
};
