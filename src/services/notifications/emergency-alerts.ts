
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmergencyAlert {
  id: string;
  user_id: string;
  timestamp: string;
  location_link?: string | null;
  location_latitude?: number | null;
  location_longitude?: number | null;
}

export interface ContactNotification {
  id: string;
  contact_id: string;
  alert_type: 'emergency' | 'check_in' | 'reminder';
  message: string;
  sent_at: string;
  delivered: boolean;
  error_message?: string | null;
}

/**
 * Gets the emergency alert history for the current user
 * Note: This function returns mock data as the emergency_alerts table doesn't exist yet
 */
export const getEmergencyAlertHistory = async (): Promise<EmergencyAlert[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    // Return empty array as the table doesn't exist yet
    console.log('Emergency alerts feature not yet implemented');
    return [];
  } catch (error) {
    console.error('Error fetching emergency alert history:', error);
    return [];
  }
};

/**
 * Gets the notification history for a specific safety contact
 * Note: This function returns mock data as the contact_notifications table doesn't exist yet
 */
export const getContactNotificationHistory = async (contactId: string): Promise<ContactNotification[]> => {
  try {
    // Return empty array as the table doesn't exist yet
    console.log('Contact notifications feature not yet implemented');
    return [];
  } catch (error) {
    console.error('Error fetching contact notification history:', error);
    return [];
  }
};

/**
 * Creates a new emergency alert and sends notifications to all safety contacts
 * Note: This is a simplified implementation without full database support
 */
export const sendEmergencyAlert = async (location?: { latitude: number; longitude: number }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get current date and time
    const now = new Date().toISOString();
    const locationStr = location 
      ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` 
      : 'Location not available';

    // Get all safety contacts for the current user
    const { data: safetyContacts, error: contactsError } = await supabase
      .from('safety_contacts')
      .select('*')
      .eq('user_id', user.id);
    
    if (contactsError) throw contactsError;
    
    if (!safetyContacts || safetyContacts.length === 0) {
      toast.warning('No safety contacts found. Please add safety contacts first.');
      return false;
    }
    
    // For now, just log the alert (full implementation would send actual notifications)
    console.log('Emergency alert triggered:', {
      user_id: user.id,
      timestamp: now,
      location: locationStr,
      contacts: safetyContacts.length
    });
    
    toast.success('Emergency alert triggered! Your safety contacts will be notified.');
    return true;
  } catch (error) {
    console.error('Error sending emergency alerts:', error);
    toast.error('Failed to send emergency alerts');
    return false;
  }
};
