
import { supabase } from "@/integrations/supabase/client";

export const saveProfileImage = async (imageUrl: string, position: number, isVisible = true) => {
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
      .update({ 
        url: imageUrl,
        is_visible: isVisible 
      })
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
        position,
        is_visible: isVisible
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

export const fetchVisibleProfileImages = async (profileId?: string) => {
  const user = supabase.auth.getUser();
  const userId = profileId || (await user).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profile_images')
    .select('*')
    .eq('profile_id', userId)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching visible images:', error);
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
