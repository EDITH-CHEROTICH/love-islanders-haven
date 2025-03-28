
// Location Services Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Initialize Supabase client
const supabaseClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  return createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false }
  });
};

serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get API key from environment
    const apiKey = Deno.env.get('LOCATION_API_KEY');
    if (!apiKey) {
      throw new Error('Missing LOCATION_API_KEY');
    }

    // Check request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const { action, location } = await req.json();
    
    // Create Supabase client
    const supabase = supabaseClient(req);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${action} request for user ${user.id}`);

    if (action === 'update' && location) {
      // Update user location in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: location.latitude,
          longitude: location.longitude,
          location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(`Failed to update location: ${error.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Location updated successfully',
        location
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else if (action === 'get') {
      // Get user's current location from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, location_updated_at')
        .eq('id', user.id)
        .single();

      if (error) {
        throw new Error(`Failed to get location: ${error.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          updated_at: data.location_updated_at
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle invalid action
    return new Response(JSON.stringify({ 
      error: 'Invalid action. Supported actions: update, get' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`Error in location-services function:`, error.message);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
