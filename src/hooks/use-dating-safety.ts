
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useDatingSafety = () => {
  const [safetyContacts, setSafetyContacts] = useState<SafetyContact[]>([]);
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch safety contacts
  const fetchSafetyContacts = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('safety_contacts')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSafetyContacts(data as SafetyContact[]);
      return data as SafetyContact[];
    } catch (error) {
      console.error('Error fetching safety contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load your safety contacts",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add a safety contact
  const addSafetyContact = async (contact: Omit<SafetyContact, 'id' | 'user_id' | 'created_at'>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('safety_contacts')
        .insert({
          user_id: user.id,
          name: contact.name,
          phone_number: contact.phone_number,
          email: contact.email
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      setSafetyContacts([...safetyContacts, data as SafetyContact]);
      toast({
        title: "Contact Added",
        description: `${contact.name} has been added as a safety contact`,
      });
      
      return data as SafetyContact;
    } catch (error) {
      console.error('Error adding safety contact:', error);
      toast({
        title: "Error",
        description: "Failed to add safety contact",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a safety contact
  const deleteSafetyContact = async (contactId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('safety_contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) throw error;
      
      setSafetyContacts(safetyContacts.filter(c => c.id !== contactId));
      toast({
        title: "Contact Removed",
        description: "Safety contact has been removed",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting safety contact:', error);
      toast({
        title: "Error",
        description: "Failed to remove safety contact",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a date plan
  const createDatePlan = async (plan: Omit<DatePlan, 'id' | 'user_id' | 'created_at'>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('date_plans')
        .insert({
          user_id: user.id,
          location: plan.location,
          date_time: plan.date_time,
          notes: plan.notes,
          contact_id: plan.contact_id,
          location_sharing_enabled: plan.location_sharing_enabled
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      setDatePlans([...datePlans, data as DatePlan]);
      toast({
        title: "Date Plan Created",
        description: "Your date plan has been saved",
      });
      
      return data as DatePlan;
    } catch (error) {
      console.error('Error creating date plan:', error);
      toast({
        title: "Error",
        description: "Failed to create date plan",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch date plans
  const fetchDatePlans = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
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
      toast({
        title: "Error",
        description: "Failed to load your date plans",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    safetyContacts,
    datePlans,
    isLoading,
    fetchSafetyContacts,
    addSafetyContact,
    deleteSafetyContact,
    createDatePlan,
    fetchDatePlans
  };
};
