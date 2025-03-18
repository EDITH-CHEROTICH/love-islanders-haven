
import { useSafetyContacts, type SafetyContact } from './safety/use-safety-contacts';
import { useDatePlans, type DatePlan } from './safety/use-date-plans';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendEmergencyAlert } from '@/services/notifications/emergency-alerts';

export { type SafetyContact, type DatePlan };

export function useDatingSafety() {
  const safetyContactsHook = useSafetyContacts();
  const datePlansHook = useDatePlans();
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  // Send emergency alert to safety contacts
  const handleSendEmergencyAlert = async (location?: { latitude: number; longitude: number }) => {
    setIsSendingAlert(true);
    try {
      const success = await sendEmergencyAlert(location);
      return success;
    } finally {
      setIsSendingAlert(false);
    }
  };

  return {
    ...safetyContactsHook,
    ...datePlansHook,
    isSendingAlert,
    sendEmergencyAlert: handleSendEmergencyAlert
  };
}
