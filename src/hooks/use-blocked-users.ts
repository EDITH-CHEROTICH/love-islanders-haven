
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { blockUser, unblockUser } from '@/services/profiles/blocking';
import { Match } from '@/services/matches';

export const useBlockedUsers = () => {
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const { data: blockedUsers, error } = await supabase
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      if (blockedUsers) {
        setBlockedUserIds(blockedUsers.map(u => u.blocked_user_id));
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  };

  const handleBlockUser = async (match: Match) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.otherUser.id;
    
    try {
      const { error } = await blockUser(user.id, matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds([...blockedUserIds, matchUserId]);
      
      toast({
        title: "User Blocked",
        description: `You have blocked ${match.otherUser.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleUnblockUser = async (match: Match) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.otherUser.id;
    
    try {
      const { error } = await unblockUser(user.id, matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds(blockedUserIds.filter(id => id !== matchUserId));
      
      toast({
        title: "User Unblocked",
        description: `You have unblocked ${match.otherUser.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    blockedUserIds,
    handleBlockUser,
    handleUnblockUser
  };
};
