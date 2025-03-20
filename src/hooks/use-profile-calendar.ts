
import { useState, useEffect } from 'react';
import { useDatingSafety, DatePlan } from '@/hooks/use-dating-safety';
import { supabase } from '@/integrations/supabase/client';

export function useProfileCalendar() {
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchDatePlans } = useDatingSafety();

  useEffect(() => {
    loadDatePlans();
  }, []);

  const loadDatePlans = async () => {
    setIsLoading(true);
    try {
      const plans = await fetchDatePlans();
      setDatePlans(plans);
    } catch (error) {
      console.error('Error loading date plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpcomingDates = () => {
    const now = new Date();
    return datePlans.filter(plan => {
      const planDate = new Date(plan.date_time);
      return planDate > now;
    }).sort((a, b) => {
      return new Date(a.date_time).getTime() - new Date(b.date_time).getTime();
    });
  };

  const getPastDates = () => {
    const now = new Date();
    return datePlans.filter(plan => {
      const planDate = new Date(plan.date_time);
      return planDate <= now;
    }).sort((a, b) => {
      return new Date(b.date_time).getTime() - new Date(a.date_time).getTime();
    });
  };

  return {
    datePlans,
    upcomingDates: getUpcomingDates(),
    pastDates: getPastDates(),
    isLoading,
    refresh: loadDatePlans
  };
}
