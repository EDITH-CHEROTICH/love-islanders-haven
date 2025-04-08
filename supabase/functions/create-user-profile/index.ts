
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, name, emailVerified, verified } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    // Create admin client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name || 'User';
    if (emailVerified !== undefined) updateData.email_verified = emailVerified || false;
    if (verified !== undefined) updateData.verified = verified || false;
    
    // Create or update the profile with admin privileges
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updateData
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Profile created/updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-user-profile function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to create/update profile', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
