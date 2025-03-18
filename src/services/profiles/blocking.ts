
import { supabase } from "@/integrations/supabase/client";

/**
 * Blocks a user
 * @param userId Current user's ID
 * @param blockedUserId ID of the user to block
 * @returns Object containing data or error
 */
export const blockUser = async (userId: string, blockedUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('blocked_users')
      .insert({
        user_id: userId,
        blocked_user_id: blockedUserId
      })
      .select();
    
    return { data, error };
  } catch (error) {
    console.error('Error blocking user:', error);
    return { data: null, error };
  }
};

/**
 * Unblocks a user
 * @param userId Current user's ID
 * @param blockedUserId ID of the user to unblock
 * @returns Object containing data or error
 */
export const unblockUser = async (userId: string, blockedUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('blocked_users')
      .delete()
      .match({
        user_id: userId,
        blocked_user_id: blockedUserId
      })
      .select();
    
    return { data, error };
  } catch (error) {
    console.error('Error unblocking user:', error);
    return { data: null, error };
  }
};

/**
 * Get all users blocked by the current user
 * @param userId Current user's ID
 * @returns Array of blocked users
 */
export const getBlockedUsers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('blocked_user_id, profiles!inner(id, name, age)')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }
};

/**
 * Checks if a user is blocked
 * @param userId Current user's ID
 * @param targetUserId User to check
 * @returns Boolean indicating if the target user is blocked
 */
export const isUserBlocked = async (userId: string, targetUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('user_id', userId)
      .eq('blocked_user_id', targetUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    return false;
  }
};
