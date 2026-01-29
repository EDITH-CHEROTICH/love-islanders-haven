
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch all profiles
 */
export const fetchProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
    
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetch a single profile by ID
 */
export const fetchProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data || null;
};

/**
 * Fetch profiles for discover page with filtering
 */
export const fetchDiscoverProfiles = async (filters: DiscoverFilters = {}) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching discover profiles:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Record user's swipe action
 */
export const recordSwipeAction = async (userId: string, profileId: string, action: 'like' | 'pass') => {
  try {
    if (action === 'like') {
      // Use swipes table instead of likes
      const { error } = await supabase
        .from('swipes')
        .insert({
          user_id: userId,
          swiped_user_id: profileId,
          direction: 'right'
        });
      
      if (error) throw error;
    } else {
      // Record pass as left swipe
      const { error } = await supabase
        .from('swipes')
        .insert({
          user_id: userId,
          swiped_user_id: profileId,
          direction: 'left'
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording swipe action:', error);
    return false;
  }
};

/**
 * Fetch matches for a user
 */
export const fetchMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      created_at,
      user_id,
      matched_user_id,
      status
    `)
    .or(`user_id.eq.${userId},matched_user_id.eq.${userId}`);
    
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Format a profile for display
 */
export const formatProfileForDisplay = (profile: any) => {
  const interests = profile.interests ? 
    (Array.isArray(profile.interests) ? profile.interests : JSON.parse(profile.interests)) 
    : [];
  
  return {
    id: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url || '/placeholder.svg',
    age: profile.age,
    gender: profile.gender,
    city: profile.city,
    country: profile.country,
    bio: profile.bio,
    interests: interests,
    height: profile.height_cm ? `${profile.height_cm} cm` : undefined,
  };
};

// Define types for discover filters
export interface DiscoverFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
}
