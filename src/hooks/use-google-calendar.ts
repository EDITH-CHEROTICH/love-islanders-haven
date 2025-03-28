
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  location?: string;
  notes?: string;
  date_time: string;
  end_time?: string;
  source: 'app' | 'google';
  location_sharing_enabled?: boolean;
}

export function useGoogleCalendar() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkGoogleAuth();
    }
  }, [isAuthenticated]);

  const checkGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-google-auth', {
        method: 'POST'
      });

      if (error) {
        console.error('Error checking Google auth:', error);
        return;
      }

      setIsAuthorized(data.isAuthorized);
      
      if (data.isAuthorized) {
        fetchGoogleEvents();
      }
    } catch (error) {
      console.error('Failed to check Google auth status:', error);
    }
  };

  const initiateGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        method: 'POST',
        body: {
          redirectUrl: window.location.origin + '/profile'
        }
      });

      if (error) {
        console.error('Error initiating Google auth:', error);
        toast.error('Failed to connect to Google Calendar');
        return;
      }

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate Google auth:', error);
      toast.error('Failed to connect to Google Calendar');
    }
  };

  const fetchGoogleEvents = async () => {
    if (!isAuthorized) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-google-events', {
        method: 'POST',
        body: {
          timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          timeMax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ahead
        }
      });

      if (error) {
        console.error('Error fetching Google events:', error);
        return;
      }

      const formattedEvents: CalendarEvent[] = data.events.map((event: GoogleCalendarEvent) => ({
        id: event.id,
        title: event.summary,
        location: event.location,
        notes: event.description,
        date_time: event.start.dateTime,
        end_time: event.end.dateTime,
        source: 'google'
      }));

      setGoogleEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch Google events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    try {
      const { error } = await supabase.functions.invoke('disconnect-google-calendar', {
        method: 'POST'
      });

      if (error) {
        console.error('Error disconnecting Google Calendar:', error);
        toast.error('Failed to disconnect Google Calendar');
        return;
      }

      setIsAuthorized(false);
      setGoogleEvents([]);
      toast.success('Successfully disconnected Google Calendar');
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error);
      toast.error('Failed to disconnect Google Calendar');
    }
  };

  return {
    isAuthorized,
    isLoading,
    googleEvents,
    initiateGoogleAuth,
    fetchGoogleEvents,
    disconnectGoogleCalendar
  };
}
