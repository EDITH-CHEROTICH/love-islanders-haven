
import { useState, useEffect } from 'react';
import { useDatingSafety, DatePlan } from '@/hooks/use-dating-safety';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useGoogleCalendar, CalendarEvent } from '@/hooks/use-google-calendar';

export function useProfileCalendar() {
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchDatePlans } = useDatingSafety();
  const { isAuthenticated } = useAuth();
  const { 
    googleEvents, 
    isLoading: isLoadingGoogle, 
    isAuthorized: isGoogleAuthorized,
    initiateGoogleAuth,
    fetchGoogleEvents
  } = useGoogleCalendar();

  useEffect(() => {
    if (isAuthenticated) {
      loadDatePlans();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadDatePlans = async () => {
    setIsLoading(true);
    try {
      const plans = await fetchDatePlans();
      setDatePlans(plans);
    } catch (error) {
      console.error('Error loading date plans:', error);
      setDatePlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current user ID for Google events
  const { user } = useAuth();
  const currentUserId = user?.id || 'unknown-user';

  // Transform Google events to be compatible with our date plans format
  const transformedGoogleEvents: DatePlan[] = googleEvents.map(event => ({
    id: `google-${event.id}`,
    user_id: currentUserId, // Add required user_id
    location: event.location || 'No location specified',
    date_time: event.date_time,
    notes: event.notes,
    location_sharing_enabled: false,
    created_at: new Date().toISOString(), // Add required created_at
    source: 'google'
  }));

  // Combine app date plans with Google Calendar events
  const allEvents = [...datePlans, ...transformedGoogleEvents];

  const getUpcomingDates = () => {
    const now = new Date();
    return allEvents.filter(plan => {
      const planDate = new Date(plan.date_time);
      return planDate > now;
    }).sort((a, b) => {
      return new Date(a.date_time).getTime() - new Date(b.date_time).getTime();
    });
  };

  const getPastDates = () => {
    const now = new Date();
    return allEvents.filter(plan => {
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
    isLoading: isLoading || isLoadingGoogle,
    refresh: async () => {
      await loadDatePlans();
      if (isGoogleAuthorized) {
        await fetchGoogleEvents();
      }
    },
    isGoogleAuthorized,
    initiateGoogleAuth
  };
}
