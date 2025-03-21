
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Google tokens from user metadata
    const accessToken = user.user_metadata.google_access_token;
    const refreshToken = user.user_metadata.google_refresh_token;
    const tokenExpiresAt = user.user_metadata.google_token_expires_at;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired and refresh if necessary
    let currentAccessToken = accessToken;
    if (tokenExpiresAt && Date.now() > tokenExpiresAt) {
      // Refresh the access token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_OAUTH_CLIENT_ID!,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const refreshData = await refreshResponse.json();
      
      if (!refreshResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to refresh token', details: refreshData }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update the access token in user metadata
      const newExpiresAt = Date.now() + (refreshData.expires_in * 1000);
      await supabase.auth.updateUser({
        data: {
          google_access_token: refreshData.access_token,
          google_token_expires_at: newExpiresAt
        }
      });

      currentAccessToken = refreshData.access_token;
    }

    // Get request parameters
    const requestData = await req.json();
    const timeMin = requestData.timeMin || new Date().toISOString();
    const timeMax = requestData.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch events from Google Calendar
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`,
      {
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Google Calendar events', details: errorData }),
        { status: calendarResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const calendarData = await calendarResponse.json();
    
    // Filter events that contain "date" in title, summary, or description
    // or have the keyword "dating" or "date" in them
    const dateEvents = calendarData.items.filter((event: any) => {
      const summary = (event.summary || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      
      return (
        summary.includes('date') || 
        summary.includes('dating') ||
        description.includes('date') ||
        description.includes('dating')
      );
    });

    return new Response(
      JSON.stringify({ events: dateEvents }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
