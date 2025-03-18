
import { useSafetyContacts, type SafetyContact } from './safety/use-safety-contacts';
import { useDatePlans, type DatePlan } from './safety/use-date-plans';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export { type SafetyContact, type DatePlan };

export function useDatingSafety() {
  const safetyContactsHook = useSafetyContacts();
  const datePlansHook = useDatePlans();
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  // Send emergency alert to safety contacts
  const sendEmergencyAlert = async (location?: { latitude: number; longitude: number }) => {
    setIsSendingAlert(true);
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
      
      // For each safety contact, create an alert notification
      const promises = safetyContactsHook.safetyContacts.map(async (contact) => {
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
    } finally {
      setIsSendingAlert(false);
    }
  };

  return {
    ...safetyContactsHook,
    ...datePlansHook,
    isSendingAlert,
    sendEmergencyAlert
  };
}
