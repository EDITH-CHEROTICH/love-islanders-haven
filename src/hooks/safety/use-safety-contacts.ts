
import { useState } from 'react';
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

export function useSafetyContacts() {
  const [safetyContacts, setSafetyContacts] = useState<SafetyContact[]>([]);
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

  return {
    safetyContacts,
    isLoading,
    fetchSafetyContacts,
    addSafetyContact,
    removeSafetyContact
  };
}
