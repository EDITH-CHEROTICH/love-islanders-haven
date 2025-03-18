
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
 */
export const getEmergencyAlertHistory = async (): Promise<EmergencyAlert[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const { data, error } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data as EmergencyAlert[];
  } catch (error) {
    console.error('Error fetching emergency alert history:', error);
    return [];
  }
};

/**
 * Gets the notification history for a specific safety contact
 */
export const getContactNotificationHistory = async (contactId: string): Promise<ContactNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_notifications')
      .select('*')
      .eq('contact_id', contactId)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ContactNotification[];
  } catch (error) {
    console.error('Error fetching contact notification history:', error);
    return [];
  }
};

/**
 * Creates a new emergency alert and sends notifications to all safety contacts
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

    // Create emergency alert in database
    const { error: alertError } = await supabase
      .from('emergency_alerts')
      .insert([{
        user_id: user.id,
        timestamp: now,
        location_link: locationStr,
        location_latitude: location?.latitude,
        location_longitude: location?.longitude
      }]);
    
    if (alertError) throw alertError;
    
    // Get all safety contacts for the current user
    const { data: safetyContacts, error: contactsError } = await supabase
      .from('safety_contacts')
      .select('*')
      .eq('user_id', user.id);
    
    if (contactsError) throw contactsError;
    
    if (!safetyContacts || safetyContacts.length === 0) {
      toast.warning('No safety contacts found. Emergency alert created but no notifications were sent.');
      return true;
    }
    
    // For each safety contact, create an alert notification
    const promises = safetyContacts.map(async (contact) => {
      const { error } = await supabase
        .from('contact_notifications')
        .insert([{
          contact_id: contact.id,
          alert_type: 'emergency',
          message: `EMERGENCY ALERT: ${user.email} has triggered an emergency alert. Location: ${locationStr}`,
          sent_at: now,
          delivered: false
        }]);
      
      return { contact, error };
    });
    
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      console.error('Some alerts failed to send:', errors);
      toast.error('Some emergency alerts failed to send');
      return false;
    }
    
    toast.success('Emergency alerts sent to all safety contacts');
    return true;
  } catch (error) {
    console.error('Error sending emergency alerts:', error);
    toast.error('Failed to send emergency alerts');
    return false;
  }
};
