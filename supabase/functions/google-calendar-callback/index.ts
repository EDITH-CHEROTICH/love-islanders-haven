
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // If there's an error, redirect to an error page
    if (error) {
      return new Response(
        `Google auth error: ${error}`,
        { status: 400 }
      );
    }

    // If code or state is missing, return an error
    if (!code || !state) {
      return new Response(
        "Missing code or state parameter",
        { status: 400 }
      );
    }

    // Create a Supabase client with the service role key to look up the user by state
    const adminSupabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find user with matching oauth_state
    const { data: users, error: userError } = await adminSupabase
      .from('users')
      .select('id, raw_user_meta_data')
      .filter('raw_user_meta_data->oauth_state', 'eq', state)
      .limit(1);

    if (userError || !users || users.length === 0) {
      return new Response(
        "Invalid state parameter or user not found",
        { status: 400 }
      );
    }

    const user = users[0];
    const userId = user.id;
    const redirectUrl = user.raw_user_meta_data.redirect_url || '/profile';

    // Exchange the authorization code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
        redirect_uri: `${SUPABASE_URL}/functions/v1/google-calendar-callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      return new Response(
        `Failed to exchange token: ${tokenData.error}`,
        { status: 400 }
      );
    }

    // Store the tokens in the user's metadata
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          google_access_token: tokenData.access_token,
          google_refresh_token: tokenData.refresh_token,
          google_token_expires_at: Date.now() + (tokenData.expires_in * 1000),
          google_calendar_connected: true,
        }
      }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      return new Response(
        `Failed to update user: ${updateError.message}`,
        { status: 500 }
      );
    }

    // Clear the oauth state from user metadata for security
    await adminSupabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          oauth_state: null
        }
      }
    );

    // Redirect back to the client app
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error("Error in Google Calendar callback:", error);
    return new Response(
      `Server error: ${error.message}`,
      { status: 500 }
    );
  }
});
