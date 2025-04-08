
import { supabase } from "@/integrations/supabase/client";

/**
 * Block a user
 */
export const blockUser = async (blockedUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('blocked_users')
    .insert({
      user_id: user.id,
      blocked_user_id: blockedUserId
    })
    .select();
    
  return { data, error };
};

/**
 * Unblock a user
 */
export const unblockUser = async (blockedUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('user_id', user.id)
    .eq('blocked_user_id', blockedUserId)
    .select();
    
  return { data, error };
};

/**
 * Get all blocked users
 */
export const getBlockedUsers = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('blocked_users')
    .select(`
      blocked_user_id,
      profiles:blocked_user_id (
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id);
    
  return { data, error };
};

/**
 * Check if a user is blocked
 */
export const isUserBlocked = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('blocked_users')
    .select('id')
    .match({ user_id: user.id, blocked_user_id: userId })
    .maybeSingle();
    
  if (error) {
    console.error('Error checking block status:', error);
    return false;
  }
  
  return !!data;
};
