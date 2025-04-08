
import { supabase } from "@/integrations/supabase/client";
import { ProfilePreferences } from "@/components/ProfileSetup";
import { SupabaseProfile } from "./types";
import { requestAndUpdateLocation } from "./location";

export const createOrUpdateProfile = async (preferences: ProfilePreferences, name: string, bio = '') => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Convert Date to ISO string for PostgreSQL
  const dobString = preferences.dob.toISOString().split('T')[0];

  const profileData = {
    id: userId,
    name,
    age: preferences.age,
    gender: preferences.gender,
    gender_preference: preferences.genderPreference,
    dob: dobString,
    show_age: preferences.showAge,
    education: preferences.education,
    occupation: preferences.occupation,
    height: preferences.height,
    height_cm: preferences.heightCm,
    height_unit: preferences.heightUnit,
    has_pets: preferences.hasPets || false,
    pet_type: preferences.petType,
    has_children: preferences.hasChildren || false,
    children_count: preferences.childrenCount,
    bio,
    location: '',
    verified: false,
    relationship_goal: 'both'
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' });

  if (error) {
    console.error('Error saving profile:', error);
    throw error;
  }

  // Try to get and update user's location after profile creation
  // This is done in a non-blocking way so it doesn't affect profile creation
  try {
    requestAndUpdateLocation().catch(err => console.error('Error updating location after profile creation:', err));
  } catch (error) {
    console.error('Error requesting location after profile creation:', error);
  }

  return profileData;
};

export const fetchUserProfile = async () => {
  try {
    console.log('fetchUserProfile: Starting to fetch user profile');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error('Authentication error');
    }
    
    if (!user) {
      console.warn('No authenticated user found');
      return null;
    }
    
    console.log('fetchUserProfile: User authenticated, id:', user.id);
    const userId = user.id;

    // Fetch the user's profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_interests (interests(name))
      `)
      .eq('id', userId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors if no profile exists

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }
    
    if (!profileData) {
      console.warn('No profile found for user:', userId);
      return {
        id: userId,
        name: user.email?.split('@')[0] || 'User',
        images: [],
        bio: '',
        verified: false
      };
    }
    
    console.log('fetchUserProfile: Found profile data');
    
    // Fetch the user's profile images separately
    const { data: imageData, error: imageError } = await supabase
      .from('profile_images')
      .select('url, position, is_visible')
      .eq('profile_id', userId)
      .order('position', { ascending: true });
      
    if (imageError) {
      console.error('Error fetching profile images:', imageError);
    } else {
      console.log('fetchUserProfile: Found image data:', imageData?.length || 0, 'images');
    }

    // Cast relationship_goal to the allowed type values or use a default
    const relationshipGoal = profileData.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
    
    // Cast gender to the allowed type values or use a default
    const gender = profileData.gender as 'male' | 'female' | 'other' | undefined;
    
    // Cast gender_preference to match the expected literal types
    const genderPreference = profileData.gender_preference as 'male' | 'female' | 'both' | undefined;

    // Cast height_unit to the allowed type values or default to undefined
    const heightUnit = profileData.height_unit as 'ft' | 'm' | undefined;

    // Convert dob string to Date object if it exists
    const dob = profileData.dob ? new Date(profileData.dob) : undefined;

    // Transform the data to match our SupabaseProfile type
    const profile = {
      ...profileData,
      dob, // Use the converted Date object or undefined
      gender: gender || undefined, // Use undefined if gender is not set
      gender_preference: genderPreference || 'both', // Use 'both' as a default value
      relationship_goal: relationshipGoal || 'both', // Ensure it matches our type
      height_unit: heightUnit, // Use the properly cast height_unit value
      show_age: profileData.show_age !== undefined ? profileData.show_age : true, // Make sure show_age is included
      images: imageData 
        ? imageData
            .filter(img => img.is_visible)
            .sort((a, b) => a.position - b.position)
            .map(img => img.url) 
        : [],
      interests: profileData.profile_interests
        ? profileData.profile_interests.map(pi => pi.interests.name)
        : []
    };

    console.log('fetchUserProfile: Returning complete profile data');
    return profile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};

export const updateRelationshipGoal = async (goal: 'long-term' | 'casual' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ relationship_goal: goal })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating relationship goal:', error);
    throw error;
  }

  return data;
};

export const updateGenderPreference = async (preference: 'male' | 'female' | 'both') => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ gender_preference: preference })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating gender preference:', error);
    throw error;
  }

  return data;
};
