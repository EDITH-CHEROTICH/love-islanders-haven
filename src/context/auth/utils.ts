
import { supabase } from '@/integrations/supabase/client';

export const createOrUpdateProfile = async (userId: string, email: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        name: email.split('@')[0], // Default name from email
        email: email
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error("Error creating/updating profile:", error);
    } else {
      console.log("Profile created/updated successfully");
    }
  } catch (profileError) {
    console.error("Exception creating/updating profile:", profileError);
  }
};
