
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const uploadMessageFile = async (
  matchId: string,
  file: File,
  fileType: 'image' | 'audio'
): Promise<string> => {
  // For demo profiles, simulate upload
  if (matchId.includes('sample-profile') || matchId.includes('profile-')) {
    // Create a local object URL for preview
    return URL.createObjectURL(file);
  }
  
  // Real file upload to Supabase
  const fileExt = file.name.split('.').pop();
  const fileName = `${matchId}/${uuidv4()}.${fileExt}`;
  const filePath = `messages/${fileName}`;
  
  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);
  
  if (uploadError) {
    throw uploadError;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
  
  return publicUrl;
};
