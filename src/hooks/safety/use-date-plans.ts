
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export function useDatePlans() {
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    datePlans,
    isLoading,
    addDatePlan,
    fetchDatePlans
  };
}
