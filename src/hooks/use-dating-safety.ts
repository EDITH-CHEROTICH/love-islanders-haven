
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SafetyContact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  email?: string;
  created_at: string;
}

export interface DatePlan {
  id: string;
  user_id: string;
  location: string;
  date_time: string;
  notes?: string;
  contact_id?: string;
  location_sharing_enabled: boolean;
  created_at: string;
}

export function useDatingSafety() {
  const [safetyContacts, setSafetyContacts] = useState<SafetyContact[]>([]);
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch safety contacts
  const fetchSafetyContacts = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('safety_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSafetyContacts(data as SafetyContact[]);
    } catch (error) {
      console.error('Error fetching safety contacts:', error);
      toast.error('Failed to load safety contacts');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a safety contact
  const addSafetyContact = async (contact: Omit<SafetyContact, 'id' | 'user_id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('safety_contacts')
        .insert([
          {
            user_id: user.id,
            name: contact.name,
            phone_number: contact.phone_number,
            email: contact.email
          }
        ])
        .select();
      
      if (error) throw error;
      
      setSafetyContacts(prev => [data![0] as SafetyContact, ...prev]);
      
      toast.success(`${contact.name} has been added as a safety contact`);
      
      return data![0] as SafetyContact;
    } catch (error) {
      console.error('Error adding safety contact:', error);
      toast.error('Failed to add safety contact');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a safety contact
  const removeSafetyContact = async (contactId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('safety_contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) throw error;
      
      setSafetyContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      toast.success('Safety contact has been removed');
      
      return true;
    } catch (error) {
      console.error('Error removing safety contact:', error);
      toast.error('Failed to remove safety contact');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a date plan
  const addDatePlan = async (plan: Omit<DatePlan, 'id' | 'user_id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('date_plans')
        .insert([
          {
            user_id: user.id,
            location: plan.location,
            date_time: plan.date_time,
            notes: plan.notes,
            contact_id: plan.contact_id,
            location_sharing_enabled: plan.location_sharing_enabled
          }
        ])
        .select();
      
      if (error) throw error;
      
      const newPlan = data![0] as DatePlan;
      setDatePlans(prev => [newPlan, ...prev]);
      
      toast.success(`Date plan for ${new Date(plan.date_time).toLocaleDateString()} has been scheduled`);
      
      return newPlan;
    } catch (error) {
      console.error('Error adding date plan:', error);
      toast.error('Failed to add date plan');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get date plans
  const fetchDatePlans = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('date_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      
      setDatePlans(data as DatePlan[]);
      return data as DatePlan[];
    } catch (error) {
      console.error('Error fetching date plans:', error);
      toast.error('Failed to load date plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchSafetyContacts();
    fetchDatePlans();
  }, []);

  return {
    safetyContacts,
    datePlans,
    isLoading,
    fetchSafetyContacts,
    addSafetyContact,
    removeSafetyContact,
    addDatePlan,
    fetchDatePlans
  };
}
