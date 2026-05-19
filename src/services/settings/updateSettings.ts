
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "./types";

// Update specific settings category
export const updateSettingsCategory = async <T extends keyof UserSettings>(
  category: T,
  settings: UserSettings[T]
): Promise<boolean> => {
  try {
    console.log(`Updating ${category} with:`, settings);
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      return false;
    }
    
    if (!userData.user) {
      console.log('No authenticated user found');
      return false;
    }
    
    const userId = userData.user.id;
    
    // Map settings category to simple table columns
    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (category === 'account_settings' && settings) {
      updateData.theme = (settings as any).theme || 'system';
    } else if (category === 'privacy_settings' && settings) {
      updateData.show_online_status = (settings as any).show_online_status ?? true;
      updateData.location_sharing = (settings as any).location_sharing ?? false;
    } else if (category === 'communication_settings' && settings) {
      updateData.notifications_enabled = (settings as any).notifications_enabled ?? true;
    }
    
    // First check if a settings record exists
    const { data: existingSettings, error: fetchError } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(`Error checking settings for ${category}:`, fetchError);
      return false;
    }
      
    if (!existingSettings) {
      // If no settings exist, create a new record with defaults
      console.log(`Creating new settings record for ${category}`);
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          ...updateData
        });
        
      if (insertError) {
        console.error(`Error creating settings for ${category}:`, insertError);
        return false;
      }
    } else {
      // Update existing settings
      console.log(`Updating existing settings for ${category}`);
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updateData as any)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error(`Error updating ${category}:`, updateError);
        return false;
      }
    }
    
    console.log(`Successfully updated ${category}`);
    return true;
  } catch (error) {
    console.error(`Error in updateSettingsCategory for ${category}:`, error);
    return false;
  }
};
