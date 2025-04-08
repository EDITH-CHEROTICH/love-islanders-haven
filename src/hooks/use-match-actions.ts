
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { blockUser, unblockUser } from '@/services/profiles/blocking';
import { supabase } from '@/integrations/supabase/client';

export const useMatchActions = () => {
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleBlockUser = async (match: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.profile.id;
    
    try {
      const { error } = await blockUser(matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds(prev => [...prev, matchUserId]);
      
      toast({
        title: "User Blocked",
        description: `You have blocked ${match.profile.name}`,
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
    }
  };
  
  const handleUnblockUser = async (match: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const matchUserId = match.profile.id;
    
    try {
      const { error } = await unblockUser(matchUserId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBlockedUserIds(prev => prev.filter(id => id !== matchUserId));
      
      toast({
        title: "User Unblocked",
        description: `You have unblocked ${match.profile.name}`,
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user",
        variant: "destructive",
      });
    }
  };
  
  return {
    blockedUserIds,
    setBlockedUserIds,
    handleBlockUser,
    handleUnblockUser
  };
};
