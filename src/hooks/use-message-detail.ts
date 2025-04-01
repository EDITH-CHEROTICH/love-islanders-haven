
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMatchMessages } from '@/hooks/use-match-messages';

export const useMessageDetail = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { matchInfo, messages, isLoading } = useMatchMessages(matchId, currentUserId);
  const { toast } = useToast();
  
  // Fetch current user ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Redirect to matches if no matchId
  useEffect(() => {
    if (!matchId) {
      navigate('/matches');
    }
  }, [matchId, navigate]);
  
  const handleBackClick = () => {
    navigate('/matches');
  };

  return {
    matchId,
    currentUserId,
    matchInfo,
    messages,
    isLoading,
    handleBackClick,
    toast
  };
};
