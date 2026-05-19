
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
 * Fetch profiles for discover page with filtering.
 * Excludes the current user, anyone they've already swiped on, and anyone they've blocked.
 */
export const fetchDiscoverProfiles = async (filters: DiscoverFilters = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Build list of user ids to exclude
  const [{ data: swipes }, { data: blocks }] = await Promise.all([
    supabase.from('swipes').select('swiped_user_id').eq('user_id', user.id),
    supabase.from('blocked_users').select('blocked_user_id').eq('user_id', user.id),
  ]);
  const excludeIds = new Set<string>([
    user.id,
    ...((swipes ?? []).map((s) => s.swiped_user_id)),
    ...((blocks ?? []).map((b) => b.blocked_user_id)),
  ]);

  let query = supabase
    .from('profiles')
    .select('*, profile_images(url, position, is_visible)')
    .eq('onboarding_completed', true);

  if (filters.minAge) query = query.gte('age', filters.minAge);
  if (filters.maxAge) query = query.lte('age', filters.maxAge);
  if (filters.gender) query = query.eq('gender', filters.gender);

  const { data, error } = await query.limit(50);
  if (error) {
    console.error('Error fetching discover profiles:', error);
    return [];
  }

  return (data ?? [])
    .filter((p: any) => !excludeIds.has(p.id))
    .map((p: any) => ({
      ...p,
      images: (p.profile_images ?? [])
        .filter((img: any) => img.is_visible !== false)
        .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
        .map((img: any) => img.url),
    }));
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
