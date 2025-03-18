
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
