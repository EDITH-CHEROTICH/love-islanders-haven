
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
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('Authentication error:', authError);
    throw new Error('Authentication error');
  }
  
  if (!user) {
    console.warn('No authenticated user found');
    return null;
  }
  
  const userId = user.id;

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_images (url, position),
      profile_interests (interests(name))
    `)
    .eq('id', userId)
    .maybeSingle(); // Using maybeSingle instead of single to avoid errors if no profile exists

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  
  if (!data) {
    console.warn('No profile found for user:', userId);
    return null;
  }

  // Cast relationship_goal to the allowed type values or use a default
  const relationshipGoal = data.relationship_goal as 'long-term' | 'casual' | 'both' | undefined;
  
  // Cast gender to the allowed type values or use a default
  const gender = data.gender as 'male' | 'female' | 'other' | undefined;
  
  // Cast gender_preference to match the expected literal types
  const genderPreference = data.gender_preference as 'male' | 'female' | 'both' | undefined;

  // Cast height_unit to the allowed type values or default to undefined
  const heightUnit = data.height_unit as 'ft' | 'm' | undefined;

  // Convert dob string to Date object if it exists
  const dob = data.dob ? new Date(data.dob) : undefined;

  // Transform the data to match our SupabaseProfile type
  const profile: SupabaseProfile = {
    ...data,
    dob, // Use the converted Date object or undefined
    gender: gender || undefined, // Use undefined if gender is not set
    gender_preference: genderPreference || 'both', // Use 'both' as a default value
    relationship_goal: relationshipGoal || 'both', // Ensure it matches our type
    height_unit: heightUnit, // Use the properly cast height_unit value
    images: data.profile_images 
      ? data.profile_images
          .sort((a: any, b: any) => a.position - b.position)
          .map((img: any) => img.url) 
      : [],
    interests: data.profile_interests
      ? data.profile_interests.map((pi: any) => pi.interests.name)
      : []
  };

  return profile;
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
