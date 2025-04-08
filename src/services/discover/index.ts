
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
export const fetchDiscoverProfiles = async (filters: any = {}) => {
  let query = supabase
    .from('profiles')
    .select('*');
  
  // Apply filters if provided
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }
  
  if (filters.minAge && filters.maxAge) {
    query = query.gte('age', filters.minAge).lte('age', filters.maxAge);
  }
  
  const { data, error } = await query;
  
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
      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: userId,
          liked_id: profileId,
          is_like: true
        });
      
      if (error) throw error;
    }
    
    // Could implement 'pass' logic here if needed
    
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
      profiles!matches_user_one_fkey (
        id,
        name,
        avatar_url,
        age,
        gender,
        city,
        country,
        bio,
        interests,
        height_cm
      ),
      profiles!matches_user_two_fkey (
        id,
        name,
        avatar_url,
        age,
        gender,
        city,
        country,
        bio,
        interests,
        height_cm
      )
    `)
    .or(`user_one.eq.${userId},user_two.eq.${userId}`);
    
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
  const interests = profile.interests ? JSON.parse(profile.interests) : [];
  
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
