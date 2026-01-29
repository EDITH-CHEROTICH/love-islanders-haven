
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
      
      // Map database fields to interface fields
      const contacts = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: (item as any).name || item.contact_name || '',
        phone_number: (item as any).phone_number || item.contact_phone || '',
        email: item.contact_email || undefined,
        created_at: item.created_at
      })) as SafetyContact[];
      
      setSafetyContacts(contacts);
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
            contact_name: contact.name,
            contact_phone: contact.phone_number,
            contact_email: contact.email,
            name: contact.name,
            phone_number: contact.phone_number
          } as any
        ])
        .select();
      
      if (error) throw error;
      
      const newContact = {
        id: data![0].id,
        user_id: data![0].user_id,
        name: contact.name,
        phone_number: contact.phone_number,
        email: contact.email,
        created_at: data![0].created_at
      } as SafetyContact;
      
      setSafetyContacts(prev => [newContact, ...prev]);
      
      toast.success(`${contact.name} has been added as a safety contact`);
      
      return newContact;
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
