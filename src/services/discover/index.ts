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
