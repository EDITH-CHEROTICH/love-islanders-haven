
import { supabase } from "@/integrations/supabase/client";
import { ProfilePreferences } from "@/components/ProfileSetup";

export interface SupabaseProfile {
  id: string;
  name: string;
  age: number;
  location?: string;
  bio?: string;
  gender: 'male' | 'female' | 'other';
  gender_preference: 'male' | 'female' | 'both';
  dob: string;
  show_age: boolean;
  education?: string;
  occupation?: string;
  height?: number;
  height_cm?: number;
  height_unit?: 'ft' | 'm';
  has_pets: boolean;
  pet_type?: string;
  has_children: boolean;
  children_count?: number;
  relationship_goal?: 'long-term' | 'casual' | 'both';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

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
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data as SupabaseProfile;
};

export const saveUserInterests = async (interests: string[]) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // First, fetch all interest IDs
  const { data: interestData, error: interestError } = await supabase
    .from('interests')
    .select('id, name')
    .in('name', interests);

  if (interestError) {
    console.error('Error fetching interests:', interestError);
    throw interestError;
  }

  // Delete existing profile interests
  const { error: deleteError } = await supabase
    .from('profile_interests')
    .delete()
    .eq('profile_id', userId);

  if (deleteError) {
    console.error('Error deleting existing interests:', deleteError);
    throw deleteError;
  }

  // Insert new profile interests
  const profileInterests = interestData.map(interest => ({
    profile_id: userId,
    interest_id: interest.id
  }));

  if (profileInterests.length > 0) {
    const { error: insertError } = await supabase
      .from('profile_interests')
      .insert(profileInterests);

    if (insertError) {
      console.error('Error saving interests:', insertError);
      throw insertError;
    }
  }

  return true;
};

export const saveProfileImage = async (imageUrl: string, position: number) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Check if position already exists for this user
  const { data: existingImage } = await supabase
    .from('profile_images')
    .select('id')
    .eq('profile_id', userId)
    .eq('position', position)
    .single();

  if (existingImage) {
    // Update existing image
    const { error } = await supabase
      .from('profile_images')
      .update({ url: imageUrl })
      .eq('id', existingImage.id);

    if (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  } else {
    // Insert new image
    const { error } = await supabase
      .from('profile_images')
      .insert({
        profile_id: userId,
        url: imageUrl,
        position
      });

    if (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  return true;
};

export const saveProfileVideo = async (videoUrl: string) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('profile_videos')
    .insert({
      profile_id: userId,
      url: videoUrl
    });

  if (error) {
    console.error('Error saving video:', error);
    throw error;
  }

  return true;
};

export const fetchProfileImages = async (profileId?: string) => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profile_images')
    .select('*')
    .eq('profile_id', userId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching images:', error);
    throw error;
  }

  return data.map(image => image.url);
};

export const fetchProfileVideos = async (profileId?: string) => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profile_videos')
    .select('*')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }

  return data.map(video => video.url);
};

export const fetchProfileInterests = async (profileId?: string) => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profile_interests')
    .select('interests(name)')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }

  return data.map(item => item.interests.name);
};
