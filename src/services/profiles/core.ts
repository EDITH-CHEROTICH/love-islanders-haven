import { supabase } from "@/integrations/supabase/client";
import { ProfilePreferences } from "@/components/ProfileSetup";
import { SupabaseProfile } from "./types";
import { requestAndUpdateLocation } from "./location";

export const createOrUpdateProfile = async (preferences: ProfilePreferences, name: string, bio = '') => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

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
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_images (url, position),
      profile_interests (interests(name))
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  // Transform the data to match our SupabaseProfile type
  const profile: SupabaseProfile = {
    ...data,
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
