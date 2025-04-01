
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBlockedUsers = () => {
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchBlockedUsers();
  }, []);
  
  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const blockedUsers = await supabase
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', user.id);
        
      if (blockedUsers.data) {
        setBlockedUserIds(blockedUsers.data.map(u => u.blocked_user_id));
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    blockedUserIds,
    setBlockedUserIds,
    isLoading
  };
};
